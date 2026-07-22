using GenerativeAI;
using Hangfire;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using travel_recommendation_and_booking_system.Constants;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.DTOs.Notifications;
using travel_recommendation_and_booking_system.DTOs.Payment;
using travel_recommendation_and_booking_system.DTOs.TourBooking;
using travel_recommendation_and_booking_system.Helper;
using travel_recommendation_and_booking_system.Helpers;
using travel_recommendation_and_booking_system.Interfaces;
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
        private readonly ILogger<PaymentService> _logger;

        private static readonly int[] TyLeHopLe = BookingConstants.ValidDepositPercentages;

        // Trạng thái tài chính
        private const int TC_CHUA_THANH_TOAN = BookingConstants.TC_CHUA_THANH_TOAN;
        private const int TC_DA_DAT_COC = BookingConstants.TC_DA_DAT_COC;
        private const int TC_DA_THANH_TOAN_DU = BookingConstants.TC_DA_THANH_TOAN_DU;
        private const int TC_DANG_HOAN_TIEN = BookingConstants.TC_DANG_HOAN_TIEN;
        private const int TC_DA_HOAN_TIEN = BookingConstants.TC_DA_HOAN_TIEN;
        private const int TC_MAT_COC = BookingConstants.TC_MAT_COC;

        // Trạng thái đơn
        private const int DON_CHO_THANH_TOAN = BookingConstants.DON_CHO_THANH_TOAN;
        private const int DON_CHO_DUYET = BookingConstants.DON_CHO_DUYET;
        private const int DON_DA_DUYET = BookingConstants.DON_DA_DUYET;
        private const int DON_DANG_DIEN_RA = BookingConstants.DON_DANG_DIEN_RA;
        private const int DON_HOAN_TAT = BookingConstants.DON_HOAN_TAT;
        private const int DON_DA_HUY = BookingConstants.DON_DA_HUY;

        // Trạng thái thanh toán
        private const int TT_CHO_XU_LY = BookingConstants.TT_CHO_XU_LY;
        private const int TT_THANH_CONG = BookingConstants.TT_THANH_CONG;
        private const int TT_THAT_BAI = BookingConstants.TT_THAT_BAI;
        private const int TT_DA_HUY = BookingConstants.TT_DA_HUY;

        // Loại thanh toán
        private const int LOAI_DAT_COC = BookingConstants.LOAI_DAT_COC;
        private const int LOAI_THANH_TOAN_PHAN_CON_LAI = BookingConstants.LOAI_THANH_TOAN_PHAN_CON_LAI;
        private const int LOAI_THANH_TOAN_TOAN_BO = BookingConstants.LOAI_THANH_TOAN_TOAN_BO;
        private const int LOAI_HOAN_TIEN = BookingConstants.LOAI_HOAN_TIEN;

        private const int LOAI_GIAO_DICH_DAT_MOI = 1;
        private const int LOAI_GIAO_DICH_CON_LAI = 2;

        public PaymentService(
            IOptions<VnPayConfig> vnpayConfig,
            AppDbContext context,
            IHubContext<TravelRecommendationHub> hubContext,
            IEmailService emailService,
            INotificationService notificationService,
            IDashboardNotifier dashboardNotifier,
            IHttpClientFactory httpClientFactory,
            ILogger<PaymentService> logger)
        {
            _vnpayConfig = vnpayConfig.Value;
            _context = context;
            _hubContext = hubContext;
            _emailService = emailService;
            _notificationService = notificationService;
            _dashboardNotifier = dashboardNotifier;
            _httpClientFactory = httpClientFactory;
            _logger = logger;
        }

        private static bool IsOrderCancelled(int status) => BookingConstants.IsOrderCancelled(status);
        private static bool IsOrderCompleted(int status) => BookingConstants.IsOrderCompleted(status);
        private static bool IsOrderActive(int status) => BookingConstants.IsOrderActive(status);
        private static string GetOrderStatusName(int status) => BookingConstants.GetOrderStatusName(status);
        private static string GetFinancialStatusName(int status) => BookingConstants.GetFinancialStatusName(status);
        private static string GetPaymentStatusName(int status) => BookingConstants.GetPaymentStatusName(status);

        private string FormatPrice(decimal price)
        {
            return price.ToString("#,##0", System.Globalization.CultureInfo.InvariantCulture)
                        .Replace(",", ".");
        }

        public async Task<(string PaymentUrl, string TxnRef)> CreatePaymentUrlAsync(PaymentRequestDTO request, string remoteIpAddress)
        {
            var giuCho = await _context.GiuChos
                .Include(x => x.ChuyenKhoiHanh).ThenInclude(x => x.GiaChuyens)
                .FirstOrDefaultAsync(x => x.MaGiuCho == request.MaGiuCho && x.MaChuyen == request.MaChuyen)
                ?? throw new KeyNotFoundException("Phiên giữ chỗ không tồn tại.");

            if (giuCho.ThoiGianHetHan <= DateTime.Now)
                throw new InvalidOperationException("Phiên giữ chỗ đã hết hạn. Vui lòng chọn lại.");

            if (!TyLeHopLe.Contains(request.TyLeThanhToan))
                throw new InvalidOperationException("Tỷ lệ thanh toán không hợp lệ. Chỉ chấp nhận 30%, 50% hoặc 100%.");

            var payload = await _context.PaymentPayloads
                .FirstOrDefaultAsync(x => x.MaGiuCho == giuCho.MaGiuCho && x.LoaiGiaoDich == LOAI_GIAO_DICH_DAT_MOI);

            var order = await CreateOrderFromHoldAsync(giuCho, request);

            if (payload == null)
            {
                payload = new PaymentPayload
                {
                    MaGiuCho = giuCho.MaGiuCho,
                    MaDonDatTour = order.MaDonDatTour,
                    MaNguoiDung = giuCho.MaNguoiDung,
                    MaChuyen = giuCho.MaChuyen,
                    SoNguoiLon = request.SoNguoiLon,
                    SoTreEm = request.SoTreEm,
                    SoEmBe = request.SoEmBe,
                    MaUuDai = request.MaUuDai,
                    DanhSachHanhKhach = request.DanhSachHanhKhach?.Select(k => new KhachHangDTO
                    {
                        HoTen = k.HoTen,
                        SoDienThoai = k.SoDienThoai,
                        Email = k.Email,
                        NgaySinh = k.NgaySinh,
                        GioiTinh = k.GioiTinh,
                        LoaiKhach = k.LoaiKhach,
                        PhongDon = k.PhongDon
                    }).ToList() ?? new List<KhachHangDTO>(),
                    GhiChu = request.GhiChu ?? "",
                    HoTenLienHe = request.HoTenLienHe,
                    SoDienThoaiLienHe = request.SoDienThoaiLienHe,
                    EmailLienHe = request.EmailLienHe,
                    DiaChiLienHe = request.DiaChiLienHe,
                    NgayBatDauThanhToan = DateTime.Now,
                    TyLeThanhToan = request.TyLeThanhToan,
                    LoaiGiaoDich = LOAI_GIAO_DICH_DAT_MOI
                };
                _context.PaymentPayloads.Add(payload);
            }
            else
            {
                payload.MaDonDatTour = order.MaDonDatTour;
                payload.HoTenLienHe = request.HoTenLienHe;
                payload.SoDienThoaiLienHe = request.SoDienThoaiLienHe;
                payload.EmailLienHe = request.EmailLienHe;
                payload.DiaChiLienHe = request.DiaChiLienHe;
                payload.TyLeThanhToan = request.TyLeThanhToan;
                payload.NgayBatDauThanhToan = DateTime.Now;
            }

            var thoiGianToiThieu = DateTime.Now.AddMinutes(10);
            if (giuCho.ThoiGianHetHan < thoiGianToiThieu)
                giuCho.ThoiGianHetHan = thoiGianToiThieu;

            decimal tongTienDon = order.TongTien;
            decimal soTienThanhToanLanNay = Math.Round(tongTienDon * request.TyLeThanhToan / 100m, 0);
            long vnpayAmount = Convert.ToInt64(soTienThanhToanLanNay * 100);

            payload.TongTienGoc = tongTienDon;

            var tz = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
            var localTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, tz);

            string secureTxnRef = $"VNPAY_{DateTime.Now:yyyyMMddHHmmssfff}_{Random.Shared.Next(1000, 9999)}";
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
            vnpay.AddRequestData("vnp_OrderInfo", $"Thanh toan {request.TyLeThanhToan}% - Don {order.MaDatCho}");
            vnpay.AddRequestData("vnp_OrderType", "other");
            vnpay.AddRequestData("vnp_ReturnUrl", _vnpayConfig.ReturnUrl);
            vnpay.AddRequestData("vnp_TxnRef", secureTxnRef);

            string url = vnpay.CreateRequestUrl(_vnpayConfig.BaseUrl, _vnpayConfig.HashSecret);

            return (url, secureTxnRef);
        }

        public async Task<(string PaymentUrl, string TxnRef)> CreateRemainingPaymentUrlAsync(int maDonDatTour, string remoteIpAddress)
        {
            var order = await _context.DonDatTours
                .Include(x => x.ChuyenKhoiHanh)
                .FirstOrDefaultAsync(x => x.MaDonDatTour == maDonDatTour)
                ?? throw new KeyNotFoundException("Đơn đặt tour không tồn tại.");

            if (IsOrderCancelled(order.TrangThaiDon))
                throw new InvalidOperationException($"Đơn đã bị hủy (trạng thái: {GetOrderStatusName(order.TrangThaiDon)}), không thể thanh toán tiếp.");

            if (IsOrderCompleted(order.TrangThaiDon))
                throw new InvalidOperationException("Đơn đã hoàn tất, không thể thanh toán tiếp.");

            if (order.TrangThaiTaiChinh == TC_DA_THANH_TOAN_DU)
                throw new InvalidOperationException("Đơn đã được thanh toán đầy đủ.");

            decimal soTienConLai = order.TongTien - order.SoTienDaThanhToan;
            if (soTienConLai <= 0)
                throw new InvalidOperationException("Không còn số tiền cần thanh toán.");

            bool coGiaoDichDangCho = await _context.PaymentPayloads
                .AnyAsync(x => x.MaDonDatTour == maDonDatTour && x.LoaiGiaoDich == LOAI_GIAO_DICH_CON_LAI);

            if (coGiaoDichDangCho)
                throw new InvalidOperationException("Đã có một giao dịch thanh toán phần còn lại đang chờ xử lý. Vui lòng hoàn tất hoặc hủy giao dịch đó trước.");

            long vnpayAmount = Convert.ToInt64(soTienConLai * 100);

            int tyLeConLaiUocTinh = order.TongTien > 0
                ? (int)Math.Round(soTienConLai / order.TongTien * 100m, 0)
                : 100;

            var payload = new PaymentPayload
            {
                MaGiuCho = null,
                MaDonDatTour = order.MaDonDatTour,
                MaNguoiDung = order.MaNguoiDung,
                MaChuyen = order.MaChuyen,
                SoNguoiLon = order.SoNguoiLon,
                SoTreEm = order.SoTreEm,
                SoEmBe = order.SoEmBe,
                MaUuDai = order.MaUuDai,
                TongTienGoc = order.TongTien,
                TyLeThanhToan = tyLeConLaiUocTinh,
                LoaiGiaoDich = LOAI_GIAO_DICH_CON_LAI,
                NgayBatDauThanhToan = DateTime.Now,
                GhiChu = $"Thanh toan phan con lai cho don {order.MaDatCho}",
                HoTenLienHe = order.HoTenLienHe,
                SoDienThoaiLienHe = order.SoDienThoaiLienHe,
                EmailLienHe = order.EmailLienHe,
                DiaChiLienHe = order.DiaChiLienHe
            };

            string secureTxnRef = $"VNPAY_{DateTime.Now:yyyyMMddHHmmssfff}_{Random.Shared.Next(1000, 9999)}";
            payload.TxnRef = secureTxnRef;

            _context.PaymentPayloads.Add(payload);
            await _context.SaveChangesAsync();

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
            vnpay.AddRequestData("vnp_OrderInfo", $"Thanh toan phan con lai - Don {order.MaDatCho}");
            vnpay.AddRequestData("vnp_OrderType", "other");
            vnpay.AddRequestData("vnp_ReturnUrl", _vnpayConfig.ReturnUrl);
            vnpay.AddRequestData("vnp_TxnRef", secureTxnRef);

            string url = vnpay.CreateRequestUrl(_vnpayConfig.BaseUrl, _vnpayConfig.HashSecret);

            return (url, secureTxnRef);
        }

        private async Task<DonDatTour> CreateOrderFromHoldAsync(GiuCho giuCho, PaymentRequestDTO request)
        {
            var chuyen = giuCho.ChuyenKhoiHanh;
            var gia = chuyen.GiaChuyens.FirstOrDefault()
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

            decimal tongTienDon = tongTienGoc + phuThuPhongDon - giaTriGiam;
            decimal soTienThanhToanLanNay = Math.Round(tongTienDon * request.TyLeThanhToan / 100m, 0);

            var maDatCho = $"BK{DateTime.Now:yyyyMMddHHmmssfff}{Random.Shared.Next(100, 999)}";

            var order = new DonDatTour
            {
                MaNguoiDung = giuCho.MaNguoiDung,
                MaChuyen = giuCho.MaChuyen,
                MaDatCho = maDatCho,
                GhiChu = request.GhiChu ?? "",
                MaUuDai = request.MaUuDai,
                SoNguoiLon = request.SoNguoiLon,
                SoTreEm = request.SoTreEm,
                SoEmBe = request.SoEmBe,
                SoPhongDon = soPhongDon,
                HoTenLienHe = request.HoTenLienHe,
                SoDienThoaiLienHe = request.SoDienThoaiLienHe,
                EmailLienHe = request.EmailLienHe,
                DiaChiLienHe = request.DiaChiLienHe,
                GiaNguoiLonTaiDat = gia.GiaNguoiLon,
                GiaTreEmTaiDat = gia.GiaTreEm,
                GiaEmBeTaiDat = gia.GiaEmBe,
                PhuThuPhongDonTaiDat = gia.PhuThuPhongDon,
                GiaTriGiamTaiDat = giaTriGiam,
                TongTien = tongTienDon,
                TienCoc = request.TyLeThanhToan < 100 ? soTienThanhToanLanNay : 0,
                SoTienDaThanhToan = 0,
                TrangThaiTaiChinh = TC_CHUA_THANH_TOAN,
                TrangThaiDon = DON_CHO_THANH_TOAN,
                NgayDat = DateTime.Now,
                NgayCapNhat = DateTime.Now,
                MaNhanVienDuyet = null,
                NgayDuyet = null,
                LichSuTrangThai = $"[{{\"OldStatus\":0,\"NewStatus\":{DON_CHO_THANH_TOAN},\"Action\":\"Tạo đơn chờ thanh toán VNPay\",\"Timestamp\":\"{DateTime.Now:yyyy-MM-ddTHH:mm:ss}\",\"UserId\":\"{giuCho.MaNguoiDung}\"}}]"
            };

            _context.DonDatTours.Add(order);
            await _context.SaveChangesAsync();

            if (request.DanhSachHanhKhach?.Any() == true)
            {
                var khachHangs = request.DanhSachHanhKhach.Select(k => new KhachHang
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
                await _context.SaveChangesAsync();
            }

            return order;
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

                bool isValidSignature = vnpay.ValidateSignature(vnp_SecureHash, _vnpayConfig.HashSecret);
                if (!isValidSignature)
                    return ("97", "Invalid signature");

                string txnRef = vnpay.GetResponseData("vnp_TxnRef");
                string responseCode = vnpay.GetResponseData("vnp_ResponseCode");
                string noiDung = vnpay.GetResponseData("vnp_OrderInfo");
                string vnpAmountRaw = vnpay.GetResponseData("vnp_Amount");
                decimal vnpayAmount = Convert.ToDecimal(vnpAmountRaw) / 100;

                var existingThanhToan = await _context.ThanhToans
                    .FirstOrDefaultAsync(t => t.MaGiaoDich == txnRef);

                if (existingThanhToan != null)
                    return ("02", "Order already confirmed");

                if (responseCode != "00")
                    return ("00", "Confirm success");

                var payload = await _context.PaymentPayloads
                    .FirstOrDefaultAsync(x => x.TxnRef == txnRef);

                if (payload == null)
                    return ("01", "PaymentPayload not found");

                if (payload.LoaiGiaoDich == LOAI_GIAO_DICH_CON_LAI)
                    return await XuLyIpnThanhToanConLaiAsync(payload, txnRef, noiDung, vnpAmountRaw, vnpayAmount, vnpay);

                return await XuLyIpnDatMoiAsync(payload, txnRef, noiDung, vnpAmountRaw, vnpayAmount, vnpay);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi xử lý VNPay IPN");
                return ("99", "System error");
            }
        }

        private async Task<(string RspCode, string Message)> XuLyIpnDatMoiAsync(
            PaymentPayload payload, string txnRef, string noiDung, string vnpAmountRaw, decimal vnpayAmount, VnPayLibrary vnpay)
        {
            if (payload.DaXuLy == true)
                return ("02", "Order already processed");

            if (payload.MaDonDatTour == null)
                return ("01", "MaDonDatTour reference missing");

            await using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var order = await _context.DonDatTours
                    .Include(x => x.ChuyenKhoiHanh)
                    .Include(x => x.NguoiDung)
                    .Include(x => x.ThanhToans)
                    .FirstOrDefaultAsync(x => x.MaDonDatTour == payload.MaDonDatTour.Value);

                if (order == null)
                    return ("01", "Order not found");

                if (order.TrangThaiTaiChinh == TC_DA_THANH_TOAN_DU)
                    return ("02", "Order already fully paid");

                if (IsOrderCancelled(order.TrangThaiDon))
                    return ("03", "Order already cancelled");

                if (IsOrderCompleted(order.TrangThaiDon))
                    return ("04", "Order already completed");

                decimal soTienMongDoi = Math.Round(order.TongTien * payload.TyLeThanhToan / 100m, 0);
                long expectedAmountRaw = Convert.ToInt64(soTienMongDoi * 100);
                long actualAmountRaw = Convert.ToInt64(vnpAmountRaw);

                if (expectedAmountRaw != actualAmountRaw)
                {
                    await transaction.RollbackAsync();
                    return ("04", "Invalid amount");
                }

                var oldStatusDon = order.TrangThaiDon;

                order.SoTienDaThanhToan = vnpayAmount;
                order.TrangThaiDon = DON_DA_DUYET;
                order.NgayDuyet = DateTime.Now;
                order.TrangThaiTaiChinh = payload.TyLeThanhToan >= 100 ? TC_DA_THANH_TOAN_DU : TC_DA_DAT_COC;
                order.NgayCapNhat = DateTime.Now;

                var chuyen = order.ChuyenKhoiHanh;
                if (chuyen != null)
                {
                    chuyen.SoChoDaDat += order.SoNguoiLon + order.SoTreEm + order.SoEmBe;
                    chuyen.NgayCapNhat = DateTime.Now;
                }

                if (payload.MaGiuCho.HasValue)
                {
                    var giuCho = await _context.GiuChos
                        .FirstOrDefaultAsync(x => x.MaGiuCho == payload.MaGiuCho.Value);
                    if (giuCho != null)
                        _context.GiuChos.Remove(giuCho);
                }

                int loaiThanhToan = payload.TyLeThanhToan >= 100 ? LOAI_THANH_TOAN_TOAN_BO : LOAI_DAT_COC;

                var thanhToan = new ThanhToan
                {
                    MaDonDatTour = order.MaDonDatTour,
                    PhuongThucThanhToan = 1,
                    MaGiaoDich = txnRef,
                    NoiDung = noiDung,
                    VnpTransactionNo = vnpay.GetResponseData("vnp_TransactionNo"),
                    NgayThanhToan = DateTime.Now,
                    TongTienThanhToan = vnpayAmount,
                    TrangThaiThanhToan = TT_THANH_CONG,
                    LoaiThanhToan = loaiThanhToan,
                    NgayXacNhan = DateTime.Now
                };
                _context.ThanhToans.Add(thanhToan);

                if (order.MaUuDai.HasValue)
                {
                    var uuDai = await _context.UuDais
                        .FirstOrDefaultAsync(x => x.MaUuDai == order.MaUuDai.Value);
                    if (uuDai != null)
                        uuDai.SoLuongDaDung++;
                }

                order.AppendStatusHistory(oldStatusDon, order.TrangThaiDon, "Thanh toán VNPay thành công", $"Thanh toán {FormatPrice(vnpayAmount)}đ");

                payload.DaXuLy = true;
                _context.PaymentPayloads.Remove(payload);

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                await SendNotificationsAfterFirstPayment(order);

                return ("00", "Confirm success");
            }
            catch (DbUpdateConcurrencyException)
            {
                await transaction.RollbackAsync();
                return ("99", "Concurrency conflict, retry");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "Lỗi xử lý IPN thanh toán mới");
                return ("99", "System error");
            }
        }

        private async Task<(string RspCode, string Message)> XuLyIpnThanhToanConLaiAsync(
            PaymentPayload payload, string txnRef, string noiDung, string vnpAmountRaw, decimal vnpayAmount, VnPayLibrary vnpay)
        {
            if (payload.MaDonDatTour == null)
                return ("01", "MaDonDatTour reference missing");

            if (payload.DaXuLy == true)
                return ("02", "Order already processed");

            await using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var order = await _context.DonDatTours
                    .Include(x => x.ChuyenKhoiHanh)
                    .Include(x => x.ThanhToans)
                    .Include(x => x.NguoiDung)
                    .FirstOrDefaultAsync(x => x.MaDonDatTour == payload.MaDonDatTour.Value);

                if (order == null)
                    return ("01", "Order not found");

                if (order.TrangThaiTaiChinh == TC_DA_THANH_TOAN_DU)
                    return ("02", "Order already fully paid");

                if (IsOrderCancelled(order.TrangThaiDon))
                    return ("03", $"Order already cancelled (status: {GetOrderStatusName(order.TrangThaiDon)})");

                if (IsOrderCompleted(order.TrangThaiDon))
                    return ("04", "Order already completed");

                decimal soTienConLaiMongDoi = payload.TongTienGoc - order.SoTienDaThanhToan;
                long expectedAmountRaw = Convert.ToInt64(Math.Round(soTienConLaiMongDoi, 0) * 100);
                long actualAmountRaw = Convert.ToInt64(vnpAmountRaw);

                if (expectedAmountRaw != actualAmountRaw)
                {
                    await transaction.RollbackAsync();
                    return ("04", "Invalid amount");
                }

                var oldStatusDon = order.TrangThaiDon;

                var thanhToan = new ThanhToan
                {
                    MaDonDatTour = order.MaDonDatTour,
                    PhuongThucThanhToan = 1,
                    MaGiaoDich = txnRef,
                    NoiDung = noiDung,
                    VnpTransactionNo = vnpay.GetResponseData("vnp_TransactionNo"),
                    NgayThanhToan = DateTime.Now,
                    TongTienThanhToan = vnpayAmount,
                    TrangThaiThanhToan = TT_THANH_CONG,
                    LoaiThanhToan = LOAI_THANH_TOAN_PHAN_CON_LAI,
                    NgayXacNhan = DateTime.Now
                };
                _context.ThanhToans.Add(thanhToan);

                order.SoTienDaThanhToan += vnpayAmount;
                order.TrangThaiTaiChinh = TC_DA_THANH_TOAN_DU;

                if (order.CoCanhBaoCongNo)
                {
                    order.CoCanhBaoCongNo = false;
                    order.NgayGanCoCanhBao = null;
                }

                if (order.TrangThaiDon == DON_CHO_DUYET)
                {
                    order.TrangThaiDon = DON_DA_DUYET;
                    order.MaNhanVienDuyet = null;
                    order.NgayDuyet = DateTime.Now;
                }

                order.NgayCapNhat = DateTime.Now;
                order.AppendStatusHistory(oldStatusDon, order.TrangThaiDon, "Thanh toán phần còn lại", $"Thanh toán {FormatPrice(vnpayAmount)}đ qua VNPay");

                payload.DaXuLy = true;
                _context.PaymentPayloads.Remove(payload);

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                await SendNotificationsAfterFullPayment(order);

                return ("00", "Confirm success");
            }
            catch (DbUpdateConcurrencyException)
            {
                await transaction.RollbackAsync();
                return ("99", "Concurrency conflict, retry");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "Lỗi xử lý IPN thanh toán phần còn lại");
                return ("99", "System error");
            }
        }

        #region Email Methods

        private async Task SendFullPaymentConfirmationEmail(DonDatTour order)
        {
            try
            {
                var fullOrder = await _context.DonDatTours
                    .Include(x => x.KhachHangs)
                    .Include(x => x.NguoiDung)
                    .Include(x => x.ChuyenKhoiHanh).ThenInclude(x => x.Tour)
                    .Include(x => x.ThanhToans)
                    .FirstOrDefaultAsync(x => x.MaDonDatTour == order.MaDonDatTour);

                if (fullOrder == null) fullOrder = order;

                string toEmail = fullOrder.NguoiDung?.Email
                    ?? throw new Exception("Không tìm thấy email người nhận");

                string hoTen = fullOrder.NguoiDung?.HoTen ?? "Quý khách";
                string subject = $"[Xác nhận thanh toán đầy đủ] Đơn {fullOrder.MaDatCho}";

                var latestPayment = fullOrder.ThanhToans?
                    .OrderByDescending(t => t.NgayThanhToan)
                    .FirstOrDefault();

                // Tính số tiền vừa thanh toán (lần này)
                decimal soTienThanhToanLanNay = latestPayment?.TongTienThanhToan ?? 0;

                string infoRows = $@"
                    <tr><td width='170' align='right' valign='top' style='padding:8px 12px;background:#f8f9fa;font-weight:500;border-bottom:1px solid #eee;'>Mã đơn:</td>
                        <td style='padding:8px 12px;border-bottom:1px solid #eee;'><b style='color:#c50000;'>{fullOrder.MaDatCho}</b></td></tr>
                    <tr><td width='170' align='right' valign='top' style='padding:8px 12px;background:#f8f9fa;font-weight:500;border-bottom:1px solid #eee;'>Tên tour:</td>
                        <td style='padding:8px 12px;border-bottom:1px solid #eee;'>{fullOrder.ChuyenKhoiHanh?.Tour?.TenTour ?? "N/A"}</td></tr>
                    <tr><td width='170' align='right' valign='top' style='padding:8px 12px;background:#f8f9fa;font-weight:500;border-bottom:1px solid #eee;'>Ngày khởi hành:</td>
                        <td style='padding:8px 12px;border-bottom:1px solid #eee;'>{fullOrder.ChuyenKhoiHanh?.NgayKhoiHanh:dd/MM/yyyy HH:mm}</td></tr>
                    <tr><td width='170' align='right' valign='top' style='padding:8px 12px;background:#f8f9fa;font-weight:500;border-bottom:1px solid #eee;'>Số tiền đã thanh toán trước:</td>
                        <td style='padding:8px 12px;border-bottom:1px solid #eee;'><b style='color:#008000;'>{FormatPrice(fullOrder.SoTienDaThanhToan - soTienThanhToanLanNay)} đ</b></td></tr>
                    <tr><td width='170' align='right' valign='top' style='padding:8px 12px;background:#f8f9fa;font-weight:500;border-bottom:1px solid #eee;'>Số tiền thanh toán lần này:</td>
                        <td style='padding:8px 12px;border-bottom:1px solid #eee;'><b style='color:#008000;'>{FormatPrice(soTienThanhToanLanNay)} đ</b></td></tr>
                    <tr><td width='170' align='right' valign='top' style='padding:8px 12px;background:#f8f9fa;font-weight:500;border-bottom:1px solid #eee;'>Tổng đã thanh toán:</td>
                        <td style='padding:8px 12px;border-bottom:1px solid #eee;'><b style='color:#008000;'>{FormatPrice(fullOrder.SoTienDaThanhToan)} đ</b></td></tr>
                    <tr><td width='170' align='right' valign='top' style='padding:8px 12px;background:#f8f9fa;font-weight:500;border-bottom:1px solid #eee;'>Tổng giá trị đơn:</td>
                        <td style='padding:8px 12px;border-bottom:1px solid #eee;'><b style='color:#c50000;'>{FormatPrice(fullOrder.TongTien)} đ</b></td></tr>
                    <tr><td width='170' align='right' valign='top' style='padding:8px 12px;background:#f8f9fa;font-weight:500;border-bottom:1px solid #eee;'>Trạng thái tài chính:</td>
                        <td style='padding:8px 12px;border-bottom:1px solid #eee;'><span style='color:#008000;font-weight:bold;'>Đã thanh toán đầy đủ</span></td></tr>
                    <tr><td width='170' align='right' valign='top' style='padding:8px 12px;background:#f8f9fa;font-weight:500;border-bottom:1px solid #eee;'>Trạng thái đơn:</td>
                        <td style='padding:8px 12px;border-bottom:1px solid #eee;'><span style='color:#008000;font-weight:bold;'>{GetOrderStatusName(fullOrder.TrangThaiDon)}</span></td></tr>";

                if (latestPayment != null && !string.IsNullOrEmpty(latestPayment.MaGiaoDich))
                {
                    infoRows += $@"
                        <tr><td width='150' align='right' valign='top' style='padding:8px 12px;background:#f8f9fa;font-weight:500;border-bottom:1px solid #eee;'>Mã giao dịch:</td>
                            <td style='padding:8px 12px;border-bottom:1px solid #eee;'>{latestPayment.MaGiaoDich}</td></tr>
                        <tr><td width='150' align='right' valign='top' style='padding:8px 12px;background:#f8f9fa;font-weight:500;border-bottom:1px solid #eee;'>Ngày thanh toán:</td>
                            <td style='padding:8px 12px;border-bottom:1px solid #eee;'>{latestPayment.NgayThanhToan:dd/MM/yyyy HH:mm}</td></tr>";
                }

                // Lấy chính sách hoàn tiền từ RefundPolicyEngine
                string refundPolicyHtml = string.Empty;
                var policyList = RefundPolicyEngine.GetCancellationPolicy();
                if (policyList.Any())
                {
                    var policyItems = string.Join("", policyList.Select(p =>
                        $"<li>Hủy từ {p.DaysBefore} ngày trước khởi hành: Hoàn {p.RefundRate}%</li>"));

                    refundPolicyHtml = $@"
                    <tr>
                        <td colspan='2' style='padding:8px 12px; background:#fff3cd; border:1px solid #ffeeba;'>
                            <p style='margin:0 0 5px 0;font-weight:bold;color:#856404;'>CHÍNH SÁCH HỦY TOUR VÀ HOÀN TIỀN</p>
                            <ul style='margin:0;padding-left:20px;font-size:9.5pt;color:#333;'>
                                {policyItems}
                                <li style='margin-top:5px;'><em>Chính sách hoàn tiền được áp dụng theo thời điểm hệ thống ghi nhận yêu cầu hủy tour.</em></li>
                            </ul>
                        </td>
                    </tr>";
                }

                string body = $@"<!DOCTYPE html>
                <html lang='vi'>
                <head><meta charset='UTF-8'></head>
                <body style='margin:0;padding:0;background:#ffffff;font-family:Roboto,Arial,sans-serif;'>
                <table width='100%' cellpadding='0' cellspacing='0' style='max-width:640px;margin:0;background:#fff;'>
                <tbody>
                  <tr>
                    <td style='padding:0;'>
                      <p style='margin:0;padding:12px 0 8px 0;text-align:center;font-size:16pt;font-weight:bold;text-transform:uppercase;'>
                        XÁC NHẬN THANH TOÁN ĐẦY ĐỦ
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style='padding:3.75pt 7.5pt;'>
                      <p style='margin:0 0 10px 0;font-size:10.5pt;'>Kính gửi Quý khách <strong>{hoTen}</strong>,</p>
                      <p style='margin:0 0 10px 0;font-size:10.5pt;'>
                        Chúng tôi xin xác nhận Quý khách đã hoàn tất thanh toán cho đơn đặt tour <strong>{fullOrder.MaDatCho}</strong>.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style='padding:0;'>
                      <p style='margin:8px 0 4px 0;font-weight:bold;color:#c50000;text-transform:uppercase;font-size:10.5pt;'>
                        CHI TIẾT THANH TOÁN
                      </p>
                      <table border='0' cellpadding='0' cellspacing='0' width='100%'>
                        <tbody>
                          {infoRows}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  {refundPolicyHtml}
                  <tr>
                    <td style='padding:8px 0 12px 0;'>
                      <p style='margin:0;font-size:10.5pt;'>
                        Trân trọng,<br/><strong>Đội ngũ Lối Riêng Travel</strong>
                      </p>
                      <p style='margin:5px 0 0 0;font-size:9pt;color:#888;'>
                        Email: support@loiriengtravel.com | Hotline: 1900 1234
                      </p>
                      <p style='margin:5px 0 0 0;font-size:8pt;color:#aaa;'>
                        * Đây là email tự động, vui lòng không trả lời email này.
                      </p>
                    </td>
                  </tr>
                </tbody>
                </table>
                </body>
                </html>";

                await _emailService.SendEmailAsync(toEmail, subject, body);
                _logger.LogInformation($"Gửi email xác nhận thanh toán đầy đủ thành công đến {toEmail}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Lỗi gửi email xác nhận thanh toán đầy đủ cho đơn {order.MaDatCho}");
            }
        }

        private async Task SendNotificationsAfterFirstPayment(DonDatTour order)
        {
            // Chỉ gửi email xác nhận đặt tour khi đặt cọc (lần đầu thanh toán)
            try
            {
                await _emailService.SendBookingConfirmationAsync(order);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gửi mail xác nhận đặt tour thất bại cho đơn {MaDatCho}", order.MaDatCho);
            }

            try
            {
                await _notificationService.CreateForUserAsync(
                    order.MaNguoiDung,
                    new CreateNotificationDTO
                    {
                        TieuDe = "Thanh toán thành công",
                        NoiDung = $"Đơn đặt tour {order.MaDatCho} đã thanh toán thành công và được xác nhận.",
                        LoaiThongBao = (int)NotificationType.Payment,
                        LinkChiTiet = $"/Thong-Tin-Ca-Nhan"
                    });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Tạo thông báo cho khách hàng thất bại cho đơn {MaDatCho}", order.MaDatCho);
            }

            try
            {
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
                        LinkChiTiet = $"/Quan-ly/Don-dat-cac-chuyen-di"
                    });

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
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Tạo thông báo cho nhân viên thất bại cho đơn {MaDatCho}", order.MaDatCho);
            }
        }

        private async Task SendNotificationsAfterFullPayment(DonDatTour order)
        {
            // Gửi email xác nhận thanh toán đầy đủ (KHÔNG gửi lại email xác nhận đặt tour)
            try
            {
                await SendFullPaymentConfirmationEmail(order);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gửi mail xác nhận thanh toán đầy đủ thất bại cho đơn {MaDatCho}", order.MaDatCho);
            }

            try
            {
                await _notificationService.CreateForUserAsync(
                    order.MaNguoiDung,
                    new CreateNotificationDTO
                    {
                        TieuDe = "Thanh toán đầy đủ thành công",
                        NoiDung = $"Đơn đặt tour {order.MaDatCho} đã được thanh toán đầy đủ.",
                        LoaiThongBao = (int)NotificationType.Payment,
                        LinkChiTiet = $"/Thong-Tin-Ca-Nhan"
                    });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Tạo thông báo cho khách hàng thất bại cho đơn {MaDatCho}", order.MaDatCho);
            }

            try
            {
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
                        TieuDe = "Khách hàng đã thanh toán đầy đủ",
                        NoiDung = $"Đơn {order.MaDatCho} vừa được thanh toán đầy đủ.",
                        LoaiThongBao = (int)NotificationType.Booking,
                        LinkChiTiet = $"/Quan-ly/Don-dat-cac-chuyen-di"
                    });

                await _dashboardNotifier.NotifyDashboardChangedAsync("BookingFullyPaid", new
                {
                    order.MaDonDatTour,
                    order.NgayCapNhat,
                    order.TrangThaiDon
                });

                await _hubContext.Clients.Group("ADMIN_GROUP").SendAsync("BookingFullyPaid", new
                {
                    MaDonDatTour = order.MaDonDatTour,
                    MaDatCho = order.MaDatCho,
                    TongTien = order.TongTien
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Tạo thông báo cho nhân viên thất bại cho đơn {MaDatCho}", order.MaDatCho);
            }
        }

        #endregion
    }
}