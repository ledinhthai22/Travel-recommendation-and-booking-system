using DTOs.Page;
using Microsoft.EntityFrameworkCore;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.DTOs.Log;
using travel_recommendation_and_booking_system.DTOs.LogSystem;
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
        private readonly IPaymentService _paymentService;
        public UserProfileService(AppDbContext context, ILogService logService, ICurrentUserService currentUserService, IEmailService emailService, IPaymentService paymentService)
        {
            _context = context;
            _logService = logService;
            _currentUserService = currentUserService;
            _emailService = emailService;
            _paymentService = paymentService;
        }
        public async Task<UserProfileReponseDTO?> GetMyProfileAsync(int maNguoiDung)
        {
            var userProfile = await _context.NguoiDungs.AsNoTracking()
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
            var oldData = new
            {
                user.HoTen,
                user.Email,
                user.DiaChi,
                user.NgaySinh,
                user.SoDienThoai,
                user.GioiTinh,
                user.NgayCapNhat,
            };
            await _context.SaveChangesAsync();

            var currentUserId = _currentUserService.GetUserId();
            await _logService.LoggingAsync(new LogDTO
            {
                LoaiTaiKhoan = AccountTypeDTO.NguoiDung,
                Email = _currentUserService.GetEmail(),
                MaTaiKhoan = currentUserId,
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

            if (!isOldPasswordValid)
            {
                return false;
            }

            string newPasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);

            user.MatKhau = newPasswordHash;
            user.NgayCapNhat = DateTime.Now;

            _context.NguoiDungs.Update(user);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<AccountOverviewDTO> GetAccountOverviewAsync(int userId)
        {
            var tongTour = await _context.DonDatTours.CountAsync(d => d.MaNguoiDung == userId);
            var tongDanhGia = await _context.DanhGias.CountAsync(d => d.MaNguoiDung == userId);

            var tongTien = await _context.ThanhToans
                .Where(t => t.DonDatTour.MaNguoiDung == userId && t.TrangThaiThanhToan == 1)
                .SumAsync(t => (decimal?)t.TongTienThanhToan) ?? 0m;

            var recentTours = await _context.DonDatTours
                .Include(d => d.ChuyenKhoiHanh)
                    .ThenInclude(c => c.Tour)
                        .ThenInclude(t => t.HinhAnhTours)
                .Where(d => d.MaNguoiDung == userId)
                .OrderByDescending(d => d.NgayDat)
                .Take(5)
                .Select(d => new RecentTourDTO
                {
                    MaDonDatTour = d.MaDonDatTour,
                    DuongDanAnh = d.ChuyenKhoiHanh.Tour.HinhAnhTours
                                .OrderByDescending(a => a.AnhChinh)
                                .Select(a => a.DuongDanAnh)
                                .FirstOrDefault() ?? "",
                    TenTour = d.ChuyenKhoiHanh.Tour.TenTour,
                    NgayBatDau = d.ChuyenKhoiHanh.NgayKhoiHanh.ToString("dd/MM/yyyy"),
                    DiaDiem = d.ChuyenKhoiHanh.DiemDen,
                    TrangThai = d.TrangThaiDon
                })
                .ToListAsync();

            return new AccountOverviewDTO
            {
                TongTour = tongTour,
                TongDanhGia = tongDanhGia,
                TongTien = tongTien,
                Tours = recentTours
            };
        }

        public async Task<PageDTO<HistoryTourDTO>> GetBookingHistoryAsync(int userId, string searchTerm, int page, int pageSize, int? status)
        {
            if (page < 1)
            {
                page = 1;
            }
            if (pageSize < 1)
            {
                pageSize = 5;
            }
            var query = _context.DonDatTours
                .Include(d => d.ChuyenKhoiHanh)
                    .ThenInclude(c => c.Tour)
                        .ThenInclude(t => t.HinhAnhTours)
                .Where(d => d.MaNguoiDung == userId)
                .AsQueryable();

            if (!string.IsNullOrEmpty(searchTerm))
            {
                searchTerm = searchTerm.ToLower().Trim();
                query = query.Where(d =>
                    d.ChuyenKhoiHanh.Tour.TenTour.ToLower().Contains(searchTerm) ||
                    d.MaDatCho.ToLower().Contains(searchTerm)
                );
            }

            if (status.HasValue)
            {
                query = query.Where(d => d.TrangThaiDon == status.Value);
            }

            var totalItems = await query.CountAsync();

            var tours = await query
                .OrderByDescending(d => d.NgayDat)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(d => new HistoryTourDTO
                {
                    MaDonDatTour = d.MaDonDatTour,
                    MaDatCho = d.MaDatCho,
                    DuongDanAnh = d.ChuyenKhoiHanh.Tour.HinhAnhTours
                                    .OrderByDescending(a => a.AnhChinh)
                                    .Select(a => a.DuongDanAnh)
                                    .FirstOrDefault() ?? "",
                    TenTour = d.ChuyenKhoiHanh.Tour.TenTour,
                    NgayBatDau = d.ChuyenKhoiHanh.NgayKhoiHanh.ToString("dd/MM/yyyy"),
                    TrangThai = d.TrangThaiDon
                })
                .ToListAsync();

            return new PageDTO<HistoryTourDTO>
            {
                Items = tours,
                PageNumber = page,
                TotalItems = totalItems,
                PageSize = pageSize
            };
        }

        public async Task<HistoryTourDetailDTO> GetBookingDetailAsync(int userid, int maDonDatTour)
        {
            return await _context.DonDatTours
                .Include(d => d.ChuyenKhoiHanh).ThenInclude(c => c.Tour)
                .Include(d => d.ThanhToans)
                .Where(d => d.MaDonDatTour == maDonDatTour && d.MaNguoiDung == userid)
                .Select(d => new HistoryTourDetailDTO
                {
                    MaTour = d.ChuyenKhoiHanh.MaTour,
                    MaNguoiDung = d.MaNguoiDung,
                    MaDonDatTour = d.MaDonDatTour,
                    MaDatCho = d.MaDatCho,
                    TrangThai = d.TrangThaiDon,
                    NgayDat = d.NgayDat.ToString("dd/MM/yyyy HH:mm"),
                    TenTour = d.ChuyenKhoiHanh.Tour.TenTour,
                    NgayKhoiHanh = d.ChuyenKhoiHanh.NgayKhoiHanh.ToString("dd/MM/yyyy"),
                    NgayKetThuc = d.ChuyenKhoiHanh.NgayKetThuc.ToString("dd/MM/yyyy"),
                    DiaDiem = d.ChuyenKhoiHanh.DiemDen,
                    SoLuongNguoiLon = d.SoNguoiLon,
                    SoLuongTreEm = d.SoTreEm,
                    SoLuongEmBe = d.SoEmBe,
                    TongTien = d.TongTien,
                    PhuongThucThanhToan = d.ThanhToans.FirstOrDefault() == null ? "Chưa thanh toán" :
                        (d.ThanhToans.FirstOrDefault().PhuongThucThanhToan == 1 ? "VNPay" :
                        (d.ThanhToans.FirstOrDefault().PhuongThucThanhToan == 2 ? "Tiền mặt" : "Chuyển khoản"))
                })
                .FirstOrDefaultAsync();
        }

        public async Task<bool> CancelBookingAsync(int userId, int maDonDatTour, string lyDoHuy)
        {
            if (string.IsNullOrWhiteSpace(lyDoHuy))
                throw new Exception("Vui lòng nhập lý do hủy tour.");

            var booking = await _context.DonDatTours
                .Include(d => d.ChuyenKhoiHanh)
                .Include(d => d.ThanhToans)
                .FirstOrDefaultAsync(d => d.MaDonDatTour == maDonDatTour && d.MaNguoiDung == userId);

            if (booking == null)
                throw new Exception("Không tìm thấy đơn đặt tour.");

            if (booking.TrangThaiDon == 3)
                throw new Exception("Đơn đã hoàn tất, không thể hủy.");
            if (booking.TrangThaiDon == 4)
                throw new Exception("Đơn đã được hủy trước đó.");
            if (booking.TrangThaiDon != 1 && booking.TrangThaiDon != 2)
                throw new Exception("Đơn hàng không thể hủy ở trạng thái hiện tại.");

            var chuyen = booking.ChuyenKhoiHanh;
            var now = DateTime.Now;

            if (chuyen.NgayKhoiHanh <= now && now <= chuyen.NgayKetThuc)
                throw new Exception("Tour đang diễn ra, không thể hủy.");
            if (chuyen.NgayKetThuc < now)
                throw new Exception("Tour đã kết thúc, không thể hủy.");
            if (chuyen.NgayKhoiHanh <= now.AddDays(3))
                throw new Exception("Không thể hủy tour trong vòng 3 ngày trước khởi hành.");

            var thanhToanThanhCong = booking.ThanhToans
                .Where(t => t.TrangThaiThanhToan == 1)
                .OrderByDescending(t => t.NgayThanhToan)
                .FirstOrDefault();

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                booking.TrangThaiDon = 4;
                booking.LyDoHuy = lyDoHuy.Trim();
                booking.NgayCapNhat = now;
                _context.DonDatTours.Update(booking);

                // Trả lại chỗ đã đặt — trước đây bị thiếu ở luồng khách tự hủy
                var soKhach = booking.SoNguoiLon + booking.SoTreEm + booking.SoEmBe;
                chuyen.SoChoDaDat -= soKhach;

                if (thanhToanThanhCong != null)
                {
                    decimal tyLeHoan = RefundHelper.TinhTyLeHoanTien(chuyen.NgayKhoiHanh, now);
                    decimal soTienHoan = Math.Round(thanhToanThanhCong.TongTienThanhToan * tyLeHoan, 0);

                    if (soTienHoan > 0)
                    {
                        thanhToanThanhCong.SoTienHoan = soTienHoan;
                        thanhToanThanhCong.TrangThaiThanhToan = 4; // Chờ hoàn tiền — admin xử lý thủ công
                        _context.ThanhToans.Update(thanhToanThanhCong);
                    }
                    // Nếu tỷ lệ hoàn = 0% (hủy sát ngày trong khoảng cho phép), không cần đánh dấu gì thêm
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
            if (thanhToanThanhCong != null)
            {
                await _emailService.SendRefundPendingAsync(booking, thanhToanThanhCong);
            }
            return true;
        }

        public async Task<bool> XacNhanHoanTienAsync(int maThanhToan, int maNhanVien)
        {
            var thanhToan = await _context.ThanhToans.FindAsync(maThanhToan);

            if (thanhToan == null)
                throw new Exception("Không tìm thấy giao dịch thanh toán.");

            if (thanhToan.TrangThaiThanhToan != 4)
                throw new Exception("Giao dịch không ở trạng thái chờ hoàn tiền.");

            thanhToan.TrangThaiThanhToan = 3; // Đã hoàn tiền
            thanhToan.NgayHoanTien = DateTime.Now;
            thanhToan.MaNhanVienXuLyHoan = maNhanVien.ToString();

            _context.ThanhToans.Update(thanhToan);
            var order = await _context.DonDatTours
            .Include(d => d.NguoiDung)
            .Include(d => d.KhachHangs)
            .Include(d => d.ChuyenKhoiHanh).ThenInclude(c => c.Tour)
            .FirstOrDefaultAsync(d => d.MaDonDatTour == thanhToan.MaDonDatTour);
            await _context.SaveChangesAsync();
            if (order != null)
            {
                await _emailService.SendRefundCompletedAsync(order, thanhToan);
            }
            return true;
        }
        public async Task<PageDTO<PendingRefundDTO>> GetPendingRefundsAsync(int page, int pageSize)
        {
            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 10;

            var query = _context.ThanhToans
                .Include(t => t.DonDatTour).ThenInclude(d => d.NguoiDung)
                .Include(t => t.DonDatTour).ThenInclude(d => d.ChuyenKhoiHanh).ThenInclude(c => c.Tour)
                .Where(t => t.TrangThaiThanhToan == 4)
                .OrderByDescending(t => t.NgayThanhToan)
                .AsQueryable();

            var totalItems = await query.CountAsync();

            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(t => new PendingRefundDTO
                {
                    MaThanhToan = t.MaThanhToan,
                    MaDonDatTour = t.MaDonDatTour,
                    MaDatCho = t.DonDatTour.MaDatCho,
                    TenTour = t.DonDatTour.ChuyenKhoiHanh.Tour.TenTour,
                    HoTenKhachHang = t.DonDatTour.NguoiDung.HoTen,
                    SoDienThoai = t.DonDatTour.NguoiDung.SoDienThoai,
                    TongTienThanhToan = t.TongTienThanhToan,
                    SoTienHoan = t.SoTienHoan,
                    LyDoHuy = t.DonDatTour.LyDoHuy,
                    NgayThanhToan = t.NgayThanhToan
                })
                .ToListAsync();

            return new PageDTO<PendingRefundDTO>
            {
                Items = items,
                PageNumber = page,
                TotalItems = totalItems,
                PageSize = pageSize
            };
        }
    }
}   