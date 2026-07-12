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
        private readonly IDashboardNotifier _dashboardNotifier;
        private readonly IHttpClientFactory _httpClientFactory;


        public PaymentService(
            IOptions<VnPayConfig> vnpayConfig,
            AppDbContext context,
            IHubContext<TravelRecommendationHub> hubContext,
            IEmailService emailService,
            INotificationService notificationService,
            IDashboardNotifier dashboardNotifier,
            IHttpClientFactory httpClientFactory
            )
        {
            _vnpayConfig = vnpayConfig.Value;
            _context = context;
            _hubContext = hubContext;
            _emailService = emailService;
            _notificationService = notificationService;
            _dashboardNotifier = dashboardNotifier;
            _httpClientFactory = httpClientFactory;
        }

        public async Task<(string PaymentUrl, string TxnRef)> CreatePaymentUrlAsync(PaymentRequestDTO request, string remoteIpAddress)
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

            if (giuCho.ThoiGianHetHan <= DateTime.Now)
            {
                throw new InvalidOperationException("Phiên giữ chỗ đã hết hạn. Vui lòng chọn lại.");
            }

            payload.NgayBatDauThanhToan = DateTime.Now;

            // Gia hạn thời gian giữ chỗ khi bắt đầu thanh toán qua VNPay
            var thoiGianToiThieu = DateTime.Now.AddMinutes(10);
            if (giuCho.ThoiGianHetHan < thoiGianToiThieu)
            {
                giuCho.ThoiGianHetHan = thoiGianToiThieu;
            }

            int tongKhach = request.SoNguoiLon + request.SoTreEm + request.SoEmBe;
            if (giuCho.SoChoGiu < tongKhach)
            {
                throw new InvalidOperationException("Số chỗ giữ không khớp với số khách.");
            }

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

            string secureTxnRef = DateTime.Now.Ticks.ToString();
            payload.TxnRef = secureTxnRef;

            await _context.SaveChangesAsync();

            var vnpay = new VnPayLibrary();
            vnpay.AddRequestData("vnp_Version", _vnpayConfig.Version);
            vnpay.AddRequestData("vnp_Command", _vnpayConfig.Command);
            vnpay.AddRequestData("vnp_TmnCode", _vnpayConfig.TmnCode);
            vnpay.AddRequestData("vnp_Amount", vnpayAmount.ToString());
            vnpay.AddRequestData("vnp_CreateDate", localTime.ToString("yyyyMMddHHmmss"));
            vnpay.AddRequestData("vnp_CurrCode", _vnpayConfig.CurrCode);
            vnpay.AddRequestData("vnp_IpAddr", remoteIpAddress);
            vnpay.AddRequestData("vnp_Locale", _vnpayConfig.Locale);
            vnpay.AddRequestData("vnp_OrderInfo", $"Thanh toan Chuyen di - {request.MaCodeChuyen}");
            vnpay.AddRequestData("vnp_OrderType", "other");
            vnpay.AddRequestData("vnp_ReturnUrl", _vnpayConfig.ReturnUrl);
            vnpay.AddRequestData("vnp_TxnRef", secureTxnRef);

            string url = vnpay.CreateRequestUrl(_vnpayConfig.BaseUrl, _vnpayConfig.HashSecret);

            return (url, secureTxnRef);
        }

        public async Task<(string RspCode, string Message)> ProcessVnPayIpnAsync(Dictionary<string, string> queryData)
        {
            Console.WriteLine($"[VNPay IPN] ===== Bắt đầu xử lý IPN lúc {DateTime.Now:yyyy-MM-dd HH:mm:ss} =====");
            Console.WriteLine("[VNPay IPN] Query nhận được: " + string.Join(" | ", queryData.Select(x => $"{x.Key}={x.Value}")));

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

                bool isValidSignature = vnpay.ValidateSignature(vnp_SecureHash, _vnpayConfig.HashSecret);
                Console.WriteLine($"[VNPay IPN] Kết quả kiểm tra chữ ký: {(isValidSignature ? "HỢP LỆ" : "KHÔNG HỢP LỆ")}");

                if (!isValidSignature)
                {
                    Console.WriteLine("[VNPay IPN] >>> DỪNG tại bước kiểm tra chữ ký. Không tạo đơn, không gửi email.");
                    return ("97", "Invalid signature");
                }

                string txnRef = vnpay.GetResponseData("vnp_TxnRef");
                string responseCode = vnpay.GetResponseData("vnp_ResponseCode");
                string noiDung = vnpay.GetResponseData("vnp_OrderInfo");
                string vnpAmountRaw = vnpay.GetResponseData("vnp_Amount");
                decimal vnpayAmount = Convert.ToDecimal(vnpAmountRaw) / 100;

                Console.WriteLine($"[VNPay IPN] txnRef={txnRef} | responseCode={responseCode} | amount={vnpayAmount:N0}");

                // Kiểm tra trùng lặp giao dịch (Idempotency)
                var existingThanhToan = await _context.ThanhToans
                    .FirstOrDefaultAsync(t => t.MaGiaoDich == txnRef);

                if (existingThanhToan != null)
                {
                    Console.WriteLine($"[VNPay IPN] >>> DỪNG: giao dịch {txnRef} đã tồn tại trong DB (ThanhToan.MaThanhToan={existingThanhToan.MaThanhToan}). Không tạo đơn/email lần nữa (idempotency).");
                    return ("02", "Order already confirmed");
                }

                if (responseCode != "00")
                {
                    Console.WriteLine($"[VNPay IPN] >>> DỪNG: VNPay báo giao dịch KHÔNG thành công (responseCode={responseCode}, khác '00'). Không tạo đơn, không gửi email.");
                    return ("00", "Confirm success");
                }

                var payload = await _context.PaymentPayloads
                    .FirstOrDefaultAsync(x => x.TxnRef == txnRef);

                if (payload == null)
                {
                    Console.WriteLine($"[VNPay IPN] >>> DỪNG: không tìm thấy PaymentPayload có TxnRef={txnRef}.");
                    return ("01", "PaymentPayload not found");
                }

                var giuCho = await _context.GiuChos
                    .Include(x => x.ChuyenKhoiHanh).ThenInclude(x => x.GiaChuyens)
                    .FirstOrDefaultAsync(x => x.MaGiuCho == payload.MaGiuCho);

                if (giuCho == null)
                {
                    Console.WriteLine($"[VNPay IPN] >>> DỪNG: không tìm thấy GiuCho (MaGiuCho={payload.MaGiuCho}). Có thể phiên giữ chỗ đã bị dọn (Hangfire cleanup) trước khi IPN tới.");
                    return ("01", "GiuCho not found");
                }

                if (payload.NgayBatDauThanhToan == null)
                {
                    Console.WriteLine("[VNPay IPN] >>> DỪNG: payload.NgayBatDauThanhToan là null (Payment not started).");
                    return ("01", "Payment not started");
                }

                bool canhBaoTreHan = payload.NgayBatDauThanhToan > giuCho.ThoiGianHetHan;
                DonDatTour order;

                await using (var transaction = await _context.Database.BeginTransactionAsync())
                {
                    try
                    {
                        var chuyen = giuCho.ChuyenKhoiHanh;
                        if (chuyen == null)
                        {
                            throw new Exception("ChuyenKhoiHanh is null.");
                        }

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
                            Console.WriteLine($"[VNPay IPN] >>> DỪNG: số tiền không khớp. Kỳ vọng={expectedAmountRaw}, Thực nhận={actualAmountRaw}. Rollback transaction.");
                            await transaction.RollbackAsync();
                            return ("04", "Invalid amount");
                        }

                        var maDatCho = $"BK{DateTime.Now:yyyyMMddHHmmssfff}{Random.Shared.Next(100, 999)}";

                        string ghiChuCanhBao = "";
                        if (canhBaoTreHan)
                        {
                            int tongKhachDuKien = payload.SoNguoiLon + payload.SoTreEm + payload.SoEmBe;
                            bool coTheVuotQuaCho = (chuyen.SoChoDaDat + tongKhachDuKien) > chuyen.SoChoToiDa;
                            ghiChuCanhBao = coTheVuotQuaCho
                                ? "[CẢNH BÁO] Thanh toán hoàn tất trễ, có thể VƯỢT QUÁ số chỗ tối đa. Cần nhân viên kiểm tra và liên hệ khách hàng."
                                : "[LƯU Ý] Thanh toán hoàn tất trễ hơn dự kiến giữ chỗ, nhưng vẫn còn đủ chỗ.";
                        }

                        order = new DonDatTour
                        {
                            MaNguoiDung = giuCho.MaNguoiDung,
                            MaChuyen = giuCho.MaChuyen,
                            MaDatCho = maDatCho,
                            GhiChu = string.IsNullOrEmpty(ghiChuCanhBao) ? (payload.GhiChu ?? "") : $"{ghiChuCanhBao} {payload.GhiChu}".Trim(),
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

                        var thanhToan = new ThanhToan
                        {
                            MaDonDatTour = order.MaDonDatTour,
                            PhuongThucThanhToan = 1,
                            MaGiaoDich = txnRef,
                            NoiDung = noiDung,
                            VnpTransactionNo = vnpay.GetResponseData("vnp_TransactionNo"),
                            NgayThanhToan = DateTime.Now,
                            TongTienThanhToan = vnpayAmount,
                            TrangThaiThanhToan = 1,
                        };
                        _context.ThanhToans.Add(thanhToan);

                        int tongKhach = payload.SoNguoiLon + payload.SoTreEm + payload.SoEmBe;
                        chuyen.SoChoDaDat += tongKhach;
                        chuyen.NgayCapNhat = DateTime.Now;

                        if (uuDai != null)
                        {
                            uuDai.SoLuongDaDung++;
                        }

                        _context.GiuChos.Remove(giuCho);
                        _context.PaymentPayloads.Remove(payload);

                        await _context.SaveChangesAsync();
                        await transaction.CommitAsync();

                        Console.WriteLine($"[VNPay IPN] Đã COMMIT thành công đơn {order.MaDatCho} (MaDonDatTour={order.MaDonDatTour}). Chuẩn bị gửi email xác nhận...");

                        try
                        {
                            await _emailService.SendBookingConfirmationAsync(order);
                            Console.WriteLine($"[VNPay IPN] Đã gọi xong SendBookingConfirmationAsync cho đơn {order.MaDatCho}. Xem log [Email] phía trên/dưới để biết gửi thành công hay lỗi.");
                        }
                        catch (Exception exEmail)
                        {
                            // SendBookingConfirmationAsync tự bắt exception nội bộ, nhánh này chỉ phòng hờ
                            Console.WriteLine($"[VNPay IPN] Lỗi KHÔNG MONG ĐỢI khi gọi SendBookingConfirmationAsync: {exEmail.Message}\n{exEmail.StackTrace}");
                        }
                    }
                    catch (Exception exTransaction)
                    {
                        Console.WriteLine($"[VNPay IPN] >>> LỖI trong transaction, đã rollback: {exTransaction.Message}\n{exTransaction.StackTrace}");
                        throw;
                    }
                }

                // Gửi thông báo đến người dùng và nhân viên
                try
                {
                    await _notificationService.CreateForUserAsync(
                        order.MaNguoiDung,
                        new CreateNotificationDTO
                        {
                            TieuDe = "Thanh toán thành công",
                            NoiDung = $"Đơn đặt tour {order.MaDatCho} đã thanh toán thành công.",
                            LoaiThongBao = (int)NotificationType.Payment,
                            LinkChiTiet = $"/Thong-Tin-Ca-Nhan"
                        });

                    Console.WriteLine("[VNPay IPN] Đã tạo thông báo cho user thành công.");

                    var staffIds = await _context.NhanViens
                        .Where(x => x.NgayXoa == null &&
                                   (x.MaVaiTro == RoleIds.Admin ||
                                    x.MaVaiTro == RoleIds.Staff))
                        .Select(x => x.MaNhanVien)
                        .ToListAsync();

                    bool coCanhBaoCanKiemTra = order.GhiChu?.Contains("[CẢNH BÁO]") == true;

                    await _notificationService.CreateForStaffsAsync(
                        staffIds,
                        new CreateNotificationDTO
                        {
                            TieuDe = coCanhBaoCanKiemTra
                                ? "Đơn tour mới CẦN KIỂM TRA GẤP"
                                : "Có đơn đặt tour mới",

                            NoiDung = coCanhBaoCanKiemTra
                                ? $"Đơn {order.MaDatCho} thanh toán trễ, có thể vượt quá số chỗ tối đa. Vui lòng kiểm tra ngay."
                                : $"Khách hàng vừa thanh toán thành công đơn {order.MaDatCho}.",

                            LoaiThongBao = (int)NotificationType.Booking,

                            LinkChiTiet = $"/Quan-ly/Don-dat-cac-chuyen-di"
                        });

                    Console.WriteLine($"[VNPay IPN] Đã tạo thông báo cho {staffIds.Count} nhân viên/admin.");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[VNPay IPN] Lỗi khi gửi notification (không rollback booking): {ex}");
                }

                try
                {
                    await _dashboardNotifier.NotifyDashboardChangedAsync("NewBooking", new
                    {
                        order.MaDonDatTour,
                        order.NgayDat,
                        order.TrangThaiDon
                    });
                    await _hubContext.Clients.Group("ADMIN_GROUP").SendAsync("BookingCreated", new
                    {
                        MaDonDatTour = order.MaDonDatTour,
                        MaDatCho = order.MaDatCho,
                        TongTien = order.TongTien,
                        NgayDat = order.NgayDat
                    });
                    Console.WriteLine("[VNPay IPN] Đã bắn SignalR/dashboard notifier thành công.");
                }
                catch (Exception exRealtime)
                {
                    Console.WriteLine($"[VNPay IPN] Lỗi realtime (không rollback booking): {exRealtime}");
                }

                Console.WriteLine($"[VNPay IPN] ===== Hoàn tất xử lý IPN cho txnRef={txnRef} =====");
                return ("00", "Confirm success");
            }
            catch (Exception ex)
            {
                // QUAN TRỌNG: trước đây catch này chỉ "return" mà KHÔNG log gì cả,
                // nên mọi lỗi bất ngờ (throw từ transaction, exception ngoài dự kiến...)
                // đều biến mất không dấu vết. Đây có thể là lý do không thấy log nào.
                Console.WriteLine($"[VNPay IPN] >>> LỖI HỆ THỐNG (catch ngoài cùng): {ex.Message}\n{ex.StackTrace}");
                return ("99", "System error");
            }
        }

    }
}