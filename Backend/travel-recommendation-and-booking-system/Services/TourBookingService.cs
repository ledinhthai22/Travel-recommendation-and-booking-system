using DTOs.Page;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using travel_recommendation_and_booking_system.Constants;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.DTOs.Log;
using travel_recommendation_and_booking_system.DTOs.LogSystem;
using travel_recommendation_and_booking_system.DTOs.Notifications;
using travel_recommendation_and_booking_system.DTOs.TourBooking;
using travel_recommendation_and_booking_system.Helpers;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Models;
using travel_recommendation_and_booking_system.Services.PdfBuilders;
using travel_recommendation_and_booking_system.SignalR;

namespace travel_recommendation_and_booking_system.Services
{
    public class TourBookingService : ITourBookingService
    {
        private readonly AppDbContext _context;
        private readonly ILogService _logService;
        private readonly ICurrentUserService _currentUserService;
        private readonly IHubContext<TravelRecommendationHub> _hubContext;
        private readonly IEmailService _emailService;
        private readonly INotificationService _notificationService;
        private readonly IRecommendationService _recommendationService;
        private readonly IDashboardNotifier _dashboardNotifier;
        private readonly ITourCacheService _tourCacheService;
        private readonly IRefundService _refundService;

        #region Status Constants

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

        // Phương thức thanh toán
        private const int PTTT_VNPAY = BookingConstants.PTTT_VNPAY;
        private const int PTTT_TIEN_MAT = BookingConstants.PTTT_TIEN_MAT;
        private const int PTTT_CHUYEN_KHOAN = BookingConstants.PTTT_CHUYEN_KHOAN;

        private static readonly int[] ValidDepositPercentages = BookingConstants.ValidDepositPercentages;

        #endregion

        public TourBookingService(
            AppDbContext context,
            ILogService logService,
            ICurrentUserService currentUserService,
            IHubContext<TravelRecommendationHub> hubContext,
            IEmailService emailService,
            INotificationService notificationService,
            IRecommendationService recommendationService,
            IDashboardNotifier dashboardNotifier,
            ITourCacheService tourCacheService,
            IRefundService refundService)
        {
            _context = context;
            _logService = logService;
            _currentUserService = currentUserService;
            _hubContext = hubContext;
            _emailService = emailService;
            _notificationService = notificationService;
            _recommendationService = recommendationService;
            _dashboardNotifier = dashboardNotifier;
            _tourCacheService = tourCacheService;
            _refundService = refundService;
        }

        #region Helper Methods

        private static int GetLatestPaymentStatus(ICollection<ThanhToan> payments)
        {
            return payments?.OrderByDescending(p => p.NgayThanhToan)
                           .Select(p => p.TrangThaiThanhToan)
                           .FirstOrDefault() ?? 0;
        }

        private static ThanhToan? GetSuccessfulPayment(ICollection<ThanhToan> payments)
        {
            return payments?.Where(p => p.TrangThaiThanhToan == TT_THANH_CONG && p.LoaiThanhToan != LOAI_HOAN_TIEN)
                           .OrderByDescending(p => p.NgayThanhToan)
                           .FirstOrDefault();
        }

        private static ThanhToan? GetLatestPayment(ICollection<ThanhToan> payments)
        {
            return payments?.OrderByDescending(p => p.NgayThanhToan).FirstOrDefault();
        }

        private static ThanhToan? GetRefundPayment(ICollection<ThanhToan> payments)
        {
            return payments?.Where(p => p.LoaiThanhToan == LOAI_HOAN_TIEN)
                           .OrderByDescending(p => p.NgayThanhToan)
                           .FirstOrDefault();
        }

        private static string GetPaymentMethodName(int method) => method switch
        {
            PTTT_VNPAY => "VNPay",
            PTTT_TIEN_MAT => "Tiền mặt",
            PTTT_CHUYEN_KHOAN => "Chuyển khoản",
            _ => "Không xác định"
        };

        private static string GetPaymentStatusName(int status) => status switch
        {
            TT_CHO_XU_LY => "Chờ xử lý",
            TT_THANH_CONG => "Thành công",
            TT_THAT_BAI => "Thất bại",
            TT_DA_HUY => "Đã hủy",
            _ => "Không xác định"
        };

        private static string GetFinancialStatusName(int status) => status switch
        {
            TC_CHUA_THANH_TOAN => "Chưa thanh toán",
            TC_DA_DAT_COC => "Đã đặt cọc",
            TC_DA_THANH_TOAN_DU => "Đã thanh toán đủ",
            TC_DANG_HOAN_TIEN => "Đang hoàn tiền",
            TC_DA_HOAN_TIEN => "Đã hoàn tiền",
            TC_MAT_COC => "Mất cọc",
            _ => "Không xác định"
        };

        private static string GetOrderStatusName(int status) => status switch
        {
            DON_CHO_THANH_TOAN => "Chờ thanh toán",
            DON_CHO_DUYET => "Chờ duyệt",
            DON_DA_DUYET => "Đã duyệt",
            DON_DANG_DIEN_RA => "Đang diễn ra",
            DON_HOAN_TAT => "Hoàn tất",
            DON_DA_HUY => "Đã hủy",
            _ => "Không xác định"
        };

        private static string GetPaymentTypeName(int type) => type switch
        {
            LOAI_DAT_COC => "Đặt cọc",
            LOAI_THANH_TOAN_PHAN_CON_LAI => "Thanh toán phần còn lại",
            LOAI_THANH_TOAN_TOAN_BO => "Thanh toán toàn bộ",
            LOAI_HOAN_TIEN => "Hoàn tiền",
            _ => "Khác"
        };

        private string FormatPrice(decimal price)
        {
            return price.ToString("#,##0", System.Globalization.CultureInfo.InvariantCulture)
                        .Replace(",", ".");
        }

        private static bool IsValidDepositPercentage(int percentage)
        {
            return ValidDepositPercentages.Contains(percentage);
        }

        private static bool IsOrderActive(int status)
        {
            return status >= DON_CHO_THANH_TOAN && status <= DON_DANG_DIEN_RA;
        }

        private static bool IsOrderCancelled(int status)
        {
            return status == DON_DA_HUY;
        }

        private static bool IsOrderCompleted(int status)
        {
            return status == DON_HOAN_TAT;
        }

        #endregion

        #region ADMIN APIs

        public async Task<PageDTO<TourBookingResponseDTO>> GetPagedDonDatToursAsync(
    string? keyword,
    int? trangThaiDon,
    int? trangThaiThanhToan,
    DateTime? tuNgay,
    DateTime? denNgay,
    int page,
    int size)
        {
            page = Math.Max(1, page);
            size = Math.Max(1, size);

            var query = _context.DonDatTours
                .Include(x => x.NguoiDung)
                .Include(x => x.ChuyenKhoiHanh)
                .Include(x => x.NhanVien)
                .AsNoTracking();

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                query = query.Where(x =>
                    x.MaDatCho.Contains(keyword) ||
                    (x.NguoiDung != null && x.NguoiDung.HoTen.Contains(keyword)) ||
                    (x.ChuyenKhoiHanh != null && x.ChuyenKhoiHanh.MaChuyenCode.Contains(keyword)));
            }

            if (trangThaiDon.HasValue)
            {
                query = query.Where(x => x.TrangThaiDon == trangThaiDon.Value);
            }

            if (trangThaiThanhToan.HasValue)
            {
                query = query.Where(x =>
                    x.ThanhToans
                        .OrderByDescending(t => t.NgayThanhToan)
                        .ThenByDescending(t => t.MaThanhToan)
                        .Select(t => (int?)t.TrangThaiThanhToan)
                        .FirstOrDefault() == trangThaiThanhToan.Value ||
                    (!x.ThanhToans.Any() && trangThaiThanhToan.Value == 0));
            }

            // Lọc theo khoảng thời gian từ ngày đến ngày
            if (tuNgay.HasValue && denNgay.HasValue)
            {
                var fromDate = tuNgay.Value.Date;
                var toDate = denNgay.Value.Date.AddDays(1).AddTicks(-1);
                query = query.Where(x => x.NgayDat >= fromDate && x.NgayDat <= toDate);
            }
            else if (tuNgay.HasValue)
            {
                var fromDate = tuNgay.Value.Date;
                query = query.Where(x => x.NgayDat >= fromDate);
            }
            else if (denNgay.HasValue)
            {
                var toDate = denNgay.Value.Date.AddDays(1).AddTicks(-1);
                query = query.Where(x => x.NgayDat <= toDate);
            }

