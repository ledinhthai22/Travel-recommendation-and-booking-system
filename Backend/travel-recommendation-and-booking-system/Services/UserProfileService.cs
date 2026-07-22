using DTOs.Page;
using Microsoft.EntityFrameworkCore;
using travel_recommendation_and_booking_system.Constants;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.DTOs.Log;
using travel_recommendation_and_booking_system.DTOs.LogSystem;
using travel_recommendation_and_booking_system.DTOs.TourBooking;
using travel_recommendation_and_booking_system.DTOs.UserProfile;
using travel_recommendation_and_booking_system.Helpers;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Models;

namespace travel_recommendation_and_booking_system.Services
{
    public class UserProfileService : IUserProfileService
    {
        private readonly AppDbContext _context;
        private readonly ILogService _logService;
        private readonly ICurrentUserService _currentUserService;
        private readonly IEmailService _emailService;
        private readonly IRefundService _refundService;

        public UserProfileService(
            AppDbContext context,
            ILogService logService,
            ICurrentUserService currentUserService,
            IEmailService emailService,
            IRefundService refundService)
        {
            _context = context;
            _logService = logService;
            _currentUserService = currentUserService;
            _emailService = emailService;
            _refundService = refundService;
        }

        #region Helper Methods

        private static string GetFinancialStatusName(int status) => BookingConstants.GetFinancialStatusName(status);
        private static string GetPaymentTypeName(int type) => BookingConstants.GetPaymentTypeName(type);
        private static string GetPaymentMethodName(int method) => BookingConstants.GetPaymentMethodName(method);
        private static string GetOrderStatusName(int status) => BookingConstants.GetOrderStatusName(status);
        private static string GetPaymentStatusName(int status) => BookingConstants.GetPaymentStatusName(status);
        private static bool IsOrderCancelled(int status) => BookingConstants.IsOrderCancelled(status);
        private static bool IsOrderCompleted(int status) => BookingConstants.IsOrderCompleted(status);
        private static bool IsOrderActive(int status) => BookingConstants.IsOrderActive(status);

        #endregion

        #region Profile Management

        public async Task<UserProfileReponseDTO?> GetMyProfileAsync(int maNguoiDung)
        {
            var userProfile = await _context.NguoiDungs
                .AsNoTracking()
                .Where(u => u.MaNguoiDung == maNguoiDung && u.NgayXoa == null && u.TrangThai == 1)
                .Select(u => new UserProfileReponseDTO
                {
                    MaNguoiDung = u.MaNguoiDung,
                    HoTen = u.HoTen,
                    Email = u.Email,
                    DuongDanAnh = u.DuongDanAnh,
                    DiaChi = u.DiaChi,
                    NgaySinh = u.NgaySinh,
                    SoDienThoai = u.SoDienThoai,
                    GioiTinh = u.GioiTinh
                })
                .FirstOrDefaultAsync();

            return userProfile;
        }

