using DTOs.Page;
using DTOs.User;
using Microsoft.EntityFrameworkCore;
using System.Reflection;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.DTOs.User;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Models;

namespace travel_recommendation_and_booking_system.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public UserService(AppDbContext context)
        {
            _context = context;
        }
        public async Task<UserProfileDTO?> GetMeAsync(int maNguoiDung)
        {
            var user = await _context.NguoiDungs.Include(u => u.VaiTro)
                .Where(u => u.MaNguoiDung == maNguoiDung)
                .Select(u => new UserProfileDTO
                {
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
                .AsNoTracking().FirstOrDefaultAsync();
            return user;
        }
        public async Task<bool> CreateUserAsync(UserCreateDTO request)
        {
            try
            {
                var isExist = await _context.NguoiDungs.AnyAsync(n =>
                    n.Email == request.Email || n.SoDienThoai == request.SoDienThoai);

                if (isExist)
                {
                    return false;
                }

                string hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.MatKhau);

                string? avatarPath = null;
                // giới hạn dung lượng 10MB
                long maxfilesize = 10 * 1014 * 1014;

                if (request.DuongDanAnh != null && request.DuongDanAnh.Length > 0)
                {
                    string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "img", "avatars");
                    if (!Directory.Exists(uploadsFolder))
                    {
                        Directory.CreateDirectory(uploadsFolder);
                    }

                    string originalFileName = Path.GetFileName(request.DuongDanAnh.FileName).Replace(" ", "_");
                    string newFileName = $"{DateTime.Now:yyyyMMddHHmmssfff}_{Guid.NewGuid().ToString().Substring(0, 6)}_{originalFileName}";
                    string filePath = Path.Combine(uploadsFolder, newFileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await request.DuongDanAnh.CopyToAsync(fileStream);
                    }
                    avatarPath = $"/img/avatars/{newFileName}";
                }

                var newUser = new NguoiDung
                {
                    HoTen = request.HoTen,
                    Email = request.Email,
                    MatKhau = hashedPassword,
                    SoDienThoai = request.SoDienThoai,
                    MaVaiTro = request.MaVaiTro,
                    DuongDanAnh = avatarPath,
                    TrangThai = 1,
                    NgayTao = DateTime.Now,
                    NgayCapNhat = DateTime.Now
                };

                _context.NguoiDungs.Add(newUser);
                await _context.SaveChangesAsync();

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi khi tạo người dùng: {ex.Message}");
                return false;
            }
        }
        public async Task<bool> UpdateUserAsync(int id, UserUpdateDTO request)
        {
            try
            {
                var user = await _context.NguoiDungs.FirstOrDefaultAsync(n => n.MaNguoiDung == id && n.NgayXoa == null);
                if (user == null) return false;
                var isConflict = await _context.NguoiDungs.AnyAsync(n =>
                    n.MaNguoiDung != id && (n.Email == request.Email || n.SoDienThoai == request.SoDienThoai));

                if (isConflict) return false;

                // giới hạn dung lượng 10MB
                long maxfilesize = 10 * 1014 * 1014;
                if (request.DuongDanAnh != null && request.DuongDanAnh.Length > 0)
                {
                    if (!string.IsNullOrEmpty(user.DuongDanAnh))
                    {
                        string oldFilePath = Path.Combine(_webHostEnvironment.WebRootPath, user.DuongDanAnh.TrimStart('/'));
                        if (System.IO.File.Exists(oldFilePath))
                        {
                            System.IO.File.Delete(oldFilePath);
                        }
                    }
                    string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "img", "avatars");
                    if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

                    string originalFileName = Path.GetFileName(request.DuongDanAnh.FileName).Replace(" ", "_");
                    string newFileName = $"{DateTime.Now:yyyyMMddHHmmssfff}_{Guid.NewGuid().ToString().Substring(0, 6)}_{originalFileName}";
                    string filePath = Path.Combine(uploadsFolder, newFileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await request.DuongDanAnh.CopyToAsync(fileStream);
                    }

                    user.DuongDanAnh = $"/img/avatars/{newFileName}";
                }

                user.HoTen = request.HoTen;
                user.Email = request.Email;
                user.SoDienThoai = request.SoDienThoai;
                user.MaVaiTro = request.MaVaiTro;
                user.TrangThai = request.TrangThai;
                user.NgayCapNhat = DateTime.Now;

                _context.NguoiDungs.Update(user);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi khi cập nhật tài khoản: {ex.Message}");
                return false;
            }
        }
        public async Task<PageDTO<UserResponseDTO>> GetUsersAsync(int pageNumber, int pageSize, string? keyword, int? status)
        {
            if (pageNumber < 1) pageNumber = 1;
            if (pageSize < 1) pageSize = 10;

            var query = _context.NguoiDungs
                .Include(n => n.VaiTro)
                .Where(n => n.NgayXoa == null)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                var lowerKey = keyword.ToLower();
                query = query.Where(n => n.HoTen.ToLower().Contains(lowerKey)
                                      || n.Email.ToLower().Contains(lowerKey));
            }

            if (status.HasValue)
            {
                query = query.Where(n => n.TrangThai == status.Value);
            }

            int totalItems = await query.CountAsync();

            var items = await query
                .OrderByDescending(n => n.NgayTao)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(n => new UserResponseDTO
                {
                    MaNguoiDung = n.MaNguoiDung,
                    HoTen = n.HoTen,
                    Email = n.Email,
                    DuongDanAnh = n.DuongDanAnh,
                    TenVaiTro = n.VaiTro.TenVaiTro,
                    TrangThai = n.TrangThai,
                    NgayTao = n.NgayTao
                })
                .ToListAsync();

            return new PageDTO<UserResponseDTO>
            {
                Items = items,
                TotalItems = totalItems,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }

        public async Task<bool> LockUserAsync(int id)
        {
            try
            {
                var user = await _context.NguoiDungs.FirstOrDefaultAsync(n => n.MaNguoiDung == id && n.NgayXoa == null);
                if (user == null) return false;

                user.TrangThai = 0;
                user.NgayCapNhat = DateTime.Now;

                _context.NguoiDungs.Update(user);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi khi khóa người dùng: {ex.Message}");
                return false;
            }
        }
        public async Task<bool> UnLockUserAsync(int id)
        {
            try
            {
                var user = await _context.NguoiDungs.FirstOrDefaultAsync(n => n.MaNguoiDung == id && n.NgayXoa == null);
                if (user == null) return false;
                user.TrangThai = 1;
                user.NgayCapNhat = DateTime.Now;

                _context.NguoiDungs.Update(user);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi khi mở khóa người dùng: {ex.Message}");
                return false;
            }
        }

        //nhân viên
        public async Task<bool> CreateStaffAsync(StaffCreateDTO request)
        {
            try
            {
                var isExist = await _context.NguoiDungs.AnyAsync(n =>
                    n.Email == request.Email || n.SoDienThoai == request.SoDienThoai);
                if (isExist) return false;

                string hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.MatKhau);

                string? avatarPath = null;
                // giới hạn dung lượng 10MB
                long maxfilesize = 10 * 1014 * 1014;
                if (request.DuongDanAnh != null && request.DuongDanAnh.Length > 0)
                {
                    string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "img", "avatars");
                    if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

                    string originalFileName = Path.GetFileName(request.DuongDanAnh.FileName).Replace(" ", "_");
                    string newFileName = $"{DateTime.Now:yyyyMMddHHmmssfff}_{Guid.NewGuid().ToString().Substring(0, 6)}_{originalFileName}";
                    string filePath = Path.Combine(uploadsFolder, newFileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await request.DuongDanAnh.CopyToAsync(fileStream);
                    }
                    avatarPath = $"/img/avatars/{newFileName}";
                }

                var newNhanVien = new NguoiDung
                {
                    HoTen = request.HoTen,
                    Email = request.Email,
                    MatKhau = hashedPassword,
                    SoDienThoai = request.SoDienThoai,
                    MaVaiTro = request.MaVaiTro,
                    ChucVu = request.ChucVu,
                    PhongBan = request.PhongBan,
                    DuongDanAnh = avatarPath,

                    TrangThai = 2,
                    NgayTao = DateTime.Now,
                    NgayCapNhat = DateTime.Now
                };

                _context.NguoiDungs.Add(newNhanVien);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi khi tạo nhân viên: {ex.Message}");
                return false;
            }
        }
        public async Task<bool> UpdateStaffAsync(int id, StaffUpdateDTO request)
        {
            try
            {
                var staff = await _context.NguoiDungs.FirstOrDefaultAsync(n => n.MaNguoiDung == id && n.NgayXoa == null);
                if (staff == null) return false;

                var isExist = await _context.NguoiDungs.AnyAsync(n =>
                    n.MaNguoiDung != id && (n.Email == request.Email || n.SoDienThoai == request.SoDienThoai));
                if (isExist) return false;
                long maxfilesize = 10 * 1014 * 1014;
                if (request.DuongDanAnh != null && request.DuongDanAnh.Length > 0)
                {
                    if (!string.IsNullOrEmpty(staff.DuongDanAnh) && !staff.DuongDanAnh.Contains("default-avatar.png"))
                    {
                        string oldFilePath = Path.Combine(_webHostEnvironment.WebRootPath, staff.DuongDanAnh.TrimStart('/'));
                        if (System.IO.File.Exists(oldFilePath)) System.IO.File.Delete(oldFilePath);
                    }

                    string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "img", "avatars");
                    if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

                    string originalFileName = Path.GetFileName(request.DuongDanAnh.FileName).Replace(" ", "_");
                    string newFileName = $"{DateTime.Now:yyyyMMddHHmmssfff}_{Guid.NewGuid().ToString().Substring(0, 6)}_{originalFileName}";
                    string filePath = Path.Combine(uploadsFolder, newFileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await request.DuongDanAnh.CopyToAsync(fileStream);
                    }

                    staff.DuongDanAnh = $"/img/avatars/{newFileName}";
                }

                staff.HoTen = request.HoTen;
                staff.Email = request.Email;
                staff.SoDienThoai = request.SoDienThoai;
                staff.MaVaiTro = request.MaVaiTro;
                staff.ChucVu = request.ChucVu;
                staff.PhongBan = request.PhongBan;
                staff.TrangThai = request.TrangThai;
                staff.NgayCapNhat = DateTime.Now;

                _context.NguoiDungs.Update(staff);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi khi cập nhật nhân viên: {ex.Message}");
                return false;
            }
        }
        public async Task<PageDTO<StaffResponseDTO>> GetStaffsAsync(int pageNumber, int pageSize, string? keyword, int? status)
        {
            if (pageNumber < 1) pageNumber = 1;
            if (pageSize < 1) pageSize = 10;

            var query = _context.NguoiDungs.Where(n => n.NgayXoa == null && n.ChucVu != null && n.PhongBan != null).AsQueryable();

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                var lowerKey = keyword.ToLower();
                query = query.Where(n => n.HoTen.ToLower().Contains(lowerKey)
                                      || n.Email.ToLower().Contains(lowerKey));
            }

            if (status.HasValue)
            {
                query = query.Where(n => n.TrangThai == status.Value);
            }

            int totalItems = await query.CountAsync();

            var items = await query
                .OrderByDescending(n => n.NgayTao)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(n => new StaffResponseDTO
                {
                    MaNhanVien = n.MaNguoiDung,
                    HoTen = n.HoTen,
                    Email = n.Email,
                    DuongDanAnh = n.DuongDanAnh,
                    ChucVu = n.ChucVu.Value, 
                    PhongBan = n.PhongBan.Value,
                    NgayGiaNhap = n.NgayTao,
                    TrangThai = n.TrangThai
                })
                .ToListAsync();

            return new PageDTO<StaffResponseDTO>
            {
                Items = items,
                TotalItems = totalItems,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }

    }
}