            var totalItems = await query.CountAsync();

            var items = await query
                .OrderByDescending(x => x.NgayDat)
                .ThenByDescending(x => x.MaDonDatTour)
                .Skip((page - 1) * size)
                .Take(size)
                .Select(x => new
                {
                    Booking = x,
                    LastPayment = x.ThanhToans
                        .OrderByDescending(t => t.NgayThanhToan)
                        .ThenByDescending(t => t.MaThanhToan)
                        .Select(t => new
                        {
                            t.TrangThaiThanhToan,
                            t.PhuongThucThanhToan,
                            t.MaGiaoDich,
                            t.NgayThanhToan,
                            t.LoaiThanhToan
                        })
                        .FirstOrDefault()
                })
                .ToListAsync();

            var result = new List<TourBookingResponseDTO>();

            foreach (var x in items)
            {
                var dto = new TourBookingResponseDTO
                {
                    MaDonDatTour = x.Booking.MaDonDatTour,
                    MaDatCho = x.Booking.MaDatCho,
                    TenKhachHang = x.Booking.NguoiDung?.HoTen ?? "",
                    MaCodeChuyen = x.Booking.ChuyenKhoiHanh?.MaChuyenCode ?? "",
                    DiemKhoiHanh = x.Booking.ChuyenKhoiHanh?.DiemKhoiHanh ?? "",
                    DiemDen = x.Booking.ChuyenKhoiHanh?.DiemDen ?? "",
                    NgayKhoiHanh = x.Booking.ChuyenKhoiHanh?.NgayKhoiHanh ?? DateTime.MinValue,
                    TongTien = x.Booking.TongTien,
                    TienCoc = x.Booking.TienCoc,
                    SoTienDaThanhToan = x.Booking.SoTienDaThanhToan,
                    TrangThaiDon = x.Booking.TrangThaiDon,
                    TrangThaiTaiChinh = x.Booking.TrangThaiTaiChinh,
                    NgayDuyet = x.Booking.NgayDuyet,
                    NhanVienDuyet = x.Booking.NhanVien?.HoTen,
                    TenNguoiDung = x.Booking.NguoiDung?.HoTen ?? "",
                    Email = x.Booking.NguoiDung?.Email ?? "",
                    SoDienThoai = x.Booking.NguoiDung?.SoDienThoai ?? "",
                    MaChuyen = x.Booking.ChuyenKhoiHanh?.MaChuyen ?? 0,
                    TenTrangThaiDon = GetOrderStatusName(x.Booking.TrangThaiDon),
                    TenTrangThaiTaiChinh = GetFinancialStatusName(x.Booking.TrangThaiTaiChinh),
                    CoCanhBaoCongNo = x.Booking.CoCanhBaoCongNo,
                    NgayGanCoCanhBao = x.Booking.NgayGanCoCanhBao,
                    NgayDat =x.Booking.NgayDat
                };

                if (x.LastPayment != null)
                {
                    dto.TrangThaiThanhToan = x.LastPayment.TrangThaiThanhToan;
                    dto.LoaiThanhToan = x.LastPayment.LoaiThanhToan;
                    dto.PhuongThucThanhToan = GetPaymentMethodName(x.LastPayment.PhuongThucThanhToan);
                    dto.MaGiaoDich = x.LastPayment.MaGiaoDich;
                    dto.NgayThanhToan = x.LastPayment.NgayThanhToan;
                    dto.TenTrangThaiThanhToan = GetPaymentStatusName(x.LastPayment.TrangThaiThanhToan);
                    dto.TenLoaiThanhToan = GetPaymentTypeName(x.LastPayment.LoaiThanhToan);
                }
                else
                {
                    dto.TrangThaiThanhToan = 0;
                    dto.LoaiThanhToan = 0;
                    dto.PhuongThucThanhToan = null;
                    dto.MaGiaoDich = null;
                    dto.NgayThanhToan = null;
                    dto.TenTrangThaiThanhToan = "Chưa thanh toán";
                    dto.TenLoaiThanhToan = "Khác";
                }
                dto.SoTienConLai = IsOrderCancelled(x.Booking.TrangThaiDon)
                    ? 0
                    : x.Booking.TongTien - x.Booking.SoTienDaThanhToan;

                result.Add(dto);
            }

            return new PageDTO<TourBookingResponseDTO>
            {
                Items = result,
                TotalItems = totalItems,
                PageNumber = page,
                PageSize = size
            };
        }

        public async Task<TourBookingDetailDTO?> GetDetailAsync(int maDonDatTour)
        {
            var order = await _context.DonDatTours
                .AsNoTracking()
                .Include(x => x.NguoiDung)
                .Include(x => x.ChuyenKhoiHanh)
                    .ThenInclude(x => x.Tour)
                    .ThenInclude(x => x.HinhAnhTours)
                .Include(x => x.ChuyenKhoiHanh)
                    .ThenInclude(x => x.NhanVien)
                .Include(x => x.NhanVien)
                .Include(x => x.UuDai)
                .Include(x => x.KhachHangs)
                .Include(x => x.ThanhToans)
                .FirstOrDefaultAsync(x => x.MaDonDatTour == maDonDatTour);

            if (order == null) return null;

            var latestPayment = GetLatestPayment(order.ThanhToans);
            var paymentStatus = GetLatestPaymentStatus(order.ThanhToans);
            var soPhongDon = order.KhachHangs.Count(k => k.PhongDon && k.LoaiKhach == 1);

            return new TourBookingDetailDTO
            {
                MaDonDatTour = order.MaDonDatTour,
                MaDatCho = order.MaDatCho,
                TenNguoiDat = order.NguoiDung!.HoTen,
                SoDienThoai = order.NguoiDung.SoDienThoai,
                Email = order.NguoiDung.Email,
                GhiChu = order.GhiChu,
                DiaChi = order.NguoiDung.DiaChi,
                Tour = new TourInfoDTO
                {
                    TenTour = order.ChuyenKhoiHanh!.Tour.TenTour
                },
                Chuyen = new ChuyenInfoDTO
                {
                    MaChuyen = order.ChuyenKhoiHanh.MaChuyen,
                    MaChuyenCode = order.ChuyenKhoiHanh.MaChuyenCode,
                    DiemKhoiHanh = order.ChuyenKhoiHanh.DiemKhoiHanh,
                    DiemDen = order.ChuyenKhoiHanh.DiemDen,
                    NgayKhoiHanh = order.ChuyenKhoiHanh.NgayKhoiHanh,
                    NgayKetThuc = order.ChuyenKhoiHanh.NgayKetThuc,
                    TenHuongDanVien = order.ChuyenKhoiHanh.NhanVien?.HoTen
                },
                TenUuDai = order.UuDai?.TenUuDai,
                MaCode = order.UuDai?.MaCode,
                SoNguoiLon = order.SoNguoiLon,
                SoTreEm = order.SoTreEm,
                SoEmBe = order.SoEmBe,
                SoPhongDon = soPhongDon,
                GiaNguoiLonTaiDat = order.GiaNguoiLonTaiDat,
                GiaTreEmTaiDat = order.GiaTreEmTaiDat,
                GiaEmBeTaiDat = order.GiaEmBeTaiDat,
                PhuThuPhongDonTaiDat = order.PhuThuPhongDonTaiDat,
                GiaTriGiamTaiDat = order.GiaTriGiamTaiDat,
                TongTien = order.TongTien,
                TrangThaiTaiChinh = order.TrangThaiTaiChinh,
                TenTrangThaiTaiChinh = GetFinancialStatusName(order.TrangThaiTaiChinh),
                TienCoc = order.TienCoc,
                SoTienDaThanhToan = order.SoTienDaThanhToan,
                TrangThaiThanhToan = paymentStatus,
                TenTrangThaiThanhToan = GetPaymentStatusName(paymentStatus),
                TrangThaiDon = order.TrangThaiDon,
                TenTrangThaiDon = GetOrderStatusName(order.TrangThaiDon),
                CoCanhBaoCongNo = order.CoCanhBaoCongNo,
                NgayGanCoCanhBao = order.NgayGanCoCanhBao,
                NgayDat = order.NgayDat,
                NgayDuyet = order.NgayDuyet,
                NhanVienDuyet = order.NhanVien?.HoTen,
                LyDoHuy = order.LyDoHuy,
                NgayHuy = order.NgayHuy,
                AdminNote = order.AdminNote,
                DanhSachHanhKhach = order.KhachHangs.Select(k => new KhachHangDTO
                {
                    MaKhachHang = k.MaKhachHang,
                    HoTen = k.HoTen,
                    SoDienThoai = k.SoDienThoai,
                    Email = k.Email,
                    NgaySinh = k.NgaySinh,
                    GioiTinh = k.GioiTinh,
                    LoaiKhach = k.LoaiKhach,
                    PhongDon = k.PhongDon
                }).ToList(),
                ThongTinThanhToan = latestPayment == null ? null : new ThanhToanDTO
                {
                    MaThanhToan = latestPayment.MaThanhToan,
                    PhuongThucThanhToan = latestPayment.PhuongThucThanhToan,
                    TenPhuongThuc = GetPaymentMethodName(latestPayment.PhuongThucThanhToan),
                    MaGiaoDich = latestPayment.MaGiaoDich,
                    NoiDung = latestPayment.NoiDung,
                    NgayThanhToan = latestPayment.NgayThanhToan,
                    TrangThaiThanhToan = latestPayment.TrangThaiThanhToan,
                    TenTrangThai = GetPaymentStatusName(latestPayment.TrangThaiThanhToan),
                    TongTienThanhToan = latestPayment.TongTienThanhToan,
                    LoaiThanhToan = latestPayment.LoaiThanhToan,
                    TenLoaiThanhToan = GetPaymentTypeName(latestPayment.LoaiThanhToan)
                },
                LichSuThanhToan = order.ThanhToans
                    .OrderBy(t => t.NgayThanhToan)
                    .Select(t => new ThanhToanDTO
                    {
                        MaThanhToan = t.MaThanhToan,
                        PhuongThucThanhToan = t.PhuongThucThanhToan,
                        TenPhuongThuc = GetPaymentMethodName(t.PhuongThucThanhToan),
                        MaGiaoDich = t.MaGiaoDich,
                        NoiDung = t.NoiDung,
                        NgayThanhToan = t.NgayThanhToan,
                        TrangThaiThanhToan = t.TrangThaiThanhToan,
                        TenTrangThai = GetPaymentStatusName(t.TrangThaiThanhToan),
                        TongTienThanhToan = t.TongTienThanhToan,
                        LoaiThanhToan = t.LoaiThanhToan,
                        TenLoaiThanhToan = GetPaymentTypeName(t.LoaiThanhToan)
                    }).ToList()
            };
        }

