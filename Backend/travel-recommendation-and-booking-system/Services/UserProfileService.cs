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
    }
}
