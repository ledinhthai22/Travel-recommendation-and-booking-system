using System.Text.RegularExpressions;
using DTOs.Page;
using DTOs.Staff;
using Microsoft.EntityFrameworkCore;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.DTOs.Log;
using travel_recommendation_and_booking_system.DTOs.LogSystem;
using travel_recommendation_and_booking_system.DTOs.Staff;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Models;

namespace travel_recommendation_and_booking_system.Services
{
    public class StaffService : IStaffService
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _environment;
        private readonly ILogService _logService;
        private readonly ICurrentUserService _currentUserService;

        private static readonly int[] ValidStatuses = { 1, 2, 3, 4 };

        public StaffService(
            AppDbContext context,
            IWebHostEnvironment environment,
            ILogService logService,
            ICurrentUserService currentUserService)
        {
            _context = context;
            _environment = environment;
            _logService = logService;
            _currentUserService = currentUserService;
        }



        private static void ValidateEmail(string? email)
        {
            if (string.IsNullOrWhiteSpace(email))
                throw new Exception("Email không được để trống.");

            var regex = new Regex(@"^[^@\s]+@[^@\s]+\.[^@\s]+$", RegexOptions.IgnoreCase);
            if (!regex.IsMatch(email))
                throw new Exception("Email không đúng định dạng.");
        }

        private static void ValidateSoDienThoai(string? sdt)
        {
            if (string.IsNullOrWhiteSpace(sdt))
                throw new Exception("Số điện thoại không được để trống.");

            var regex = new Regex(@"^(0[3|5|7|8|9])[0-9]{8}$");
            if (!regex.IsMatch(sdt))
                throw new Exception("Số điện thoại không hợp lệ (phải là số Việt Nam 10 chữ số).");
        }

        private static void ValidateCccd(string? cccd)
        {
            if (string.IsNullOrWhiteSpace(cccd))
                throw new Exception("CCCD không được để trống.");

            var regex = new Regex(@"^\d{12}$");
            if (!regex.IsMatch(cccd))
                throw new Exception("CCCD phải gồm đúng 12 chữ số.");
        }

        private static void ValidateTrangThai(int trangThai)
        {
            if (!ValidStatuses.Contains(trangThai))
                throw new Exception($"Trạng thái không hợp lệ. Chỉ chấp nhận: {string.Join(", ", ValidStatuses)}.");
        }

        private static void ValidateStaffDTO(StaffDTO staff)
        {
            if (string.IsNullOrWhiteSpace(staff.HoTen))
                throw new Exception("Họ tên không được để trống.");

            ValidateEmail(staff.Email);
            ValidateSoDienThoai(staff.SoDienThoai);
            ValidateCccd(staff.Cccd);

            if (staff.TrangThai.HasValue)
                ValidateTrangThai(staff.TrangThai.Value);
        }

        private static void ValidateImage(IFormFile file)
        {
            string[] allowedExtensions = { ".jpg", ".jpeg", ".png", ".webp" };
            string extension = Path.GetExtension(file.FileName).ToLower();

            if (!allowedExtensions.Contains(extension))
                throw new Exception("Chỉ chấp nhận file jpg, jpeg, png, webp.");

            if (file.Length > 2 * 1024 * 1024)
                throw new Exception("Ảnh phải nhỏ hơn 2MB.");
        }