        public async Task<int> CreateBookingByAdminAsync(CreateBookingAdminDTO dto)
        {
            const int maxRetry = 3;

            for (int attempt = 1; attempt <= maxRetry; attempt++)
            {
                using var transaction = await _context.Database.BeginTransactionAsync();
                try
                {
                    var user = await _context.NguoiDungs
                        .FirstOrDefaultAsync(x => x.MaNguoiDung == dto.MaNguoiDung)
                        ?? throw new KeyNotFoundException("Người dùng không tồn tại");

                    var chuyen = await _context.ChuyenKhoiHanhs
                        .Include(x => x.Tour)
                        .Include(x => x.GiaChuyens)
                        .FirstOrDefaultAsync(x => x.MaChuyen == dto.MaChuyen)
                        ?? throw new KeyNotFoundException("Chuyến không tồn tại");

                    if (chuyen.TrangThai != 1)
                        throw new InvalidOperationException("Chuyến không còn mở bán");

                    var tongKhach = dto.SoNguoiLon + dto.SoTreEm + dto.SoEmBe;
                    if (tongKhach <= 0)
                        throw new InvalidOperationException("Số khách phải lớn hơn 0");

                    var daDat = await _context.DonDatTours
                        .Where(x => x.MaChuyen == dto.MaChuyen && x.TrangThaiDon != DON_DA_HUY)
                        .SumAsync(x => x.SoNguoiLon + x.SoTreEm + x.SoEmBe);

                    var conLai = chuyen.SoChoToiDa - daDat;
                    if (conLai < tongKhach)
                        throw new InvalidOperationException($"Không đủ chỗ. Còn lại: {conLai}");

                    var soNguoiLonList = dto.DanhSachHanhKhach.Count(k => k.LoaiKhach == 1);
                    var soTreEmList = dto.DanhSachHanhKhach.Count(k => k.LoaiKhach == 2);
                    var soEmBeList = dto.DanhSachHanhKhach.Count(k => k.LoaiKhach == 3);

                    if (soNguoiLonList != dto.SoNguoiLon || soTreEmList != dto.SoTreEm || soEmBeList != dto.SoEmBe)
                        throw new InvalidOperationException("Số lượng hành khách trong danh sách không khớp.");

                    var gia = chuyen.GiaChuyens.FirstOrDefault()
                        ?? throw new InvalidOperationException("Chuyến chưa có bảng giá");

                    var soPhongDon = dto.DanhSachHanhKhach.Count(k => k.PhongDon && k.LoaiKhach == 1);

                    var tongTien = dto.SoNguoiLon * gia.GiaNguoiLon +
                                   dto.SoTreEm * gia.GiaTreEm +
                                   dto.SoEmBe * gia.GiaEmBe +
                                   soPhongDon * gia.PhuThuPhongDon;

                    var tyLeCoc = dto.TyLeCoc ?? 30;
                    if (!IsValidDepositPercentage(tyLeCoc))
                        throw new InvalidOperationException("Tỷ lệ cọc chỉ được phép 30%, 50% hoặc 100%");

                    var tienCoc = Math.Round(tongTien * tyLeCoc / 100m, 0);
                    var thanhToanToanBo = tyLeCoc == 100;

                    var trangThaiDon = thanhToanToanBo ? DON_DA_DUYET : DON_CHO_DUYET;
                    var trangThaiTaiChinh = thanhToanToanBo ? TC_DA_THANH_TOAN_DU : TC_DA_DAT_COC;

                    var maDatCho = $"CKH{DateTime.Now:yyyyMMddHHmmssfff}{Random.Shared.Next(100, 999)}";

                    var order = new DonDatTour
                    {
                        MaNguoiDung = dto.MaNguoiDung,
                        MaChuyen = dto.MaChuyen,
                        MaDatCho = maDatCho,
                        MaUuDai = dto.MaUuDai,
                        GhiChu = dto.GhiChu ?? "",
                        SoNguoiLon = dto.SoNguoiLon,
                        SoTreEm = dto.SoTreEm,
                        SoEmBe = dto.SoEmBe,
                        SoPhongDon = soPhongDon,
                        GiaNguoiLonTaiDat = gia.GiaNguoiLon,
                        GiaTreEmTaiDat = gia.GiaTreEm,
                        GiaEmBeTaiDat = gia.GiaEmBe,
                        PhuThuPhongDonTaiDat = gia.PhuThuPhongDon,
                        GiaTriGiamTaiDat = 0,
                        TongTien = tongTien,
                        TienCoc = thanhToanToanBo ? 0 : tienCoc,
                        SoTienDaThanhToan = thanhToanToanBo ? tongTien : tienCoc,
                        NgayDat = DateTime.Now,
                        NgayCapNhat = DateTime.Now,
                        TrangThaiDon = trangThaiDon,
                        TrangThaiTaiChinh = trangThaiTaiChinh,
                        MaNhanVienDuyet = thanhToanToanBo ? dto.MaNhanVien : null,
                        NgayDuyet = thanhToanToanBo ? DateTime.Now : null,
                        LichSuTrangThai = $"[{{\"OldStatus\":0,\"NewStatus\":{trangThaiDon},\"Action\":\"Tạo đơn bởi Admin\",\"Timestamp\":\"{DateTime.Now:yyyy-MM-ddTHH:mm:ss}\",\"UserId\":\"{dto.MaNhanVien}\"}}]"
                    };

                    _context.DonDatTours.Add(order);

                    var khachHangs = dto.DanhSachHanhKhach.Select(k => new KhachHang
                    {
                        DonDatTour = order,
                        HoTen = k.HoTen,
                        SoDienThoai = k.SoDienThoai,
                        Email = k.Email,
                        NgaySinh = k.NgaySinh,
                        GioiTinh = k.GioiTinh,
                        LoaiKhach = k.LoaiKhach,
                        PhongDon = k.PhongDon,
                    }).ToList();

                    _context.KhachHangs.AddRange(khachHangs);

                    chuyen.SoChoDaDat += tongKhach;
                    chuyen.NgayCapNhat = DateTime.Now;

                    await _context.SaveChangesAsync();

                    if (thanhToanToanBo)
                    {
                        _context.ThanhToans.Add(new ThanhToan
                        {
                            MaDonDatTour = order.MaDonDatTour,
                            PhuongThucThanhToan = dto.PhuongThucThanhToan,
                            NgayThanhToan = DateTime.Now,
                            TongTienThanhToan = tongTien,
                            TrangThaiThanhToan = TT_THANH_CONG,
                            LoaiThanhToan = LOAI_THANH_TOAN_TOAN_BO,
                            NoiDung = $" xác nhận thanh toán toàn bộ cho đơn {maDatCho}",
                            
                        });
                    }
                    else if (tienCoc > 0)
                    {
                        _context.ThanhToans.Add(new ThanhToan
                        {
                            MaDonDatTour = order.MaDonDatTour,
                            PhuongThucThanhToan = dto.PhuongThucThanhToan,
                            NgayThanhToan = DateTime.Now,
                            TongTienThanhToan = tienCoc,
                            TrangThaiThanhToan = TT_THANH_CONG,
                            LoaiThanhToan = LOAI_DAT_COC,
                            NoiDung = $" xác nhận đặt cọc {tyLeCoc}% cho đơn {maDatCho}",
                            
                        });
                    }

                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();

                    await NotifyBookingCreated(order, user.HoTen);

                    return order.MaDonDatTour;
                }
                catch (DbUpdateConcurrencyException) when (attempt < maxRetry)
                {
                    await transaction.RollbackAsync();
                    foreach (var entry in _context.ChangeTracker.Entries())
                        entry.State = EntityState.Detached;
                    await Task.Delay(100 * attempt);
                }
                catch
                {
                    await transaction.RollbackAsync();
                    throw;
                }
            }

            throw new InvalidOperationException("Hệ thống đang bận, vui lòng thử lại.");
        }