        public async Task<bool> UpdateMyProfileAsync(int maNguoiDung, UserProfileDTO dto)
        {
            var user = await _context.NguoiDungs
                .FirstOrDefaultAsync(u => u.MaNguoiDung == maNguoiDung && u.NgayXoa == null && u.TrangThai == 1);

            if (user == null)
                throw new Exception("Không tìm thấy thông tin tài khoản.");

            var isEmailExist = await _context.NguoiDungs
                .AsNoTracking()
                .AnyAsync(u => u.Email == dto.Email && u.MaNguoiDung != maNguoiDung && u.NgayXoa == null);
            if (isEmailExist)
                throw new Exception("Email này đã được sử dụng bởi tài khoản khác.");

            if (dto.DuongDanAnh != null)
            {
                const long maxFileSize = 10 * 1024 * 1024;
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
                var extension = Path.GetExtension(dto.DuongDanAnh.FileName).ToLower();

                if (dto.DuongDanAnh.Length > maxFileSize)
                    throw new Exception("Ảnh đại diện không được vượt quá 10MB.");
                if (!allowedExtensions.Contains(extension))
                    throw new Exception("Định dạng ảnh không hợp lệ (chỉ chấp nhận jpg, jpeg, png, gif).");

                var uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/img/user");
                if (!Directory.Exists(uploadFolder))
                    Directory.CreateDirectory(uploadFolder);

                if (!string.IsNullOrEmpty(user.DuongDanAnh))
                {
                    var oldPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", user.DuongDanAnh.TrimStart('/'));
                    if (File.Exists(oldPath))
                    {
                        File.Delete(oldPath);
                    }
                }

                var fileName = $"{DateTime.Now:yyyyMMddHHmmssfff}_{maNguoiDung}{extension}";
                var fullPath = Path.Combine(uploadFolder, fileName);

                using var stream = new FileStream(fullPath, FileMode.Create);
                await dto.DuongDanAnh.CopyToAsync(stream);

                user.DuongDanAnh = $"/img/user/{fileName}";
            }

            user.HoTen = dto.HoTen;
            user.Email = dto.Email;
            user.DiaChi = dto.DiaChi;
            user.NgaySinh = dto.NgaySinh;
            user.SoDienThoai = dto.SoDienThoai;
            user.GioiTinh = dto.GioiTinh;
            user.NgayCapNhat = DateTime.Now;

            await _context.SaveChangesAsync();

            await _logService.LoggingAsync(new LogDTO
            {
                LoaiTaiKhoan = AccountTypeDTO.NguoiDung,
                Email = _currentUserService.GetEmail(),
                MaTaiKhoan = _currentUserService.GetUserId(),
                TenHanhDong = ActionLogDTO.CapNhat,
                TenBangTacDong = TableNameDTO.NguoiDung,
                MaDoiTuong = user.MaNguoiDung,
                GiaTriSau = new
                {
                    user.HoTen,
                    user.Email,
                    user.DiaChi,
                    user.NgaySinh,
                    user.SoDienThoai,
                    user.GioiTinh,
                    user.DuongDanAnh
                }
            });

            return true;
        }

        public async Task<bool> ChangePasswordAsync(int userId, string oldPassword, string newPassword)
        {
            var user = await _context.NguoiDungs.FindAsync(userId);
            if (user == null) return false;

            bool isOldPasswordValid = BCrypt.Net.BCrypt.Verify(oldPassword, user.MatKhau);
            if (!isOldPasswordValid) return false;

            user.MatKhau = BCrypt.Net.BCrypt.HashPassword(newPassword);
            user.NgayCapNhat = DateTime.Now;

            await _context.SaveChangesAsync();

            return true;
        }

        #endregion

        #region Account Overview

