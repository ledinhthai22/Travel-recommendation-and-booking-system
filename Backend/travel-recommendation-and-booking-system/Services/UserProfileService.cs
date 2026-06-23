using DTOs.Page;
using Microsoft.EntityFrameworkCore;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.DTOs.UserProfile;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Models;

namespace travel_recommendation_and_booking_system.Services
{
    public class UserProfileService :IUserProfileService
    {
        private readonly AppDbContext _context;
        public UserProfileService(AppDbContext context)
        {
            _context = context;
        }
        public async Task<UserProfileReponseDTO?> GetMyProfileAsync(int maNguoiDung)
        {
            var userProfile = await _context.NguoiDungs.AsNoTracking()
            .Where(u => u.MaNguoiDung == maNguoiDung && u.NgayXoa == null && u.TrangThai ==1)
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

            await _context.SaveChangesAsync();
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
            user.NgayCapNhat= DateTime.Now;

            _context.NguoiDungs.Update(user);
             await _context.SaveChangesAsync();

            return true;
        }

        public async Task<AccountOverviewDTO> GetAccountOverviewAsync(int userId)
        {
            var tongTour = await _context.DonDatTours.CountAsync(d => d.MaNguoiDung == userId);
            var tongDanhGia = await _context.DanhGias.CountAsync(d => d.MaNguoiDung == userId);
            var tongTien = await _context.DonDatTours.Where(d => d.MaNguoiDung == userId && d.TrangThaiThanhToan == true).SumAsync(d =>(decimal?) d.TongTien)??0m;

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

        public async Task<PageDTO<HistoryTourDTO>> GetBookingHistoryAsync(int userId, string searchTerm, int page, int pageSize)
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
                    PhuongThucThanhToan = d.ThanhToans.FirstOrDefault().PhuongThucThanhToan == true ? "Chuyển khoản" : "tiền mặt"
                })
                .FirstOrDefaultAsync();
        }

        public async Task<bool> CancelBookingAsync(int userId, int maDonDatTour)
        {
            var booking = await _context.DonDatTours
        .Include(d => d.ChuyenKhoiHanh)
        .FirstOrDefaultAsync(d => d.MaDonDatTour == maDonDatTour && d.MaNguoiDung == userId);

            if (booking == null) throw new Exception("Không tìm thấy đơn đặt tour.");

            if (booking.TrangThaiDon != 1 && booking.TrangThaiDon != 2)
                throw new Exception("Đơn hàng không thể hủy ở trạng thái hiện tại.");

            if (booking.ChuyenKhoiHanh.NgayKhoiHanh <= DateTime.Now.AddDays(3))
                throw new Exception("Không thể hủy tour trong vòng 3 ngày trước khởi hành.");

            booking.TrangThaiDon = 4;
            booking.NgayCapNhat = DateTime.Now;

            _context.DonDatTours.Update(booking);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