        public async Task<bool> UpdateBookingByAdminAsync(UpdateBookingAdminDTO dto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var order = await _context.DonDatTours
                    .Include(x => x.ChuyenKhoiHanh)
                    .FirstOrDefaultAsync(x => x.MaDonDatTour == dto.MaDonDatTour)
                    ?? throw new KeyNotFoundException("Không tìm thấy đơn đặt tour");

                if (order.TrangThaiDon == DON_HOAN_TAT)
                    throw new InvalidOperationException("Đơn đã hoàn tất, không thể chỉnh sửa");

                if (IsOrderCancelled(order.TrangThaiDon))
                    throw new InvalidOperationException("Đơn đã bị hủy");

                var oldValue = new
                {
                    order.SoNguoiLon,
                    order.SoTreEm,
                    order.SoEmBe,
                    order.MaUuDai,
                    order.TrangThaiDon,
                    order.TrangThaiTaiChinh
                };

                if (dto.SoNguoiLon.HasValue) order.SoNguoiLon = dto.SoNguoiLon.Value;
                if (dto.SoTreEm.HasValue) order.SoTreEm = dto.SoTreEm.Value;
                if (dto.SoEmBe.HasValue) order.SoEmBe = dto.SoEmBe.Value;
                if (dto.MaUuDai.HasValue) order.MaUuDai = dto.MaUuDai;
                if (dto.TrangThaiTaiChinh.HasValue) order.TrangThaiTaiChinh = dto.TrangThaiTaiChinh.Value;

                var soKhachCu = oldValue.SoNguoiLon + oldValue.SoTreEm + oldValue.SoEmBe;
                var soKhachMoi = order.SoNguoiLon + order.SoTreEm + order.SoEmBe;
                var delta = soKhachMoi - soKhachCu;

                if (delta != 0)
                {
                    order.ChuyenKhoiHanh!.SoChoDaDat += delta;
                    order.ChuyenKhoiHanh.NgayCapNhat = DateTime.Now;
                }

                var daDat = await _context.DonDatTours
                    .Where(x => x.MaChuyen == order.MaChuyen
                             && x.MaDonDatTour != order.MaDonDatTour
                             && x.TrangThaiDon != DON_DA_HUY)
                    .SumAsync(x => x.SoNguoiLon + x.SoTreEm + x.SoEmBe);

                if (order.ChuyenKhoiHanh.SoChoToiDa - daDat < soKhachMoi)
                    throw new InvalidOperationException("Không đủ chỗ sau khi cập nhật");

                if (dto.TrangThaiDon.HasValue)
                {
                    if (IsOrderCancelled(dto.TrangThaiDon.Value))
                        throw new InvalidOperationException("Vui lòng dùng chức năng Hủy đơn để hủy.");

                    if (!new[] { DON_CHO_THANH_TOAN, DON_CHO_DUYET, DON_DA_DUYET, DON_DANG_DIEN_RA, DON_HOAN_TAT }.Contains(dto.TrangThaiDon.Value))
                        throw new InvalidOperationException("Trạng thái không hợp lệ");

                    order.TrangThaiDon = dto.TrangThaiDon.Value;
                }

                order.NgayCapNhat = DateTime.Now;
                await _context.SaveChangesAsync();

                if (dto.TrangThaiDon.HasValue && dto.TrangThaiDon.Value != oldValue.TrangThaiDon)
                {
                    await NotifyOrderStatusChanged(order);
                }

                await transaction.CommitAsync();
                return true;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<bool> ApproveAsync(int maDonDatTour, int maNhanVien)
        {
            var order = await _context.DonDatTours
                .Include(x => x.NguoiDung)
                .Include(x => x.ChuyenKhoiHanh)
                    .ThenInclude(x => x.Tour)
                .FirstOrDefaultAsync(x => x.MaDonDatTour == maDonDatTour);

            if (order == null) return false;

            if (order.TrangThaiDon != DON_CHO_DUYET)
                throw new InvalidOperationException("Chỉ có thể duyệt đơn đang ở trạng thái Chờ duyệt.");

            if (order.TrangThaiTaiChinh == TC_CHUA_THANH_TOAN)
                throw new InvalidOperationException("Đơn chưa hoàn thành đặt cọc, không thể duyệt.");

            var oldStatus = order.TrangThaiDon;

            order.TrangThaiDon = DON_DA_DUYET;
            order.MaNhanVienDuyet = maNhanVien;
            order.NgayDuyet = DateTime.Now;
            order.NgayCapNhat = DateTime.Now;

            order.AppendStatusHistory(oldStatus, order.TrangThaiDon, "Duyệt đơn", $"Nhân viên {maNhanVien} duyệt");

            await _context.SaveChangesAsync();

            await _notificationService.CreateForUserAsync(
                order.MaNguoiDung,
                new CreateNotificationDTO
                {
                    TieuDe = "Đơn đặt tour đã được xác nhận",
                    NoiDung = $"Đơn {order.MaDatCho} - {order.ChuyenKhoiHanh?.Tour?.TenTour} đã được xác nhận.",
                    LoaiThongBao = (int)NotificationType.Booking,
                    LinkChiTiet = $"/Thong-Tin-Ca-Nhan"
                });

            await _dashboardNotifier.NotifyDashboardChangedAsync("OrderStatusChanged", new
            {
                order.MaDonDatTour,
                TrangThaiMoi = order.TrangThaiDon
            });

            await _logService.LoggingAsync(new LogDTO
            {
                LoaiTaiKhoan = _currentUserService.GetUserId() == 1 ? AccountTypeDTO.QuanTriVien : AccountTypeDTO.NhanVien,
                Email = _currentUserService.GetEmail(),
                MaTaiKhoan = maNhanVien,
                TenHanhDong = ActionLogDTO.CapNhat,
                TenBangTacDong = TableNameDTO.DonDatTour,
                MaDoiTuong = maDonDatTour,
                GiaTriTruoc = new { TrangThaiDon = oldStatus },
                GiaTriSau = new
                {
                    TrangThaiDon = order.TrangThaiDon,
                    MaNhanVienDuyet = order.MaNhanVienDuyet,
                    NgayDuyet = order.NgayDuyet
                }
            });

            return true;
        }

        public async Task<bool> CancelOrderAsync(int maDonDatTour, string lyDoHuy, int? maNguoiYeuCau = null, bool isAdmin = false)
        {
            if (string.IsNullOrWhiteSpace(lyDoHuy))
                throw new InvalidOperationException("Vui lòng nhập lý do hủy đơn.");

            var order = await _context.DonDatTours
                .Include(x => x.NguoiDung)
                .Include(x => x.ChuyenKhoiHanh)
                    .ThenInclude(x => x.Tour)
                .Include(x => x.ThanhToans)
                .FirstOrDefaultAsync(x => x.MaDonDatTour == maDonDatTour);

            if (order == null) return false;

            if (order.TrangThaiDon == DON_HOAN_TAT)
                throw new InvalidOperationException("Không thể hủy đơn đã hoàn tất.");

            if (IsOrderCancelled(order.TrangThaiDon))
                throw new InvalidOperationException("Đơn này đã bị hủy trước đó.");

            var now = DateTime.Now;
            var oldStatusDon = order.TrangThaiDon;
            var oldStatusTaiChinh = order.TrangThaiTaiChinh;
            var successfulPayment = GetSuccessfulPayment(order.ThanhToans);

            // Cập nhật số chỗ
            var soKhach = order.SoNguoiLon + order.SoTreEm + order.SoEmBe;
            order.ChuyenKhoiHanh.SoChoDaDat -= soKhach;

            order.LyDoHuy = lyDoHuy.Trim();
            order.NgayHuy = now;
            order.NgayCapNhat = now;
            order.NgayXuLyHuy = now;
            order.TrangThaiDon = DON_DA_HUY;

            // Xử lý tài chính khi hủy
            if (successfulPayment != null && successfulPayment.TongTienThanhToan > 0)
            {
                var policy = RefundPolicyEngine.CalculateRefundPolicy(
                    order.ChuyenKhoiHanh.NgayKhoiHanh,
                    now
                );

                var refundAmount = Math.Round(successfulPayment.TongTienThanhToan * policy.RefundRate, 0);
                var lostAmount = successfulPayment.TongTienThanhToan - refundAmount;

                if (refundAmount > 0)
                {
                    order.TrangThaiTaiChinh = TC_DANG_HOAN_TIEN;

                    var refundPayment = new ThanhToan
                    {
                        MaDonDatTour = order.MaDonDatTour,
                        PhuongThucThanhToan = successfulPayment.PhuongThucThanhToan,
                        TongTienThanhToan = successfulPayment.TongTienThanhToan,
                        SoTienHoan = refundAmount,
                        NgayThanhToan = now,
                        TrangThaiThanhToan = TT_CHO_XU_LY,
                        LoaiThanhToan = LOAI_HOAN_TIEN,
                        NoiDung = $"Hoàn tiền hủy đơn {order.MaDatCho} - {policy.Policy}",
                        LyDoHoanTien = lyDoHuy,
                        NgayXacNhan = null
                    };
                    _context.ThanhToans.Add(refundPayment);
                }
                else
                {
                    order.TrangThaiTaiChinh = TC_MAT_COC;
                }
            }
            else
            {
                order.TrangThaiTaiChinh = TC_CHUA_THANH_TOAN;
            }

            order.AppendStatusHistory(oldStatusDon, order.TrangThaiDon, "Hủy đơn", $"Lý do: {lyDoHuy}");

            await _context.SaveChangesAsync();

            // Gửi thông báo và email
            if (order.TrangThaiTaiChinh == TC_DANG_HOAN_TIEN)
            {
                var refund = GetRefundPayment(order.ThanhToans);
                await _emailService.SendRefundProcessingAsync(order, refund);
            }
            else
            {
                await _emailService.SendCancelNoRefundAsync(order);
            }

            await _notificationService.CreateForUserAsync(
                order.MaNguoiDung,
                new CreateNotificationDTO
                {
                    TieuDe = "Đơn đặt tour đã bị hủy",
                    NoiDung = $"Đơn {order.MaDatCho} đã bị hủy. Lý do: {lyDoHuy}. {(order.TrangThaiTaiChinh == TC_DANG_HOAN_TIEN ? "Số tiền đang xử lý hoàn" : "Không được hoàn tiền")}.",
                    LoaiThongBao = (int)NotificationType.Booking,
                    LinkChiTiet = $"/Thong-Tin-Ca-Nhan"
                });

            await _logService.LoggingAsync(new LogDTO
            {
                LoaiTaiKhoan = _currentUserService.GetUserId() == 1 ? AccountTypeDTO.QuanTriVien : AccountTypeDTO.NhanVien,
                Email = _currentUserService.GetEmail(),
                MaTaiKhoan = _currentUserService.GetUserId(),
                TenHanhDong = ActionLogDTO.CapNhat,
                TenBangTacDong = TableNameDTO.DonDatTour,
                MaDoiTuong = maDonDatTour,
                GiaTriTruoc = new
                {
                    TrangThaiDon = oldStatusDon,
                    TrangThaiTaiChinh = oldStatusTaiChinh
                },
                GiaTriSau = new
                {
                    TrangThaiDon = order.TrangThaiDon,
                    TrangThaiTaiChinh = order.TrangThaiTaiChinh,
                    LyDoHuy = lyDoHuy
                }
            });

            await _dashboardNotifier.NotifyDashboardChangedAsync("OrderStatusChanged", new
            {
                order.MaDonDatTour,
                TrangThaiMoi = order.TrangThaiDon
            });

            return true;
        }

        public async Task<bool> CompleteOrderAsync(int maDonDatTour)
        {
            var order = await _context.DonDatTours
                .Include(x => x.NguoiDung)
                .Include(x => x.ChuyenKhoiHanh)
                    .ThenInclude(x => x.Tour)
                .Include(x => x.ThanhToans)
                .FirstOrDefaultAsync(x => x.MaDonDatTour == maDonDatTour);

            if (order == null) return false;

            if (order.TrangThaiDon != DON_DA_DUYET && order.TrangThaiDon != DON_DANG_DIEN_RA)
                throw new InvalidOperationException("Chỉ có thể hoàn tất những đơn hàng ở trạng thái Đã duyệt hoặc Đang diễn ra.");

            var paymentStatus = GetLatestPaymentStatus(order.ThanhToans);
            if (paymentStatus != TT_THANH_CONG)
                throw new InvalidOperationException("Đơn hàng chưa thanh toán thành công, không thể hoàn tất.");

            if (order.ChuyenKhoiHanh?.NgayKetThuc > DateTime.Now)
                throw new InvalidOperationException($"Tour chưa kết thúc (Ngày kết thúc: {order.ChuyenKhoiHanh.NgayKetThuc:dd/MM/yyyy}).");

            var oldStatus = order.TrangThaiDon;

            order.TrangThaiDon = DON_HOAN_TAT;
            order.NgayCapNhat = DateTime.Now;

            order.AppendStatusHistory(oldStatus, order.TrangThaiDon, "Hoàn tất", "Tour đã kết thúc");

            await _context.SaveChangesAsync();

            await _notificationService.CreateForUserAsync(
                order.MaNguoiDung,
                new CreateNotificationDTO
                {
                    TieuDe = "Chuyến đi đã hoàn tất",
                    NoiDung = $"Cảm ơn bạn đã đồng hành cùng chúng tôi. Đơn {order.MaDatCho} đã hoàn tất.",
                    LoaiThongBao = (int)NotificationType.Booking,
                    LinkChiTiet = $"/Thong-Tin-Ca-Nhan"
                });

            await _logService.LoggingAsync(new LogDTO
            {
                LoaiTaiKhoan = _currentUserService.GetUserId() == 1 ? AccountTypeDTO.QuanTriVien : AccountTypeDTO.NhanVien,
                Email = _currentUserService.GetEmail(),
                MaTaiKhoan = _currentUserService.GetUserId(),
                TenHanhDong = ActionLogDTO.CapNhat,
                TenBangTacDong = TableNameDTO.DonDatTour,
                MaDoiTuong = maDonDatTour,
                GiaTriTruoc = new { TrangThaiDon = oldStatus },
                GiaTriSau = new { TrangThaiDon = order.TrangThaiDon }
            });

            await _dashboardNotifier.NotifyDashboardChangedAsync("OrderStatusChanged", new
            {
                order.MaDonDatTour,
                TrangThaiMoi = order.TrangThaiDon
            });

            return true;
        }

        #endregion

        #region CLIENT APIs

        public async Task<ReserveSeatsResultDTO> ReserveSeatsAsync(int maNguoiDung, ReserveSeatsDTO dto)
        {
            var tongCho = dto.SoNguoiLon + dto.SoTreEm + dto.SoEmBe;
            if (tongCho <= 0)
                throw new InvalidOperationException("Số chỗ phải lớn hơn 0");

            var existingReservations = await _context.GiuChos
                .Where(x => x.MaChuyen == dto.MaChuyen && x.MaNguoiDung == maNguoiDung)
                .ToListAsync();

            _context.GiuChos.RemoveRange(existingReservations);

            var chuyen = await _context.ChuyenKhoiHanhs
                .FirstOrDefaultAsync(x => x.MaChuyen == dto.MaChuyen)
                ?? throw new KeyNotFoundException("Chuyến không tồn tại");

            if (chuyen.TrangThai != 1)
                throw new InvalidOperationException("Chuyến không còn mở bán");

            var currentReserved = await _context.GiuChos
                .Where(x => x.MaChuyen == dto.MaChuyen
                         && x.MaNguoiDung != maNguoiDung
                         && x.ThoiGianHetHan > DateTime.Now)
                .SumAsync(x => (int?)x.SoChoGiu) ?? 0;

            var daDat = await _context.DonDatTours
                .Where(x => x.MaChuyen == dto.MaChuyen && x.TrangThaiDon != DON_DA_HUY)
                .SumAsync(x => x.SoNguoiLon + x.SoTreEm + x.SoEmBe);

            var conLai = chuyen.SoChoToiDa - daDat - currentReserved;
            if (conLai < tongCho)
                throw new InvalidOperationException($"Không đủ chỗ. Hiện còn: {conLai} chỗ");

            var reservation = new GiuCho
            {
                MaChuyen = dto.MaChuyen,
                MaNguoiDung = maNguoiDung,
                SoChoGiu = tongCho,
                ThoiGianHetHan = DateTime.Now.AddMinutes(15),
                NgayTao = DateTime.Now
            };

            _context.GiuChos.Add(reservation);
            await _context.SaveChangesAsync();

            return new ReserveSeatsResultDTO
            {
                MaGiuCho = reservation.MaGiuCho,
                ThoiGianHetHan = reservation.ThoiGianHetHan,
                SoChoConLai = conLai - tongCho
            };
        }

        public async Task ReleaseReservationAsync(int maGiuCho, int maNguoiDung)
        {
            var reservation = await _context.GiuChos
                .FirstOrDefaultAsync(x => x.MaGiuCho == maGiuCho && x.MaNguoiDung == maNguoiDung);

            if (reservation != null)
            {
                _context.GiuChos.Remove(reservation);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<int> CreateBookingByClientAsync(int maNguoiDung, CreateBookingClientDTO dto, int? maGiuCho)
        {
            const int maxRetry = 3;

            for (int attempt = 1; attempt <= maxRetry; attempt++)
            {
                using var transaction = await _context.Database.BeginTransactionAsync();
                try
                {
                    var chuyen = await _context.ChuyenKhoiHanhs
                        .Include(x => x.Tour)
                            .ThenInclude(x => x.HinhAnhTours)
                        .Include(x => x.GiaChuyens)
                        .FirstOrDefaultAsync(x => x.MaChuyen == dto.MaChuyen)
                        ?? throw new KeyNotFoundException($"Không tìm thấy chuyến với MaChuyen = {dto.MaChuyen}");

                    if (chuyen.TrangThai != 1)
                        throw new InvalidOperationException($"Chuyến không còn mở bán. Trạng thái: {chuyen.TrangThai}");

                    var tongKhach = dto.SoNguoiLon + dto.SoTreEm + dto.SoEmBe;
                    if (tongKhach <= 0)
                        throw new InvalidOperationException("Số khách phải lớn hơn 0");

                    GiuCho? reservation = null;
                    if (maGiuCho.HasValue)
                    {
                        reservation = await _context.GiuChos
                            .FirstOrDefaultAsync(x => x.MaGiuCho == maGiuCho.Value && x.MaNguoiDung == maNguoiDung);

                        if (reservation == null)
                            throw new InvalidOperationException($"Không tìm thấy giữ chỗ với MaGiuCho = {maGiuCho.Value}");

                        if (reservation.ThoiGianHetHan <= DateTime.Now)
                            throw new InvalidOperationException($"Phiên giữ chỗ đã hết hạn lúc {reservation.ThoiGianHetHan:HH:mm:ss}");

                        if (reservation.SoChoGiu < tongKhach)
                            throw new InvalidOperationException($"Số chỗ giữ ({reservation.SoChoGiu}) không đủ cho {tongKhach} khách");
                    }
                    else
                    {
                        var reservedByOthers = await _context.GiuChos
                            .Where(x => x.MaChuyen == dto.MaChuyen
                                     && x.MaNguoiDung != maNguoiDung
                                     && x.ThoiGianHetHan > DateTime.Now)
                            .SumAsync(x => (int?)x.SoChoGiu) ?? 0;

                        var daDat = await _context.DonDatTours
                            .Where(x => x.MaChuyen == dto.MaChuyen && x.TrangThaiDon != DON_DA_HUY)
                            .SumAsync(x => x.SoNguoiLon + x.SoTreEm + x.SoEmBe);

                        var conLai = chuyen.SoChoToiDa - daDat - reservedByOthers;
                        if (conLai < tongKhach)
                            throw new InvalidOperationException($"Không đủ chỗ. Còn lại: {conLai} chỗ, cần: {tongKhach} chỗ");
                    }

                    var gia = chuyen.GiaChuyens.FirstOrDefault()
                        ?? throw new InvalidOperationException($"Chuyến {dto.MaChuyen} chưa có bảng giá");

                    UuDai? uuDai = null;
                    decimal discountAmount = 0;

                    if (dto.MaUuDai.HasValue)
                    {
                        uuDai = await _context.UuDais
                            .FirstOrDefaultAsync(x => x.MaUuDai == dto.MaUuDai.Value
                                                   && x.TrangThai == 1
                                                   && x.NgayBatDau <= DateTime.Now
                                                   && x.NgayHetHan >= DateTime.Now
                                                   && x.SoLuongDaDung < x.SoLuongToiDa);

                        if (uuDai == null)
                            throw new InvalidOperationException($"Mã ưu đãi {dto.MaUuDai.Value} không hợp lệ hoặc đã hết hạn");

                        var tongTienGocCheck = dto.SoNguoiLon * gia.GiaNguoiLon +
                                              dto.SoTreEm * gia.GiaTreEm +
                                              dto.SoEmBe * gia.GiaEmBe;

                        if (tongTienGocCheck < uuDai.DieuKienApDung)
                            throw new InvalidOperationException($"Tổng tiền ({tongTienGocCheck}) không đạt điều kiện áp dụng ưu đãi ({uuDai.DieuKienApDung})");
                    }

                    var soPhongDon = dto.DanhSachHanhKhach?.Count(k => k.PhongDon && k.LoaiKhach == 1) ?? 0;
                    var tongTienGoc = dto.SoNguoiLon * gia.GiaNguoiLon +
                                      dto.SoTreEm * gia.GiaTreEm +
                                      dto.SoEmBe * gia.GiaEmBe;
                    var phuThuPhongDon = soPhongDon * gia.PhuThuPhongDon;

                    if (uuDai != null && tongTienGoc >= uuDai.DieuKienApDung)
                        discountAmount = Math.Round(tongTienGoc * uuDai.PhanTramGiam / 100, 0);

                    var tongTien = tongTienGoc + phuThuPhongDon - discountAmount;
                    var maDatCho = $"BK{DateTime.Now:yyyyMMddHHmmssfff}{Random.Shared.Next(100, 999)}";

                    var order = new DonDatTour
                    {
                        MaNguoiDung = maNguoiDung,
                        MaChuyen = dto.MaChuyen,
                        MaDatCho = maDatCho,
                        MaUuDai = dto.MaUuDai,
                        SoNguoiLon = dto.SoNguoiLon,
                        SoTreEm = dto.SoTreEm,
                        SoEmBe = dto.SoEmBe,
                        SoPhongDon = soPhongDon,
                        GhiChu = dto.GhiChu ?? "",
                        GiaNguoiLonTaiDat = gia.GiaNguoiLon,
                        GiaTreEmTaiDat = gia.GiaTreEm,
                        GiaEmBeTaiDat = gia.GiaEmBe,
                        PhuThuPhongDonTaiDat = gia.PhuThuPhongDon,
                        GiaTriGiamTaiDat = discountAmount,
                        TongTien = tongTien,
                        TienCoc = 0,
                        SoTienDaThanhToan = 0,
                        TrangThaiTaiChinh = TC_CHUA_THANH_TOAN,
                        TrangThaiDon = DON_CHO_THANH_TOAN,
                        NgayDat = DateTime.Now,
                        NgayCapNhat = DateTime.Now,
                        MaNhanVienDuyet = null,
                        NgayDuyet = null,
                        LichSuTrangThai = $"[{{\"OldStatus\":0,\"NewStatus\":{DON_CHO_THANH_TOAN},\"Action\":\"Tạo đơn bởi User\",\"Timestamp\":\"{DateTime.Now:yyyy-MM-ddTHH:mm:ss}\",\"UserId\":\"{maNguoiDung}\"}}]"
                    };

                    _context.DonDatTours.Add(order);
                    await _context.SaveChangesAsync();

                    _context.ThanhToans.Add(new ThanhToan
                    {
                        MaDonDatTour = order.MaDonDatTour,
                        PhuongThucThanhToan = dto.PhuongThucThanhToan ?? 0,
                        NgayThanhToan = DateTime.Now,
                        TongTienThanhToan = tongTien,
                        NoiDung = dto.PhuongThucThanhToan == PTTT_VNPAY
                            ? $"Chờ thanh toán VNPay cho đơn {maDatCho}"
                            : $"Chờ thanh toán tại quầy/chuyển khoản cho đơn {maDatCho}",
                        TrangThaiThanhToan = TT_CHO_XU_LY,
                        LoaiThanhToan = LOAI_THANH_TOAN_TOAN_BO,
                    });

                    if (dto.DanhSachHanhKhach != null && dto.DanhSachHanhKhach.Any())
                    {
                        var khachHangs = dto.DanhSachHanhKhach.Select(k => new KhachHang
                        {
                            MaDonDatTour = order.MaDonDatTour,
                            HoTen = k.HoTen ?? string.Empty,
                            SoDienThoai = k.SoDienThoai,
                            Email = k.Email,
                            NgaySinh = k.NgaySinh,
                            GioiTinh = k.GioiTinh,
                            LoaiKhach = k.LoaiKhach,
                            PhongDon = k.PhongDon,
                        }).ToList();

                        _context.KhachHangs.AddRange(khachHangs);
                    }

                    chuyen.SoChoDaDat += tongKhach;
                    chuyen.NgayCapNhat = DateTime.Now;

                    if (uuDai != null)
                        uuDai.SoLuongDaDung++;

                    if (reservation != null)
                        _context.GiuChos.Remove(reservation);

                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();

                    await NotifyBookingCreated(order, "");

                    return order.MaDonDatTour;
                }
                catch (DbUpdateConcurrencyException) when (attempt < maxRetry)
                {
                    await transaction.RollbackAsync();
                    foreach (var entry in _context.ChangeTracker.Entries())
                        entry.State = EntityState.Detached;
                    await Task.Delay(100 * attempt);
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    Console.WriteLine($"=== CREATE BOOKING ERROR ===");
                    Console.WriteLine($"Message: {ex.Message}");
                    Console.WriteLine($"StackTrace: {ex.StackTrace}");
                    if (ex.InnerException != null)
                    {
                        Console.WriteLine($"InnerException: {ex.InnerException.Message}");
                        Console.WriteLine($"Inner StackTrace: {ex.InnerException.StackTrace}");
                    }
                    Console.WriteLine($"DTO: MaChuyen={dto.MaChuyen}, SoNguoiLon={dto.SoNguoiLon}, SoTreEm={dto.SoTreEm}, SoEmBe={dto.SoEmBe}");
                    Console.WriteLine($"HoldId: {maGiuCho}");
                    Console.WriteLine($"==========================");
                    throw;
                }
            }

            throw new InvalidOperationException("Hệ thống đang bận, vui lòng thử lại.");
        }

        public async Task<List<UserBookingListDTO>> GetUserBookingsAsync(int maNguoiDung)
        {
            var bookings = await _context.DonDatTours
                .AsNoTracking()
                .Where(x => x.MaNguoiDung == maNguoiDung)
                .Include(x => x.ChuyenKhoiHanh)
                    .ThenInclude(x => x.Tour)
                    .ThenInclude(x => x.HinhAnhTours)
                .Include(x => x.ThanhToans)
                .OrderByDescending(x => x.NgayDat)
                .ToListAsync();

            return bookings.Select(x => new UserBookingListDTO
            {
                MaDonDatTour = x.MaDonDatTour,
                MaDatCho = x.MaDatCho,
                TenTour = x.ChuyenKhoiHanh.Tour.TenTour,
                HinhAnh = x.ChuyenKhoiHanh.Tour.HinhAnhTours
                                .OrderBy(h => h.SoThuTu)
                                .Select(h => h.DuongDanAnh)
                                .FirstOrDefault(),
                NgayKhoiHanh = x.ChuyenKhoiHanh.NgayKhoiHanh,
                NgayKetThuc = x.ChuyenKhoiHanh.NgayKetThuc,
                DiemKhoiHanh = x.ChuyenKhoiHanh.DiemKhoiHanh,
                DiemDen = x.ChuyenKhoiHanh.DiemDen,
                SoNguoiLon = x.SoNguoiLon,
                SoTreEm = x.SoTreEm,
                SoEmBe = x.SoEmBe,
                TongTien = x.TongTien,
                TrangThaiDon = x.TrangThaiDon,
                TenTrangThaiDon = GetOrderStatusName(x.TrangThaiDon),
                NgayDat = x.NgayDat,
                TrangThaiThanhToan = GetLatestPaymentStatus(x.ThanhToans),
                TenTrangThaiThanhToan = GetPaymentStatusName(GetLatestPaymentStatus(x.ThanhToans)),
            }).ToList();
        }

        public async Task<TourBookingDetailDTO?> GetUserBookingDetailAsync(int maDonDatTour, int maNguoiDung)
        {
            var exists = await _context.DonDatTours
                .AsNoTracking()
                .AnyAsync(x => x.MaDonDatTour == maDonDatTour && x.MaNguoiDung == maNguoiDung);

            return exists ? await GetDetailAsync(maDonDatTour) : null;
        }

        #endregion

        #region COMMON APIs

        public async Task<bool> UpdatePassengerAsync(int maKhachHang, UpdatePassengerDTO dto)
        {
            var passenger = await _context.KhachHangs
                .Include(x => x.DonDatTour)
                    .ThenInclude(x => x.ChuyenKhoiHanh)
                .FirstOrDefaultAsync(x => x.MaKhachHang == maKhachHang);

            if (passenger == null) return false;

            if (passenger.DonDatTour.TrangThaiDon >= DON_HOAN_TAT || IsOrderCancelled(passenger.DonDatTour.TrangThaiDon))
                throw new InvalidOperationException("Không thể chỉnh sửa hành khách của đơn đã hoàn tất hoặc đã hủy.");

            var departureDate = passenger.DonDatTour.ChuyenKhoiHanh?.NgayKhoiHanh;
            if (departureDate.HasValue)
            {
                var hoursBeforeDeparture = (departureDate.Value - DateTime.Now).TotalHours;
                if (hoursBeforeDeparture < 24 && hoursBeforeDeparture > 0)
                    throw new InvalidOperationException("Không thể chỉnh sửa hành khách trong vòng 24h trước khởi hành.");
            }

            var oldValue = new
            {
                passenger.HoTen,
                passenger.SoDienThoai,
                passenger.Email,
                passenger.NgaySinh,
                passenger.GioiTinh,
                passenger.LoaiKhach,
                passenger.PhongDon
            };

            passenger.HoTen = dto.HoTen;
            passenger.SoDienThoai = dto.SoDienThoai;
            passenger.NgaySinh = dto.NgaySinh;
            passenger.GioiTinh = dto.GioiTinh;
            passenger.LoaiKhach = dto.LoaiKhach;
            passenger.PhongDon = dto.PhongDon;

            passenger.DonDatTour.NgayCapNhat = DateTime.Now;

            await _context.SaveChangesAsync();

            await _logService.LoggingAsync(new LogDTO
            {
                LoaiTaiKhoan = _currentUserService.GetUserId() == 1 ? AccountTypeDTO.QuanTriVien : AccountTypeDTO.NhanVien,
                Email = _currentUserService.GetEmail(),
                MaTaiKhoan = _currentUserService.GetUserId(),
                TenHanhDong = ActionLogDTO.CapNhat,
                TenBangTacDong = TableNameDTO.DonDatTour,
                MaDoiTuong = maKhachHang,
                GiaTriTruoc = oldValue,
                GiaTriSau = new
                {
                    dto.HoTen,
                    dto.SoDienThoai,
                    dto.NgaySinh,
                    dto.GioiTinh,
                    dto.LoaiKhach,
                    dto.PhongDon
                }
            });

            return true;
        }

        #endregion

        #region Notification Helpers

        private async Task NotifyBookingCreated(DonDatTour order, string tenKhachHang)
        {
            try
            {
                // Gửi email xác nhận cho user
                await _emailService.SendBookingConfirmationAsync(order);

                // 1. THÔNG BÁO CHO USER - NỘI DUNG KHÁC
                await _notificationService.CreateForUserAsync(
                    order.MaNguoiDung,
                    new CreateNotificationDTO
                    {
                        TieuDe = "Đặt tour thành công",  // ← SỬA: Khác với staff
                        NoiDung = $"Đơn đặt tour {order.MaDatCho} của bạn đã được tạo thành công.",  // ← SỬA: Khác với staff
                        LoaiThongBao = (int)NotificationType.Booking,
                        LinkChiTiet = $"/Thong-Tin-Ca-Nhan"
                    });

                // 2. THÔNG BÁO CHO STAFF - NỘI DUNG KHÁC
                var staffIds = await _context.NhanViens
                    .Where(x => x.NgayXoa == null &&
                               (x.MaVaiTro == RoleIds.Admin ||
                                x.MaVaiTro == RoleIds.Staff))
                    .Select(x => x.MaNhanVien)
                    .ToListAsync();

                if (staffIds.Any())
                {
                    await _notificationService.CreateForStaffsAsync(
                        staffIds,
                        new CreateNotificationDTO
                        {
                            TieuDe = "Có đơn đặt tour mới",  // ← GIỮ NGUYÊN
                            NoiDung = $"Khách hàng {(string.IsNullOrEmpty(tenKhachHang) ? "" : tenKhachHang + " ")}vừa đặt đơn {order.MaDatCho}.",  // ← GIỮ NGUYÊN
                            LoaiThongBao = (int)NotificationType.Booking,
                            LinkChiTiet = $"/Quan-ly/Don-dat-cac-chuyen-di"
                        });
                }

                // SignalR
                await _hubContext.Clients.All.SendAsync("BookingCreated", new
                {
                    order.MaDonDatTour,
                    order.MaDatCho,
                    order.TongTien,
                    order.NgayDat,
                    order.MaNguoiDung
                });

                await _dashboardNotifier.NotifyDashboardChangedAsync("NewBooking", new
                {
                    order.MaDonDatTour,
                    order.NgayDat,
                    order.TrangThaiDon
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[NotifyBookingCreated] Error: {ex.Message}");
            }
        }

        private async Task NotifyOrderStatusChanged(DonDatTour order)
        {
            try
            {
                var (title, content) = order.TrangThaiDon switch
                {
                    DON_DA_DUYET => ("Đơn đặt tour đã được xác nhận", $"Đơn {order.MaDatCho} đã được xác nhận."),
                    DON_DANG_DIEN_RA => ("Chuyến đi đang diễn ra", $"Chuyến đi {order.MaDatCho} đang diễn ra."),
                    DON_HOAN_TAT => ("Chuyến đi đã hoàn tất", $"Đơn {order.MaDatCho} đã hoàn tất. Cảm ơn bạn đã đồng hành cùng chúng tôi."),
                    _ => (null, null)
                };

                if (title != null)
                {
                    await _notificationService.CreateForUserAsync(
                        order.MaNguoiDung,
                        new CreateNotificationDTO
                        {
                            TieuDe = title,
                            NoiDung = content ?? "",
                            LoaiThongBao = (int)NotificationType.Booking,
                            LinkChiTiet = $"/Thong-Tin-Ca-Nhan"
                        });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[NotifyOrderStatusChanged] Error: {ex.Message}");
            }
        }

        #endregion

        #region PRINT CONTRACT

        private static string BuildFileName(ChuyenInfoDTO chuyen, int tongSoKhach)
        {
            var ngay = chuyen.NgayKhoiHanh.ToString("ddMMyyyy");
            var maChuyen = chuyen.MaChuyenCode.Replace(" ", "").Replace("/", "-");
            return $"{maChuyen}_{ngay}_{tongSoKhach}_khach.pdf";
        }

        public async Task<List<(byte[] Pdf, string FileName)>> GenerateContractsPdfWithNameAsync(List<int> maDonDatTours)
        {
            var details = new List<TourBookingDetailDTO>();

            foreach (var id in maDonDatTours)
            {
                var detail = await GetDetailAsync(id);
                if (detail == null) continue;

                if (detail.TrangThaiDon < DON_DA_DUYET || IsOrderCancelled(detail.TrangThaiDon))
                    throw new InvalidOperationException($"Đơn {detail.MaDatCho} chưa được duyệt hoặc đã hủy, không thể in hợp đồng.");

                details.Add(detail);
            }

            if (!details.Any())
                throw new InvalidOperationException("Không có đơn hợp lệ để in.");

            var groupedByChuyen = details.GroupBy(d => d.Chuyen.MaChuyen);
            var result = new List<(byte[] Pdf, string FileName)>();

            foreach (var group in groupedByChuyen)
            {
                var groupDetails = group.ToList();
                var pdf = ContractPdfBuilder.GenerateContractsPdf(groupDetails);
                var tongKhach = groupDetails.Sum(d => d.SoNguoiLon + d.SoTreEm + d.SoEmBe);
                var fileName = BuildFileName(groupDetails[0].Chuyen, tongKhach);
                result.Add((pdf, fileName));
            }

            return result;
        }

        public async Task<List<(byte[] Pdf, string FileName)>> GenerateContractsPdfByChuyenWithNameAsync(int maChuyen)
        {
            var ids = await _context.DonDatTours
                .Where(x => x.MaChuyen == maChuyen && x.TrangThaiDon >= DON_DA_DUYET && !IsOrderCancelled(x.TrangThaiDon))
                .Select(x => x.MaDonDatTour)
                .ToListAsync();

            if (!ids.Any())
                throw new InvalidOperationException("Chuyến này chưa có đơn nào được duyệt.");

            return await GenerateContractsPdfWithNameAsync(ids);
        }

        #endregion
    }
}