        public async Task<AccountOverviewDTO> GetAccountOverviewAsync(int userId, int? year = null)
        {
            var queryDonDat = _context.DonDatTours
                .AsNoTracking()
                .Where(d => d.MaNguoiDung == userId);

            if (year.HasValue)
            {
                var startDate = new DateTime(year.Value, 1, 1);
                var endDate = startDate.AddYears(1);
                queryDonDat = queryDonDat.Where(d => d.NgayDat >= startDate && d.NgayDat < endDate);
            }

            var tongTour = await queryDonDat.CountAsync();

            var tongDanhGia = await _context.DanhGias
                .AsNoTracking()
                .CountAsync(d => d.MaNguoiDung == userId && d.NgayXoa == null && d.TrangThai == true);

            var tongTienQuery = _context.ThanhToans
                .AsNoTracking()
                .Where(t => t.DonDatTour.MaNguoiDung == userId
                            && t.TrangThaiThanhToan == BookingConstants.TT_THANH_CONG
                            && t.LoaiThanhToan != BookingConstants.LOAI_HOAN_TIEN);

            if (year.HasValue)
            {
                var startDate = new DateTime(year.Value, 1, 1);
                var endDate = startDate.AddYears(1);
                tongTienQuery = tongTienQuery.Where(t => t.NgayThanhToan >= startDate && t.NgayThanhToan < endDate);
            }

            var tongTien = await tongTienQuery
                .SumAsync(t => (decimal?)t.TongTienThanhToan) ?? 0m;

            var rawRows = await queryDonDat
                .OrderByDescending(d => d.NgayDat)
                .Take(5)
                .Select(d => new
                {
                    d.MaDonDatTour,
                    d.MaDatCho,
                    DuongDanAnh = d.ChuyenKhoiHanh != null && d.ChuyenKhoiHanh.Tour != null
                        ? d.ChuyenKhoiHanh.Tour.HinhAnhTours
                            .OrderByDescending(a => a.AnhChinh)
                            .Select(a => a.DuongDanAnh)
                            .FirstOrDefault() ?? ""
                        : "",
                    TenTour = d.ChuyenKhoiHanh != null && d.ChuyenKhoiHanh.Tour != null
                        ? d.ChuyenKhoiHanh.Tour.TenTour
                        : "",
                    NgayKhoiHanh = d.ChuyenKhoiHanh != null
                        ? d.ChuyenKhoiHanh.NgayKhoiHanh
                        : DateTime.MinValue,
                    NgayKetThuc = d.ChuyenKhoiHanh != null
                        ? d.ChuyenKhoiHanh.NgayKetThuc
                        : DateTime.MinValue,
                    DiemDen = d.ChuyenKhoiHanh != null
                        ? d.ChuyenKhoiHanh.DiemDen
                        : "",
                    d.TrangThaiDon,
                    d.TrangThaiTaiChinh,
                    d.TienCoc,
                    d.TongTien,
                    d.SoTienDaThanhToan,
                    LatestPaymentStatus = d.ThanhToans
                        .OrderByDescending(p => p.NgayThanhToan)
                        .Select(p => (int?)p.TrangThaiThanhToan)
                        .FirstOrDefault()
                })
                .ToListAsync();

            var recentTours = rawRows.Select(r => new RecentTourDTO
            {
                MaDonDatTour = r.MaDonDatTour,
                MaDatCho = r.MaDatCho ?? "",
                DuongDanAnh = r.DuongDanAnh ?? "",
                TenTour = r.TenTour ?? "",
                NgayBatDau = r.NgayKhoiHanh != DateTime.MinValue
                    ? r.NgayKhoiHanh.ToString("dd/MM/yyyy")
                    : "",
                DiaDiem = r.DiemDen ?? "",
                TrangThai = r.TrangThaiDon,
                TongTien = r.TongTien,
                TrangThaiTaiChinh = r.TrangThaiTaiChinh,
                TrangThaiThanhToan = r.LatestPaymentStatus ?? 0,
                TenTrangThaiTaiChinh = GetFinancialStatusName(r.TrangThaiTaiChinh),
                NgayKetThuc = r.NgayKetThuc != DateTime.MinValue
                    ? r.NgayKetThuc.ToString("dd/MM/yyyy")
                    : "",
                SoTienDaThanhToan = r.SoTienDaThanhToan
            }).ToList();

            return new AccountOverviewDTO
            {
                TongTour = tongTour,
                TongDanhGia = tongDanhGia,
                TongTien = tongTien,
                Tours = recentTours
            };
        }

        #endregion

        #region Booking History