        private async Task<string> SaveImageAsync(IFormFile file, int maNhanVien, string hoTen)
        {
            string folderPath = Path.Combine(_environment.WebRootPath, "img", "staff");
            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            string extension = Path.GetExtension(file.FileName).ToLower();


            var safeName = Regex.Replace(hoTen.Trim(), @"[^a-zA-Z0-9]", "_");

            string fileName = $"{DateTime.Now:yyyyMMddHHmmss}_{maNhanVien}_{safeName}{extension}";
            string filePath = Path.Combine(folderPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
                await file.CopyToAsync(stream);

            return $"/img/staff/{fileName}";
        }

        private void DeletePhysicalImage(string? duongDanAnh)
        {
            if (string.IsNullOrWhiteSpace(duongDanAnh)) return;

            string filePath = Path.Combine(
                _environment.WebRootPath,
                duongDanAnh.TrimStart('/').Replace("/", Path.DirectorySeparatorChar.ToString())
            );

            if (File.Exists(filePath))
                File.Delete(filePath);
        }


        public async Task<StaffResponseDTO?> GetStaffMeAsync(int maNhanVien)
        {
            var staff = await _context.NhanViens
                .Include(n => n.VaiTro)
                .Where(n => n.MaNhanVien == maNhanVien && n.NgayXoa == null)
                .Select(n => new StaffResponseDTO
                {
                    MaNhanVien = n.MaNhanVien,
                    HoTen = n.HoTen,
                    Email = n.Email,
                    SoDienThoai = n.SoDienThoai,
                    DuongDanAnh = n.DuongDanAnh,
                    DiaChi = n.DiaChi,
                    TrangThai = n.TrangThai,
                    MaVaiTro = n.MaVaiTro,

                })
                .AsNoTracking()
                .FirstOrDefaultAsync();

            return staff;
        }
        public async Task<List<StaffDTO>> GetTourGuiDe()
        {
            return await _context.NhanViens
                .Where(n => n.NgayXoa == null && n.MaVaiTro == 3)
                .OrderBy(n => n.HoTen)
                .Select(n => new StaffDTO
                {
                    MaNhanVien = n.MaNhanVien,
                    HoTen = n.HoTen
                })
                .ToListAsync();
        }

        public async Task<PageDTO<StaffResponseDTO>> GetPagedStaffsAsync(int pageNumber, int pageSize, StaffFilterDTO filter)
        {
            if (pageNumber < 1) pageNumber = 1;
            if (pageSize < 1) pageSize = 10;

            var query = _context.NhanViens
                .Include(x => x.VaiTro)
                .Where(n => n.NgayXoa == null && n.MaVaiTro >= 2 && n.MaVaiTro != 4)
                .AsNoTracking();

            if (!string.IsNullOrWhiteSpace(filter?.HoTen))
            {
                var keyword = filter.HoTen.Trim().ToLower();
                query = query.Where(x =>
                    (x.HoTen ?? "").ToLower().Contains(keyword) ||
                    (x.Email ?? "").ToLower().Contains(keyword) ||
                    (x.SoDienThoai ?? "").ToLower().Contains(keyword) ||
                    (x.Cccd ?? "").ToLower().Contains(keyword)
                );
            }

            if (filter != null && filter.TrangThai > 0)
                query = query.Where(x => x.TrangThai == filter.TrangThai);

            int totalItems = await query.CountAsync();

            var items = await query
                .OrderByDescending(x => x.TrangThai)
                .ThenBy(x => x.NgayTao)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(x => new StaffResponseDTO
                {
                    MaNhanVien = x.MaNhanVien,
                    HoTen = x.HoTen,
                    GioiTinh = x.GioiTinh,
                    Email = x.Email,
                    SoDienThoai = x.SoDienThoai,
                    DuongDanAnh = x.DuongDanAnh,
                    DiaChi = x.DiaChi,
                    Cccd = x.Cccd,
                    NgaySinh = x.NgaySinh ?? DateTime.MinValue,
                    TrangThai = x.TrangThai,
                    MaVaiTro = x.MaVaiTro,
                    TenVaiTro = x.VaiTro.TenVaiTro,
                    NgayTao = x.NgayTao
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

        public async Task<StaffResponseDTO?> GetStaffByIdAsync(int id)
        {
            if (id <= 0) return null;

            var result = await _context.NhanViens
                .Include(x => x.VaiTro)
                .AsNoTracking()
                .Where(n => n.MaNhanVien == id && n.NgayXoa == null)
                .Select(x => new StaffResponseDTO
                {
                    MaNhanVien = x.MaNhanVien,
                    HoTen = x.HoTen,
                    GioiTinh = x.GioiTinh,
                    Email = x.Email,
                    SoDienThoai = x.SoDienThoai,
                    DuongDanAnh = x.DuongDanAnh,
                    DiaChi = x.DiaChi,
                    Cccd = x.Cccd,
                    NgaySinh = x.NgaySinh ?? DateTime.MinValue,
                    TrangThai = x.TrangThai,
                    MaVaiTro = x.MaVaiTro,
                    TenVaiTro = x.VaiTro.TenVaiTro,
                    NgayTao = x.NgayTao
                })
                .FirstOrDefaultAsync();


            return result;
        }



        public async Task<StaffResponseDTO> CreateAsync(StaffDTO staff)
        {
            ValidateStaffDTO(staff);

            if (string.IsNullOrWhiteSpace(staff.Matkhau) || staff.Matkhau.Length < 6)
                throw new Exception("Mật khẩu phải có ít nhất 6 ký tự.");

            if (staff.DuongDanAnh != null)
                ValidateImage(staff.DuongDanAnh);

            var isDuplicate = await _context.NhanViens.AnyAsync(n =>
                n.NgayXoa == null && (
                    n.Email == staff.Email ||
                    n.SoDienThoai == staff.SoDienThoai ||
                    n.Cccd == staff.Cccd
                ));
            if (isDuplicate)
                throw new Exception("Email, số điện thoại hoặc CCCD đã tồn tại.");

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var entity = new NhanVien
                {
                    HoTen = staff.HoTen!,
                    GioiTinh = staff.GioiTinh,
                    Email = staff.Email!,
                    MatKhau = BCrypt.Net.BCrypt.HashPassword(staff.Matkhau),
                    SoDienThoai = staff.SoDienThoai!,
                    DiaChi = staff.DiaChi,
                    NgaySinh = staff.NgaySinh,
                    Cccd = staff.Cccd,
                    TrangThai = staff.TrangThai ?? 1,
                    MaVaiTro = staff.MaVaiTro,
                    NgayTao = DateTime.UtcNow
                };

                _context.NhanViens.Add(entity);
                await _context.SaveChangesAsync();

                if (staff.DuongDanAnh != null)
                {
                    entity.DuongDanAnh = await SaveImageAsync(staff.DuongDanAnh, entity.MaNhanVien, entity.HoTen);
                    await _context.SaveChangesAsync();
                }

                await transaction.CommitAsync();


                await _logService.LoggingAsync(new LogDTO
                {
                    LoaiTaiKhoan = AccountTypeDTO.NhanVien,
                    Email = _currentUserService.GetEmail(),
                    MaTaiKhoan = _currentUserService.GetUserId() ?? 0,
                    TenHanhDong = ActionLogDTO.Tao,
                    TenBangTacDong = TableNameDTO.NhanVien,
                    MaDoiTuong = entity.MaNhanVien,
                    GiaTriSau = new
                    {
                        entity.HoTen,
                        entity.Email,
                        entity.SoDienThoai,
                        entity.Cccd,
                        entity.MaVaiTro,
                        entity.TrangThai
                    }
                });

                var tenVaiTro = await _context.VaiTros
                    .Where(v => v.MaVaiTro == entity.MaVaiTro)
                    .Select(v => v.TenVaiTro)
                    .FirstOrDefaultAsync() ?? "";

                return new StaffResponseDTO
                {
                    MaNhanVien = entity.MaNhanVien,
                    HoTen = entity.HoTen,
                    Email = entity.Email,
                    GioiTinh = entity.GioiTinh,
                    SoDienThoai = entity.SoDienThoai,
                    DuongDanAnh = entity.DuongDanAnh,
                    DiaChi = entity.DiaChi,
                    Cccd = entity.Cccd,
                    NgaySinh = entity.NgaySinh ?? DateTime.MinValue,
                    TrangThai = entity.TrangThai,
                    MaVaiTro = entity.MaVaiTro,
                    TenVaiTro = tenVaiTro,
                    NgayTao = entity.NgayTao
                };
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<StaffResponseDTO?> UpdateAsync(int id, StaffDTO staff)
        {
            ValidateStaffDTO(staff);

            if (staff.DuongDanAnh != null)
                ValidateImage(staff.DuongDanAnh);

            // FIX: thêm check NgayXoa == null
            var entity = await _context.NhanViens
                .FirstOrDefaultAsync(x => x.MaNhanVien == id && x.NgayXoa == null);

            if (entity == null)
                throw new Exception("Không tìm thấy nhân viên.");

            var isDuplicate = await _context.NhanViens.AnyAsync(n =>
                n.NgayXoa == null &&
                n.MaNhanVien != id && (
                    n.Email == staff.Email ||
                    n.SoDienThoai == staff.SoDienThoai ||
                    n.Cccd == staff.Cccd
                ));
            if (isDuplicate)
                throw new Exception("Email, số điện thoại hoặc CCCD đã tồn tại.");

            var oldData = new
            {
                entity.HoTen,
                entity.Email,
                entity.SoDienThoai,
                entity.Cccd,
                entity.DiaChi,
                entity.GioiTinh,
                entity.MaVaiTro,
                entity.TrangThai
            };

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                entity.HoTen = staff.HoTen ?? entity.HoTen;
                entity.Email = staff.Email ?? entity.Email;
                entity.GioiTinh = staff.GioiTinh;
                entity.SoDienThoai = staff.SoDienThoai ?? entity.SoDienThoai;
                entity.DiaChi = staff.DiaChi ?? entity.DiaChi;
                entity.Cccd = staff.Cccd ?? entity.Cccd;
                entity.NgaySinh = staff.NgaySinh;
                entity.TrangThai = staff.TrangThai ?? entity.TrangThai;
                entity.MaVaiTro = staff.MaVaiTro;
                entity.NgayCapNhat = DateTime.UtcNow;

                if (!string.IsNullOrWhiteSpace(staff.Matkhau))
                {
                    if (staff.Matkhau.Length < 6)
                        throw new Exception("Mật khẩu phải có ít nhất 6 ký tự.");
                    entity.MatKhau = BCrypt.Net.BCrypt.HashPassword(staff.Matkhau);
                }

                string? oldImagePath = null;

                if (staff.DuongDanAnh != null)
                {
                    oldImagePath = entity.DuongDanAnh;
                    entity.DuongDanAnh = await SaveImageAsync(staff.DuongDanAnh, entity.MaNhanVien, entity.HoTen);
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();


                if (oldImagePath != null)
                    DeletePhysicalImage(oldImagePath);


                await _logService.LoggingAsync(new LogDTO
                {
                    LoaiTaiKhoan = AccountTypeDTO.NhanVien,
                    Email = _currentUserService.GetEmail(),
                    MaTaiKhoan = _currentUserService.GetUserId() ?? 0,
                    TenHanhDong = ActionLogDTO.CapNhat,
                    TenBangTacDong = TableNameDTO.NhanVien,
                    MaDoiTuong = entity.MaNhanVien,
                    GiaTriTruoc = oldData,
                    GiaTriSau = new
                    {
                        entity.HoTen,
                        entity.Email,
                        entity.SoDienThoai,
                        entity.Cccd,
                        entity.DiaChi,
                        entity.GioiTinh,
                        entity.MaVaiTro,
                        entity.TrangThai
                    }
                });

                var tenVaiTro = await _context.VaiTros
                    .Where(v => v.MaVaiTro == entity.MaVaiTro)
                    .Select(v => v.TenVaiTro)
                    .FirstOrDefaultAsync() ?? "";

                return new StaffResponseDTO
                {
                    MaNhanVien = entity.MaNhanVien,
                    HoTen = entity.HoTen,
                    Email = entity.Email,
                    GioiTinh = entity.GioiTinh,
                    SoDienThoai = entity.SoDienThoai,
                    DuongDanAnh = entity.DuongDanAnh,
                    DiaChi = entity.DiaChi,
                    Cccd = entity.Cccd,
                    NgaySinh = entity.NgaySinh ?? DateTime.MinValue,
                    TrangThai = entity.TrangThai,
                    MaVaiTro = entity.MaVaiTro,
                    TenVaiTro = tenVaiTro,
                    NgayTao = entity.NgayTao,
                    NgayCapNhat = entity.NgayCapNhat
                };
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {

            var entity = await _context.NhanViens
                .FirstOrDefaultAsync(x => x.MaNhanVien == id && x.NgayXoa == null);

            if (entity == null)
                throw new Exception("Không tìm thấy nhân viên.");

            if (entity.TrangThai == 2 || entity.TrangThai == 3)
                throw new Exception("Không xóa được nhân viên vì còn đang làm việc.");

            var oldData = new
            {
                entity.MaNhanVien,
                entity.HoTen,
                entity.Email,
                entity.MaVaiTro,
                entity.TrangThai
            };

            entity.NgayXoa = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            await _logService.LoggingAsync(new LogDTO
            {
                LoaiTaiKhoan = AccountTypeDTO.NhanVien,
                Email = _currentUserService.GetEmail(),
                MaTaiKhoan = _currentUserService.GetUserId() ?? 0,
                TenHanhDong = ActionLogDTO.Xoa,
                TenBangTacDong = TableNameDTO.NhanVien,
                MaDoiTuong = entity.MaNhanVien,
                GiaTriTruoc = oldData,
                GiaTriSau = new { NgayXoa = entity.NgayXoa }
            });

            return true;
        }

        public async Task<bool> UpdateStatusAsync(int maNhanVien, int trangThai)
        {
            ValidateTrangThai(trangThai);


            var staff = await _context.NhanViens
                .FirstOrDefaultAsync(x => x.MaNhanVien == maNhanVien && x.NgayXoa == null);

            if (staff == null)
                throw new Exception("Không tìm thấy nhân viên.");

            var oldStatus = staff.TrangThai;

            staff.TrangThai = trangThai;
            staff.NgayCapNhat = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            var maTaiKhoan = _currentUserService.GetUserId() ?? 0;
            Console.WriteLine(maTaiKhoan);
            await _logService.LoggingAsync(new LogDTO
            {
                LoaiTaiKhoan = AccountTypeDTO.NhanVien,
                Email = _currentUserService.GetEmail(),
                MaTaiKhoan = maTaiKhoan,
                TenHanhDong = ActionLogDTO.CapNhatTrangThai,
                TenBangTacDong = TableNameDTO.NhanVien,
                MaDoiTuong = staff.MaNhanVien,
                GiaTriTruoc = new { TrangThai = oldStatus },
                GiaTriSau = new { TrangThai = trangThai }
            });

            return true;
        }

        public async Task<bool> ResetPasswordAsync(int maNhanVien, string newPassword)
        {
            if (string.IsNullOrWhiteSpace(newPassword))
                throw new Exception("Mật khẩu không được để trống.");

            if (newPassword.Length < 6)
                throw new Exception("Mật khẩu phải có ít nhất 6 ký tự.");

            var staff = await _context.NhanViens
                .FirstOrDefaultAsync(x => x.MaNhanVien == maNhanVien && x.NgayXoa == null);

            if (staff == null)
                throw new Exception("Không tìm thấy nhân viên.");

            staff.MatKhau = BCrypt.Net.BCrypt.HashPassword(newPassword);
            staff.NgayCapNhat = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            await _logService.LoggingAsync(new LogDTO
            {
                LoaiTaiKhoan = AccountTypeDTO.NhanVien,
                Email = _currentUserService.GetEmail(),
                MaTaiKhoan = _currentUserService.GetUserId() ?? 0,
                TenHanhDong = "Đặt lại mật khẩu",
                TenBangTacDong = TableNameDTO.NhanVien,
                MaDoiTuong = staff.MaNhanVien,
                GiaTriTruoc = new { Note = "Mật khẩu cũ đã bị thay thế" },
                GiaTriSau = new { Note = "Mật khẩu đã được reset", NgayCapNhat = staff.NgayCapNhat }
            });

            return true;
        }
    }
}