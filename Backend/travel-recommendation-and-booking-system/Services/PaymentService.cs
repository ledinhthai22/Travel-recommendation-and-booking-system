using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.DTOs.Payment;
using travel_recommendation_and_booking_system.Helper;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Models;

namespace travel_recommendation_and_booking_system.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly VnPayConfig _vnpayConfig;
        private readonly AppDbContext _context;

        public PaymentService(IOptions<VnPayConfig> vnpayConfig, AppDbContext context)
        {
            _vnpayConfig = vnpayConfig.Value;
            _context = context;
        }

        public async Task<string> CreatePaymentUrlAsync(PaymentRequestDTO request, string remoteIpAddress)
        {
            var giuCho = await _context.GiuChos
                .Include(x => x.ChuyenKhoiHanh).ThenInclude(x => x.GiaChuyens)
                .FirstOrDefaultAsync(x => x.MaGiuCho == request.MaGiuCho && x.MaChuyen == request.MaChuyen)
                ?? throw new KeyNotFoundException("Phiên giữ chỗ không tồn tại.");

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
            long timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            string txnRef = $"GC{request.MaGiuCho}_{timestamp}";

            var tz = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
            var localTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, tz);

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
            vnpay.AddRequestData("vnp_TxnRef", txnRef);

            return vnpay.CreateRequestUrl(_vnpayConfig.BaseUrl, _vnpayConfig.HashSecret);
        }


        public async Task<(string RspCode, string Message)> ProcessVnPayIpnAsync(Dictionary<string, string> queryData)
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
                return ("97", "Invalid signature");

            string txnRef = vnpay.GetResponseData("vnp_TxnRef");
            string maGiuChoRaw = txnRef.StartsWith("GC")
                ? txnRef[2..].Split('_')[0]
                : txnRef.Split('_')[0];

            if (!int.TryParse(maGiuChoRaw, out int maGiuCho))
                return ("01", "Invalid TxnRef format");

            string responseCode = vnpay.GetResponseData("vnp_ResponseCode");
            string maGiaoDich = vnpay.GetResponseData("vnp_TransactionNo");
            string noiDung = vnpay.GetResponseData("vnp_OrderInfo");
            decimal vnpayAmount = Convert.ToDecimal(vnpay.GetResponseData("vnp_Amount")) / 100;

 
            if (responseCode != "00")
            {
                try
                {
                    var failedPayload = await _context.PaymentPayloads
                        .FirstOrDefaultAsync(x => x.MaGiuCho == maGiuCho);

                    if (failedPayload != null)
                    {
                        _context.PaymentPayloads.Remove(failedPayload);
                        await _context.SaveChangesAsync();
                    }
                }
                catch { /* Không throw — phải trả về 00 cho IPN dù xử lý nội bộ lỗi */ }

                return ("00", "Confirm success");
            }


            if (await _context.ThanhToans.AnyAsync(x => x.MaGiaoDich == maGiaoDich))
                return ("02", "Already confirmed");

            var giuCho = await _context.GiuChos
                .Include(x => x.ChuyenKhoiHanh).ThenInclude(x => x.GiaChuyens)
                .FirstOrDefaultAsync(x => x.MaGiuCho == maGiuCho);

            if (giuCho == null)
                return ("01", "GiuCho not found");

            var payload = await _context.PaymentPayloads
                .FirstOrDefaultAsync(x => x.MaGiuCho == maGiuCho);

            if (payload == null)
                return ("01", "PaymentPayload not found");

            using var dbTransaction = await _context.Database.BeginTransactionAsync();
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

                if (Math.Abs(tongTien - vnpayAmount) > 1)
                {
                    Console.WriteLine($"[IPN] Amount mismatch: expected={tongTien}, vnpay={vnpayAmount}");
                    return ("04", "Invalid amount");
                }


                var maDatCho = $"BK{DateTime.Now:yyyyMMddHHmmssfff}{Random.Shared.Next(100, 999)}";

                var order = new DonDatTour
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
                        NgaySinh = (DateTime)k.NgaySinh,
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
                    MaGiaoDich = maGiaoDich,
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
                await dbTransaction.CommitAsync();

                Console.WriteLine($"[IPN] Booking created: {maDatCho}, MaDonDatTour={order.MaDonDatTour}");
                return ("00", "Confirm success");
            }
            catch (Exception ex)
            {
                await dbTransaction.RollbackAsync();
                Console.WriteLine($"[IPN] Error: {ex.Message}");
                throw;
            }
        }
    }
}