        public async Task<PageDTO<HistoryTourDTO>> GetBookingHistoryAsync(int userId, string searchTerm, int page, int pageSize, int? status)
        {
            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 5;

            var query = _context.DonDatTours
                .Include(c => c.ChuyenKhoiHanh).ThenInclude(t => t.Tour)
                .AsNoTracking()
                .Where(d => d.MaNguoiDung == userId)
                .AsQueryable();

            if (!string.IsNullOrEmpty(searchTerm))
            {
                searchTerm = searchTerm.ToLower().Trim();
                query = query.Where(d =>
                    d.ChuyenKhoiHanh.Tour.TenTour.ToLower().Contains(searchTerm) ||
                    d.MaDatCho.ToLower().Contains(searchTerm));
            }

            if (status.HasValue)
            {
                query = query.Where(d => d.TrangThaiDon == status.Value);
            }

            var totalItems = await query.CountAsync();

            var rawRows = await query
                .OrderByDescending(d => d.NgayDat)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(d => new
                {
                    d.MaDonDatTour,
                    d.MaDatCho,
                    d.ChuyenKhoiHanh.Tour.MaTour,
                    DuongDanAnh = d.ChuyenKhoiHanh != null && d.ChuyenKhoiHanh.Tour != null
                        ? d.ChuyenKhoiHanh.Tour.HinhAnhTours
                            .OrderByDescending(a => a.AnhChinh)
                            .Select(a => a.DuongDanAnh)
                            .FirstOrDefault() ?? ""
                        : "",
                    TenTour = d.ChuyenKhoiHanh != null && d.ChuyenKhoiHanh.Tour != null
                        ? d.ChuyenKhoiHanh.Tour.TenTour
                        : "",
                    NgayKhoiHanh = d.ChuyenKhoiHanh != null
                        ? d.ChuyenKhoiHanh.NgayKhoiHanh
                        : DateTime.MinValue,
                    NgayKetThuc = d.ChuyenKhoiHanh != null
                        ? d.ChuyenKhoiHanh.NgayKetThuc
                        : DateTime.MinValue,
                    DiemDen = d.ChuyenKhoiHanh != null
                        ? d.ChuyenKhoiHanh.DiemDen
                        : "",
                    d.TrangThaiDon,
                    d.TrangThaiTaiChinh,
                    d.TienCoc,
                    d.TongTien,
                    d.SoNguoiLon,
                    d.SoTreEm,
                    d.SoEmBe,
                    d.LyDoHuy,
                    d.NgayCapNhat,
                    d.NgayHuy,
                    d.DaDanhGia,
                    LatestPaymentStatus = d.ThanhToans
                        .OrderByDescending(p => p.NgayThanhToan)
                        .Select(p => (int?)p.TrangThaiThanhToan)
                        .FirstOrDefault(),
                    LatestPaymentMethod = d.ThanhToans
                        .OrderByDescending(t => t.NgayThanhToan)
                        .Select(t => (int?)t.PhuongThucThanhToan)
                        .FirstOrDefault()
                })
                .ToListAsync();

            var tours = rawRows.Select(r => new HistoryTourDTO
            {
                MaDonDatTour = r.MaDonDatTour,
                MaDatCho = r.MaDatCho ?? "",
                DuongDanAnh = r.DuongDanAnh ?? "",
                TenTour = r.TenTour ?? "",
                MaTour = r.MaTour,
                NgayBatDau = r.NgayKhoiHanh != DateTime.MinValue
                    ? r.NgayKhoiHanh.ToString("dd/MM/yyyy")
                    : "",
                NgayKetThuc = r.NgayKetThuc != DateTime.MinValue
                    ? r.NgayKetThuc.ToString("dd/MM/yyyy")
                    : "",
                DaDanhGia = r.DaDanhGia,
                DiemDen = r.DiemDen ?? "",
                TongTien = r.TongTien,
                TrangThai = r.TrangThaiDon,
                TrangThaiTaiChinh = r.TrangThaiTaiChinh,
                TrangThaiThanhToan = r.LatestPaymentStatus ?? 0,
                TenTrangThaiTaiChinh = GetFinancialStatusName(r.TrangThaiTaiChinh),
                SoNguoiLon = r.SoNguoiLon,
                SoTreEm = r.SoTreEm,
                SoEmBe = r.SoEmBe,
                PhuongThucThanhToan = r.LatestPaymentMethod.HasValue
                    ? GetPaymentMethodName(r.LatestPaymentMethod.Value)
                    : "Chưa thanh toán",
                LyDoHuy = r.LyDoHuy,
                NgayHuy = IsOrderCancelled(r.TrangThaiDon) ? r.NgayHuy ?? r.NgayCapNhat : null
            }).ToList();

            return new PageDTO<HistoryTourDTO>
            {
                Items = tours,
                PageNumber = page,
                TotalItems = totalItems,
                PageSize = pageSize
            };
        }

