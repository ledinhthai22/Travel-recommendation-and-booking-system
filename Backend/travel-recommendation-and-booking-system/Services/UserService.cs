using Microsoft.EntityFrameworkCore;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.DTOs;
using travel_recommendation_and_booking_system.Interfaces;

namespace travel_recommendation_and_booking_system.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;
        public UserService(AppDbContext context)
        {
            _context = context;
        }
        public async Task<UserProfileDTO?> GetMeAsync(int maNguoiDung)
        {
            var user= await _context.NguoiDungs.Include(u=> u.VaiTro)
                .Where(u=>u.MaNguoiDung == maNguoiDung)
                .Select( u=> new UserProfileDTO {
                    MaNguoiDung = u.MaNguoiDung,
                    HoTen = u.HoTen,
                    Email = u.Email,
                    SoDienThoai = u.SoDienThoai,
                    DuongDanAnh = u.DuongDanAnh,
                    DiaChi = u.DiaChi,
                    NgaySinh = u.NgaySinh,
                    TrangThai = u.TrangThai,
                    MaVaiTro = u.MaVaiTro,
                    TenVaiTro = u.VaiTro.TenVaiTro
                })
                .FirstOrDefaultAsync();
            return user;
        }
    }
}
