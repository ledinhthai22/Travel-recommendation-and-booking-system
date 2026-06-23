using DTOs.Page;
using DTOs.User;
using Microsoft.EntityFrameworkCore;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.DTOs.Log;
using travel_recommendation_and_booking_system.DTOs.LogSystem;
using travel_recommendation_and_booking_system.DTOs.User;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Models;

namespace travel_recommendation_and_booking_system.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly ILogService _logService;
        private readonly ICurrentUserService _currentUserService;
        public UserService(AppDbContext context, IWebHostEnvironment webHost, ILogService logService, ICurrentUserService currentUserService)
        {
            _context = context;
            _webHostEnvironment = webHost;
            _logService = logService;
            _currentUserService = currentUserService;
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
                    GioiTinh = u.GioiTinh,
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
            var isExist = await _context.NguoiDungs.AnyAsync(n =>
                n.Email == request.Email || n.SoDienThoai == request.SoDienThoai);

            if (isExist)
            {
                return false;
            }

            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.MatKhau);
            var newUser = new NguoiDung
            {
                HoTen = request.HoTen,
                Email = request.Email,
                MatKhau = hashedPassword,
                GioiTinh = request.GioiTinh,
                SoDienThoai = request.SoDienThoai,
                MaVaiTro = 4,
                TrangThai = 1,
                NgayTao = DateTime.Now,
                NgayCapNhat = DateTime.Now
            };
            _context.NguoiDungs.Add(newUser);
            await _context.SaveChangesAsync();
            await _logService.LoggingAsync(new LogDTO
            {
                LoaiTaiKhoan = AccountTypeDTO.NhanVien,
                MaTaiKhoan = _currentUserService.GetUserId() ?? 0,
                Email = _currentUserService.GetEmail(),
                TenHanhDong = ActionLogDTO.Tao,

                TenBangTacDong = TableNameDTO.NguoiDung,

                MaDoiTuong = newUser.MaNguoiDung,

                GiaTriSau = new
                {
                    newUser.HoTen,
                    newUser.Email,
                    newUser.SoDienThoai,
                    newUser.MaVaiTro,
                    newUser.TrangThai
                }
            });
            return true;
        }
        public async Task<bool> UpdateUserAsync(int id, UserUpdateDTO request)
        {
            var user = await _context.NguoiDungs.FirstOrDefaultAsync(n => n.MaNguoiDung == id && n.NgayXoa == null);
            if (user == null) return false;

            var isConflict = await _context.NguoiDungs.AnyAsync(n =>
                n.MaNguoiDung != id && (n.Email == request.Email || n.SoDienThoai == request.SoDienThoai));

            if (isConflict) return false;

            if (request.DuongDanAnh != null && request.DuongDanAnh.Length > 0)
            {
                string webRootPath = string.IsNullOrWhiteSpace(_webHostEnvironment.WebRootPath)
                    ? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot")
                    : _webHostEnvironment.WebRootPath;

                if (!string.IsNullOrEmpty(user.DuongDanAnh))
                {
                    string oldFilePath = Path.Combine(webRootPath, user.DuongDanAnh.TrimStart('/'));
                    if (System.IO.File.Exists(oldFilePath))
                    {
                        System.IO.File.Delete(oldFilePath);
                    }
                }

                string uploadsFolder = Path.Combine(webRootPath, "img", "avatars");
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
            var oldData = new
            {
                user.HoTen,
                user.Email,
                user.SoDienThoai,
                user.DiaChi,
                user.GioiTinh,
                user.NgayCapNhat,
                user.MaVaiTro,
            };

            user.HoTen = request.HoTen;
            user.Email = request.Email;
            user.SoDienThoai = request.SoDienThoai;
            user.DiaChi = request.DiaChi;
            user.GioiTinh = request.GioiTinh;
            user.NgaySinh = request.NgaySinh;
            user.MaVaiTro = request.MaVaiTro;
            user.NgayCapNhat = DateTime.Now;

            _context.NguoiDungs.Update(user);
            await _context.SaveChangesAsync();
            await _logService.LoggingAsync(new LogDTO
            {
                LoaiTaiKhoan = AccountTypeDTO.NhanVien,

                MaTaiKhoan = _currentUserService.GetUserId() ?? 0,
                Email = _currentUserService.GetEmail(),
                TenHanhDong = ActionLogDTO.CapNhat,

                TenBangTacDong = TableNameDTO.NguoiDung,

                MaDoiTuong = user.MaNguoiDung,

                GiaTriTruoc = oldData,

                GiaTriSau = new
                {
                    user.HoTen,
                    user.Email,
                    user.SoDienThoai,
                    user.DiaChi
                }
            });
            return true;
        }
        public async Task<PageDTO<UserResponseDTO>> GetUsersAsync(int pageNumber, int pageSize, string? keyword, int? status)
        {
            if (pageNumber < 1) pageNumber = 1;
            if (pageSize < 1) pageSize = 10;

            var query = _context.NguoiDungs
                .Include(n => n.VaiTro)
                .Where(n => n.NgayXoa == null && n.MaVaiTro == 4)
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
                    NgaySinh = n.NgaySinh,
                    DiaChi = n.DiaChi,
                    GioiTinh = n.GioiTinh,
                    SoDienThoai = n.SoDienThoai,
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
        public async Task<UserResponseDTO?> DetailUserAsync(int id)
        {
            var user = await _context.NguoiDungs
                .AsNoTracking()
                .Include(n => n.VaiTro)
                .Where(n => n.MaNguoiDung == id && n.NgayXoa == null)
                .Select(n => new UserResponseDTO
                {
                    MaNguoiDung = n.MaNguoiDung,
                    HoTen = n.HoTen,
                    Email = n.Email,
                    SoDienThoai = n.SoDienThoai,
                    DiaChi = n.DiaChi,
                    GioiTinh = n.GioiTinh,
                    NgaySinh = n.NgaySinh,
                    DuongDanAnh = n.DuongDanAnh,
                    TenVaiTro = n.VaiTro.TenVaiTro,
                    TrangThai = n.TrangThai,
                    NgayTao = n.NgayTao
                })
                .FirstOrDefaultAsync();
            return user;
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
                await _logService.LoggingAsync(new LogDTO
                {
                    LoaiTaiKhoan = AccountTypeDTO.NhanVien,

                    MaTaiKhoan = _currentUserService.GetUserId() ?? 0,
                    Email = _currentUserService.GetEmail(),
                    TenHanhDong = ActionLogDTO.CapNhatTrangThai,

                    TenBangTacDong = TableNameDTO.NguoiDung,

                    MaDoiTuong = user.MaNguoiDung,

                    GiaTriTruoc = new
                    {
                        TrangThai = 1
                    },

                    GiaTriSau = new
                    {
                        TrangThai = 0
                    }
                });
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
                await _logService.LoggingAsync(new LogDTO
                {
                    LoaiTaiKhoan = AccountTypeDTO.NhanVien,
                    Email = _currentUserService.GetEmail(),
                    MaTaiKhoan = _currentUserService.GetUserId() ?? 0,

                    TenHanhDong = ActionLogDTO.CapNhatTrangThai,

                    TenBangTacDong = TableNameDTO.NguoiDung,

                    MaDoiTuong = user.MaNguoiDung,

                    GiaTriTruoc = new
                    {
                        TrangThai = 0
                    },

                    GiaTriSau = new
                    {
                        TrangThai = 1
                    }
                });
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi khi mở khóa người dùng: {ex.Message}");
                return false;
            }
        }
    }
}
