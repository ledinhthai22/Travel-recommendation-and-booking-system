using GenerativeAI;
using Hangfire;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.DTOs.Notifications;
using travel_recommendation_and_booking_system.DTOs.Payment;
using travel_recommendation_and_booking_system.Helper;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Job;
using travel_recommendation_and_booking_system.Models;
using travel_recommendation_and_booking_system.SignalR;

namespace travel_recommendation_and_booking_system.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly VnPayConfig _vnpayConfig;
        private readonly AppDbContext _context;
        private readonly IHubContext<TravelRecommendationHub> _hubContext;
        private readonly IEmailService _emailService;
        private readonly INotificationService _notificationService;

        public PaymentService(
            IOptions<VnPayConfig> vnpayConfig,
            AppDbContext context,
            IHubContext<TravelRecommendationHub> hubContext,
            IEmailService emailService,
            INotificationService notificationService
            )
        {
            _vnpayConfig = vnpayConfig.Value;
            _context = context;
            _hubContext = hubContext;
            _emailService = emailService;
            _notificationService = notificationService;
        }

        public async Task<string> CreatePaymentUrlAsync(PaymentRequestDTO request, string remoteIpAddress, string txnRef)
        {
            var giuCho = await _context.GiuChos
                .Include(x => x.ChuyenKhoiHanh).ThenInclude(x => x.GiaChuyens)
                .FirstOrDefaultAsync(x => x.MaGiuCho == request.MaGiuCho && x.MaChuyen == request.MaChuyen)
                ?? throw new KeyNotFoundException("Phiên giữ chỗ không tồn tại.");
            var payload = await _context.PaymentPayloads
                .FirstOrDefaultAsync(x => x.MaGiuCho == giuCho.MaGiuCho);

            if (payload == null)
            {
                throw new Exception("Không tìm thấy PaymentPayload.");
            }

            payload.NgayBatDauThanhToan = DateTime.Now;

            await _context.SaveChangesAsync();
            if (giuCho.ThoiGianHetHan <= DateTime.Now)
                throw new InvalidOperationException("Phiên giữ chỗ đã hết hạn. Vui lòng chọn lại.");

            int tongKhach = request.SoNguoiLon + request.SoTreEm + request.SoEmBe;
            if (giuCho.SoChoGiu < tongKhach)
                throw new InvalidOperationException("Số chỗ giữ không khớp với số khách.");

            var gia = giuCho.ChuyenKhoiHanh.GiaChuyens.FirstOrDefault()
                ?? throw new InvalidOperationException("Chuyến chưa có bảng giá.");

            int soPhongDon = request.DanhSachHanhKhach?.Count(k => k.PhongDon && k.LoaiKhach == 1) ?? 0;

            decimal tongTienGoc =
                request.SoNguoiLon * gia.GiaNguoiLon +
                request.SoTreEm * gia.GiaTreEm +
                request.SoEmBe * gia.GiaEmBe;

            decimal phuThuPhongDon = soPhongDon * gia.PhuThuPhongDon;

            decimal giaTriGiam = 0;
            if (request.MaUuDai.HasValue)
            {
                var uuDai = await _context.UuDais
                    .FirstOrDefaultAsync(x => x.MaUuDai == request.MaUuDai.Value
                                           && x.TrangThai == 1
                                           && x.NgayBatDau <= DateTime.Now
                                           && x.NgayHetHan >= DateTime.Now
                                           && x.SoLuongDaDung < x.SoLuongToiDa);

                if (uuDai != null && tongTienGoc >= uuDai.DieuKienApDung)
                    giaTriGiam = Math.Round(tongTienGoc * uuDai.PhanTramGiam / 100, 0);
            }

            decimal tongTien = tongTienGoc + phuThuPhongDon - giaTriGiam;
            long vnpayAmount = Convert.ToInt64(tongTien * 100);

            var tz = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
            var localTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, tz);

          
            string secureTxnRef = $"{txnRef}";

            var vnpay = new VnPayLibrary();
            vnpay.AddRequestData("vnp_Version", _vnpayConfig.Version);
            vnpay.AddRequestData("vnp_Command", _vnpayConfig.Command);
            vnpay.AddRequestData("vnp_TmnCode", _vnpayConfig.TmnCode);
            vnpay.AddRequestData("vnp_Amount", vnpayAmount.ToString());
            vnpay.AddRequestData("vnp_CreateDate", localTime.ToString("yyyyMMddHHmmss"));
            vnpay.AddRequestData("vnp_CurrCode", _vnpayConfig.CurrCode);
            vnpay.AddRequestData("vnp_IpAddr", remoteIpAddress);
            vnpay.AddRequestData("vnp_Locale", _vnpayConfig.Locale);
            vnpay.AddRequestData("vnp_OrderInfo", $"Thanh toan Chuyến đi - {request.MaCodeChuyen}");
            vnpay.AddRequestData("vnp_OrderType", "other");
            vnpay.AddRequestData("vnp_ReturnUrl", _vnpayConfig.ReturnUrl);
            vnpay.AddRequestData("vnp_TxnRef", secureTxnRef); // Sử dụng secureTxnRef mới

            return vnpay.CreateRequestUrl(_vnpayConfig.BaseUrl, _vnpayConfig.HashSecret);
        }

        public async Task<(string RspCode, string Message)> ProcessVnPayIpnAsync(Dictionary<string, string> queryData)
        {
            try
            {
                var vnpay = new VnPayLibrary();
                string vnp_SecureHash = string.Empty;

                foreach (var kv in queryData)
                {
                    if (string.IsNullOrEmpty(kv.Key)) continue;
                    if (kv.Key == "vnp_SecureHash")
                        vnp_SecureHash = kv.Value;
                    else if (kv.Key.StartsWith("vnp_"))
                        vnpay.AddResponseData(kv.Key, kv.Value);
                }

                if (!vnpay.ValidateSignature(vnp_SecureHash, _vnpayConfig.HashSecret))
                {
                    Console.WriteLine("[IPN] ERROR: Invalid signature");
                    return ("97", "Invalid signature");
                }

                string txnRef = vnpay.GetResponseData("vnp_TxnRef");
                string responseCode = vnpay.GetResponseData("vnp_ResponseCode");
                string noiDung = vnpay.GetResponseData("vnp_OrderInfo");

                // Giữ nguyên chuỗi gốc dạng số nguyên (chuỗi xu) từ VNPay để đối chiếu chính xác
                string vnpAmountRaw = vnpay.GetResponseData("vnp_Amount");
                decimal vnpayAmount = Convert.ToDecimal(vnpAmountRaw) / 100;

                Console.WriteLine($"[IPN] TxnRef: {txnRef} | ResponseCode: {responseCode} | Amount: {vnpayAmount}");

                // Kiểm tra trùng lặp giao dịch (Idempotency)
                var existingThanhToan = await _context.ThanhToans
                    .FirstOrDefaultAsync(t => t.MaGiaoDich == txnRef);

                if (existingThanhToan != null)
                {
                    Console.WriteLine($"[IPN] Duplicate call detected for TxnRef {txnRef}, skip re-processing.");
                    return ("02", "Order already confirmed");
                }

                if (responseCode != "00")
                {
                    Console.WriteLine($"[IPN] Payment failed with code: {responseCode}");
                    return ("00", "Confirm success");
                }

            
                string[] parts = txnRef.Split('_');
                if (parts.Length < 2 || !int.TryParse(parts[1], out int maGiuCho))
                {
                    Console.WriteLine("[IPN] ERROR: TxnRef format is invalid.");
                    return ("01", "Order not found (Invalid TxnRef)");
                }

                // Tìm đích danh phiên giữ chỗ bằng Khóa Chính MaGiuCho thay vì tìm bằng MaChuyenCode chung chung
                var giuCho = await _context.GiuChos
                    .Include(x => x.ChuyenKhoiHanh).ThenInclude(x => x.GiaChuyens)
                    .FirstOrDefaultAsync(x => x.MaGiuCho == maGiuCho);

                if (giuCho == null)
                {
                    Console.WriteLine($"[IPN] ERROR: GiuCho with ID {maGiuCho} not found.");
                    return ("01", "GiuCho not found");
                }

                int maGiuChoId = giuCho.MaGiuCho;

                var payload = await _context.PaymentPayloads
                    .FirstOrDefaultAsync(x => x.MaGiuCho == maGiuChoId);

                if (payload == null)
                {
                    return ("01", "PaymentPayload not found");
                }

                if (payload.NgayBatDauThanhToan == null)
                {
                    return ("01", "Payment not started");
                }
                if (payload.NgayBatDauThanhToan > giuCho.ThoiGianHetHan)
                {
                    Console.WriteLine(
                        $"[IPN] Payment started after reservation expired."
                    );

                    return ("00", "Hold expired");
                }

                DonDatTour order;

                await using (var transaction = await _context.Database.BeginTransactionAsync())
                {
                    try
                    {
                        var chuyen = giuCho.ChuyenKhoiHanh;
                        var gia = chuyen.GiaChuyens.FirstOrDefault()
                            ?? throw new Exception("Không có bảng giá.");

                        int soPhongDon = payload.DanhSachHanhKhach?
                            .Count(k => k.PhongDon && k.LoaiKhach == 1) ?? 0;

                        decimal tongTienGoc =
                            payload.SoNguoiLon * gia.GiaNguoiLon +
                            payload.SoTreEm * gia.GiaTreEm +
                            payload.SoEmBe * gia.GiaEmBe;

                        decimal phuThuPhongDon = soPhongDon * gia.PhuThuPhongDon;

                        decimal giaTriGiam = 0;
                        UuDai? uuDai = null;

                        if (payload.MaUuDai.HasValue)
                        {
                            uuDai = await _context.UuDais
                                .FirstOrDefaultAsync(x => x.MaUuDai == payload.MaUuDai.Value);
                            if (uuDai != null && tongTienGoc >= uuDai.DieuKienApDung)
                                giaTriGiam = Math.Round(tongTienGoc * uuDai.PhanTramGiam / 100, 0);
                        }

                        decimal tongTien = tongTienGoc + phuThuPhongDon - giaTriGiam;


                        long expectedAmountRaw = Convert.ToInt64(tongTien * 100);
                        long actualAmountRaw = Convert.ToInt64(vnpAmountRaw);

                        if (expectedAmountRaw != actualAmountRaw)
                        {
                            Console.WriteLine($"[IPN] ERROR: Amount mismatch. Expected: {expectedAmountRaw}, Actual: {actualAmountRaw}");
                            await transaction.RollbackAsync();
                            return ("04", "Invalid amount");
                        }

                        var maDatCho = $"BK{DateTime.Now:yyyyMMddHHmmssfff}{Random.Shared.Next(100, 999)}";

                        order = new DonDatTour
                        {
                            MaNguoiDung = giuCho.MaNguoiDung,
                            MaChuyen = giuCho.MaChuyen,
                            MaDatCho = maDatCho,
                            GhiChu = payload.GhiChu ?? "",
                            MaUuDai = payload.MaUuDai,
                            SoNguoiLon = payload.SoNguoiLon,
                            SoTreEm = payload.SoTreEm,
                            SoEmBe = payload.SoEmBe,
                            SoPhongDon = soPhongDon,
                            GiaNguoiLonTaiDat = gia.GiaNguoiLon,
                            GiaTreEmTaiDat = gia.GiaTreEm,
                            GiaEmBeTaiDat = gia.GiaEmBe,
                            PhuThuPhongDonTaiDat = gia.PhuThuPhongDon,
                            GiaTriGiamTaiDat = giaTriGiam,
                            TongTien = tongTien,
                            NgayDat = DateTime.Now,
                            NgayCapNhat = DateTime.Now,
                            TrangThaiDon = 2,
                        };

                        _context.DonDatTours.Add(order);
                        await _context.SaveChangesAsync();

                        if (payload.DanhSachHanhKhach?.Any() == true)
                        {
                            var khachHangs = payload.DanhSachHanhKhach.Select(k => new KhachHang
                            {
                                MaDonDatTour = order.MaDonDatTour,
                                HoTen = k.HoTen,
                                SoDienThoai = k.SoDienThoai,
                                Email = k.Email,
                                NgaySinh = k.NgaySinh ?? DateTime.MinValue,
                                GioiTinh = k.GioiTinh,
                                LoaiKhach = k.LoaiKhach,
                                PhongDon = k.PhongDon,
                            }).ToList();

                            _context.KhachHangs.AddRange(khachHangs);
                        }

                        _context.ThanhToans.Add(new ThanhToan
                        {
                            MaDonDatTour = order.MaDonDatTour,
                            PhuongThucThanhToan = 1,
                            MaGiaoDich = txnRef,
                            NoiDung = noiDung,
                            NgayThanhToan = DateTime.Now,
                            TongTienThanhToan = vnpayAmount,
                            TrangThaiThanhToan = 1,
                        });

                        int tongKhach = payload.SoNguoiLon + payload.SoTreEm + payload.SoEmBe;
                        chuyen.SoChoDaDat += tongKhach;
                        chuyen.NgayCapNhat = DateTime.Now;

                        if (uuDai != null)
                            uuDai.SoLuongDaDung++;

                        _context.GiuChos.Remove(giuCho);
                        _context.PaymentPayloads.Remove(payload);

                        await _context.SaveChangesAsync();
                        await transaction.CommitAsync();
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"[IPN] Transaction Error: {ex.Message}");
                        throw;
                    }
                }

                try
                {

                    // Thông báo khi khách hàng thanh toán thành công
                    await _notificationService.CreateForUserAsync(
                            order.MaNguoiDung,
                            new CreateNotificationDTO
                            {
                                TieuDe = "Thanh toán thành công",
                                NoiDung = $"Đơn đặt tour {order.MaDatCho} đã thanh toán thành công.",
                                LoaiThongBao = (int)NotificationType.Payment,
                                LinkChiTiet = $"/tai-khoan/don-dat-tour/{order.MaDonDatTour}"
                            });


                    // Thông báo cho tất cả nhân viên (Admin + Staff) về đơn đặt tour mới
                    var staffIds = await _context.NhanViens
                        .Where(x => x.NgayXoa == null &&
                                   (x.MaVaiTro == RoleIds.Admin ||
                                    x.MaVaiTro == RoleIds.Staff))
                        .Select(x => x.MaNhanVien)
                        .ToListAsync();

                    await _notificationService.CreateForStaffsAsync(
                        staffIds,
                        new CreateNotificationDTO
                        {
                            TieuDe = "Có đơn đặt tour mới",
                            NoiDung = $"Khách hàng vừa thanh toán thành công đơn {order.MaDatCho}.",
                            LoaiThongBao = (int)NotificationType.Booking,
                            LinkChiTiet = $"/Quan-ly/don-dat-tour/{order.MaDonDatTour}"
                        });
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[Notification] {ex.Message}");
                }

                try
                {
                    BackgroundJob.Enqueue<BookingEmailJob>(job => job.SendBookingConfirmation(order.MaDonDatTour));
                    await _hubContext.Clients.Group("ADMIN_GROUP").SendAsync("BookingCreated", new
                    {
                        MaDonDatTour = order.MaDonDatTour,
                        MaDatCho = order.MaDatCho,
                        TongTien = order.TongTien,
                        NgayDat = order.NgayDat
                    });
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[IPN] Warning: Failed to enqueue email or signalR: {ex.Message}");
                }

                return ("00", "Confirm success");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[IPN] CRITICAL ERROR: {ex.Message}");
                return ("99", "System error");
            }
        }
    }
}