        public async Task<HistoryTourDetailDTO?> GetBookingDetailAsync(int userid, int maDonDatTour)
        {
            var data = await _context.DonDatTours
                .AsNoTracking()
                .Include(d => d.ChuyenKhoiHanh)
                    .ThenInclude(c => c.Tour)
                    .ThenInclude(t => t.HinhAnhTours)
                .Include(d => d.ChuyenKhoiHanh)
                    .ThenInclude(c => c.NhanVien)
                .Include(d => d.UuDai)
                .Include(d => d.ThanhToans)
                .Include(d => d.KhachHangs)
                .Where(d => d.MaDonDatTour == maDonDatTour && d.MaNguoiDung == userid)
                .FirstOrDefaultAsync();

            if (data == null) return null;

            var latestPayment = data.ThanhToans?
                .OrderByDescending(p => p.NgayThanhToan)
                .FirstOrDefault();
            var latestPaymentStatus = latestPayment?.TrangThaiThanhToan ?? 0;

            var daDanhGia = await _context.DanhGias
                .AnyAsync(dg => dg.MaNguoiDung == userid
                    && dg.MaTour == data.ChuyenKhoiHanh.MaTour
                    && dg.NgayXoa == null
                    && dg.TrangThai == true);

            return new HistoryTourDetailDTO
            {
                MaTour = data.ChuyenKhoiHanh!.MaTour,
                MaNguoiDung = data.MaNguoiDung,
                MaDonDatTour = data.MaDonDatTour,
                MaDatCho = data.MaDatCho,
                TrangThai = data.TrangThaiDon,
                TenTrangThai = GetOrderStatusName(data.TrangThaiDon),
                NgayDat = data.NgayDat.ToString("dd/MM/yyyy HH:mm"),
                TenTour = data.ChuyenKhoiHanh.Tour.TenTour,
                NgayKhoiHanh = data.ChuyenKhoiHanh.NgayKhoiHanh.ToString("dd/MM/yyyy"),
                NgayKetThuc = data.ChuyenKhoiHanh.NgayKetThuc.ToString("dd/MM/yyyy"),
                DiaDiem = data.ChuyenKhoiHanh.DiemDen,
                SoLuongNguoiLon = data.SoNguoiLon,
                SoLuongTreEm = data.SoTreEm,
                SoLuongEmBe = data.SoEmBe,
                TongTien = data.TongTien,
                TienCoc = data.TienCoc,
                SoTienDaThanhToan = data.SoTienDaThanhToan,
                TrangThaiTaiChinh = data.TrangThaiTaiChinh,
                TenTrangThaiTaiChinh = GetFinancialStatusName(data.TrangThaiTaiChinh),
                TrangThaiThanhToan = latestPaymentStatus,
                TenTrangThaiThanhToan = GetPaymentStatusName(latestPaymentStatus),
                DaDanhGia = daDanhGia,
                LyDoHuy = data.LyDoHuy,
                NgayHuy = IsOrderCancelled(data.TrangThaiDon) ? data.NgayHuy : null,
                GhiChu = data.GhiChu,
                MaChuyen = data.MaChuyen,
                MaChuyenCode = data.ChuyenKhoiHanh.MaChuyenCode,
                DiemKhoiHanh = data.ChuyenKhoiHanh.DiemKhoiHanh,
                PhuongThucThanhToan = data.ThanhToans.FirstOrDefault() != null
                    ? GetPaymentMethodName(data.ThanhToans.First().PhuongThucThanhToan)
                    : "Chưa thanh toán",
                DanhSachHanhKhach = data.KhachHangs.Select(k => new UserKhachHangDTO
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
                LichSuThanhToan = data.ThanhToans
                    .OrderByDescending(t => t.NgayThanhToan)
                    .Select(t => new HistoryThanhToanDTO
                    {
                        MaThanhToan = t.MaThanhToan,
                        PhuongThucThanhToan = GetPaymentMethodName(t.PhuongThucThanhToan),
                        TongTienThanhToan = t.TongTienThanhToan,
                        NgayThanhToan = t.NgayThanhToan.ToString("dd/MM/yyyy HH:mm"),
                        TrangThaiThanhToan = t.TrangThaiThanhToan,
                        TenTrangThaiThanhToan = GetPaymentStatusName(t.TrangThaiThanhToan),
                        LoaiThanhToan = t.LoaiThanhToan,
                        TenLoaiThanhToan = GetPaymentTypeName(t.LoaiThanhToan),
                        SoTienHoan = t.SoTienHoan,
                        MaGiaoDich = t.MaGiaoDich,
                        NoiDung = t.NoiDung
                    }).ToList()
            };
        }

        #endregion

        #region Cancel Booking - User hủy trực tiếp

        public async Task<bool> CancelBookingAsync(int userId, int maDonDatTour, string lyDoHuy)
        {
            if (string.IsNullOrWhiteSpace(lyDoHuy))
                throw new Exception("Vui lòng nhập lý do hủy tour.");

            var booking = await _context.DonDatTours
                .Include(d => d.ChuyenKhoiHanh)
                .Include(d => d.ThanhToans)
                .Include(d => d.NguoiDung)
                .FirstOrDefaultAsync(d => d.MaDonDatTour == maDonDatTour && d.MaNguoiDung == userId);

            if (booking == null)
                throw new Exception("Không tìm thấy đơn đặt tour.");

            if (IsOrderCompleted(booking.TrangThaiDon))
                throw new Exception("Đơn đã hoàn tất, không thể hủy.");

            if (IsOrderCancelled(booking.TrangThaiDon))
                throw new Exception("Đơn đã được xử lý hủy hoặc đã hủy.");

            if (!IsOrderActive(booking.TrangThaiDon))
                throw new Exception("Đơn hàng không thể hủy ở trạng thái hiện tại.");

            if (!BookingConstants.CanUserCancel(booking.TrangThaiDon, booking.ChuyenKhoiHanh.NgayKhoiHanh))
                throw new Exception("Không thể hủy đơn ở trạng thái hiện tại hoặc đã quá hạn hủy.");

            var chuyen = booking.ChuyenKhoiHanh;
            var now = DateTime.Now;

            if (chuyen.NgayKhoiHanh <= now && now <= chuyen.NgayKetThuc)
                throw new Exception("Tour đang diễn ra, không thể hủy.");

            if (chuyen.NgayKetThuc < now)
                throw new Exception("Tour đã kết thúc, không thể hủy.");

            var daysBeforeDeparture = (chuyen.NgayKhoiHanh - now).TotalDays;
            if (daysBeforeDeparture < BookingConstants.CANCELLATION_DEADLINE_DAYS)
                throw new Exception($"Không thể hủy tour trong vòng {BookingConstants.CANCELLATION_DEADLINE_DAYS} ngày trước khởi hành.");

            var oldStatus = booking.TrangThaiDon;
            var oldFinancialStatus = booking.TrangThaiTaiChinh;
            var successfulPayment = booking.ThanhToans
                .Where(t => t.TrangThaiThanhToan == BookingConstants.TT_THANH_CONG && t.LoaiThanhToan != BookingConstants.LOAI_HOAN_TIEN)
                .OrderByDescending(t => t.NgayThanhToan)
                .FirstOrDefault();

            decimal refundAmount = 0;
            decimal refundRate = 0;

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var policy = RefundPolicyEngine.CalculateRefundPolicy(chuyen.NgayKhoiHanh, now);

                var soKhach = booking.SoNguoiLon + booking.SoTreEm + booking.SoEmBe;
                if (booking.ChuyenKhoiHanh != null)
                {
                    booking.ChuyenKhoiHanh.SoChoDaDat -= soKhach;
                }

                booking.LyDoHuy = lyDoHuy.Trim();
                booking.NgayHuy = now;
                booking.NgayCapNhat = now;
                booking.TrangThaiDon = BookingConstants.DON_DA_HUY;

                decimal baseAmount = 0;
                int paymentMethodForRefund = 1;

                if (successfulPayment != null && successfulPayment.TongTienThanhToan > 0)
                {
                    baseAmount = successfulPayment.TongTienThanhToan;
                    paymentMethodForRefund = successfulPayment.PhuongThucThanhToan;
                }
                else if (booking.SoTienDaThanhToan > 0)
                {
                    baseAmount = booking.SoTienDaThanhToan;
                    paymentMethodForRefund = 1;
                }

                if (baseAmount > 0)
                {
                    refundRate = policy.RefundRate;
                    refundAmount = Math.Round(baseAmount * refundRate, 0);

                    if (refundAmount > 0)
                    {
                        if (refundAmount <= 0)
                            throw new InvalidOperationException("Số tiền hoàn tính toán không hợp lệ.");

                        var refundPayment = new ThanhToan
                        {
                            MaDonDatTour = booking.MaDonDatTour,
                            PhuongThucThanhToan = paymentMethodForRefund,
                            TongTienThanhToan = baseAmount,
                            SoTienHoan = refundAmount,
                            NgayThanhToan = now,
                            TrangThaiThanhToan = BookingConstants.TT_CHO_XU_LY,
                            LoaiThanhToan = BookingConstants.LOAI_HOAN_TIEN,
                            NoiDung = $"Hoàn tiền hủy tour: {lyDoHuy} - {policy.Policy}",
                            MaGiaoDich = $"REFUND_{booking.MaDatCho}_{DateTime.Now:yyyyMMddHHmmss}",
                            LyDoHoanTien = lyDoHuy
                        };
                        _context.ThanhToans.Add(refundPayment);

                        booking.TrangThaiTaiChinh = BookingConstants.TC_DANG_HOAN_TIEN;
                    }
                    else
                    {
                        booking.TrangThaiTaiChinh = BookingConstants.TC_MAT_COC;
                    }
                }
                else
                {
                    booking.TrangThaiTaiChinh = BookingConstants.TC_CHUA_THANH_TOAN;
                }

                booking.AppendStatusHistory(oldStatus, booking.TrangThaiDon, "User hủy đơn", lyDoHuy);

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                try
                {
                    if (booking.TrangThaiTaiChinh == BookingConstants.TC_DANG_HOAN_TIEN)
                    {
                        var refund = booking.ThanhToans.LastOrDefault(t => t.LoaiThanhToan == BookingConstants.LOAI_HOAN_TIEN);
                        await _emailService.SendRefundProcessingAsync(booking, refund);
                    }
                    else
                    {
                        await _emailService.SendCancelProcessedAsync(booking);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("========== [CancelBookingAsync] LỖI GỬI EMAIL ==========");
                    Console.WriteLine(ex.ToString());
                    Console.WriteLine("==========================================================");
                }
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }

            try
            {
                await _logService.LoggingAsync(new LogDTO
                {
                    LoaiTaiKhoan = AccountTypeDTO.NguoiDung,
                    Email = _currentUserService.GetEmail(),
                    MaTaiKhoan = userId,
                    TenHanhDong = ActionLogDTO.YeuCauHuy,
                    TenBangTacDong = TableNameDTO.DonDatTour,
                    MaDoiTuong = maDonDatTour,
                    GiaTriTruoc = new
                    {
                        TrangThaiDon = oldStatus,
                        TrangThaiTaiChinh = oldFinancialStatus
                    },
                    GiaTriSau = new
                    {
                        TrangThaiDon = booking.TrangThaiDon,
                        TrangThaiTaiChinh = booking.TrangThaiTaiChinh,
                        LyDoHuy = lyDoHuy,
                        SoTienHoan = refundAmount,
                        TyLeHoan = refundRate
                    }
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine("========== [CancelBookingAsync] LỖI GHI LOG ==========");
                Console.WriteLine(ex.ToString());
                Console.WriteLine("========================================================");
            }

            return true;
        }

        #endregion

        #region Admin Process Cancel (Không còn sử dụng - giữ để tương thích)

        public async Task<bool> AdminProcessCancelAsync(int maDonDatTour, int maNhanVien, bool isRefundable, string? adminNote)
        {
            throw new NotImplementedException("User tự hủy trực tiếp, không cần admin xử lý.");
        }

        #endregion

        #region User Reviews

        public async Task<PageDTO<UserReviewDTO>> GetUserReviewsAsync(int userId, string? searchTerm, int? rating, int page, int pageSize)
        {
            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 5;

            var query = _context.DanhGias
                .AsNoTracking()
                .Include(d => d.Tour)
                    .ThenInclude(t => t.HinhAnhTours)
                .Include(d => d.Tour)
                    .ThenInclude(t => t.ChuyenKhoiHanhs)
                        .ThenInclude(c => c.DonDatTours)
                .Where(d => d.MaNguoiDung == userId
                            && d.NgayXoa == null)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                searchTerm = searchTerm.ToLower().Trim();
                query = query.Where(d => d.Tour.TenTour.ToLower().Contains(searchTerm));
            }

            if (rating.HasValue && rating.Value >= 1 && rating.Value <= 5)
            {
                query = query.Where(d => d.DiemDanhGia == rating.Value);
            }

            var totalItems = await query.CountAsync();

            var items = await query
                .OrderByDescending(d => d.NgayTao)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(d => new UserReviewDTO
                {
                    MaDanhGia = d.MaDanhGia,
                    TenTour = d.Tour.TenTour,
                    DuongDanAnh = d.Tour.HinhAnhTours
                        .OrderByDescending(h => h.AnhChinh)
                        .Select(h => h.DuongDanAnh)
                        .FirstOrDefault() ?? "",
                    DiaDiem = d.Tour.ChuyenKhoiHanhs
                        .Where(c => c.NgayXoa == null)
                        .OrderByDescending(c => c.NgayKhoiHanh)
                        .Select(c => c.DiemDen)
                        .FirstOrDefault() ?? "",
                    DiemDanhGia = d.DiemDanhGia,
                    NoiDung = d.NoiDung,
                    NgayDanhGia = d.NgayTao.ToString("dd/MM/yyyy HH:mm"),
                    TrangThai = d.TrangThai,
                    IsProcessed = d.IsProcessed,
                    GhiChuKiemDuyet = d.GhiChuKiemDuyet ?? "",
                    MaDatCho = d.Tour.ChuyenKhoiHanhs
                        .Where(c => c.NgayXoa == null)
                        .SelectMany(c => c.DonDatTours)
                        .Where(dd => dd.MaNguoiDung == userId && dd.TrangThaiDon == BookingConstants.DON_HOAN_TAT)
                        .OrderByDescending(dd => dd.NgayDat)
                        .Select(dd => dd.MaDatCho)
                        .FirstOrDefault() ?? ""
                })
                .ToListAsync();

            return new PageDTO<UserReviewDTO>
            {
                Items = items,
                PageNumber = page,
                TotalItems = totalItems,
                PageSize = pageSize
            };
        }

        #endregion
    }
}