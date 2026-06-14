using DTOs.Staff;
using Microsoft.EntityFrameworkCore;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.DTOs;
using travel_recommendation_and_booking_system.DTOs.Staff;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Models;

namespace travel_recommendation_and_booking_system.Services
{
    public class StaffService : IStaffService
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _environment;
        public StaffService(AppDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }
        public async Task<PageDTO<StaffResponseDTO>> GetPagedStaffsAsync(int pageNumber, int pageSize, StaffDTO staff)
        {
            if (pageNumber < 1)
                pageNumber = 1;

            if (pageSize < 1)
                pageSize = 10;

            var query = _context.NguoiDungs
            .Include(x => x.VaiTro)
            .Where(n => n.NgayXoa == null && n.MaVaiTro >= 2 && n.MaVaiTro != 4)
            .OrderBy(x => x.NgayTao)
            .ThenByDescending(x => x.TrangThai)
            .AsNoTracking();


            if (!string.IsNullOrWhiteSpace(staff?.HoTen))
            {
                var keyword = staff.HoTen.Trim().ToLower();

                query = query.Where(x =>
                    (x.HoTen ?? "").ToLower().Contains(keyword) ||
                    (x.Email ?? "").ToLower().Contains(keyword) ||
                    (x.SoDienThoai ?? "").ToLower().Contains(keyword)
                );
            }


            if (staff != null && staff.TrangThai > 0)
            {
                query = query.Where(x => x.TrangThai == staff.TrangThai);
            }

            int totalItems = await query.CountAsync();

            var items = await query.Where(x => x.NgayXoa == null)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(x => new StaffResponseDTO
                {
                    MaNguoiDung = x.MaNguoiDung,
                    HoTen = x.HoTen,
                    GioiTinh = x.GioiTinh,
                    Email = x.Email,
                    SoDienThoai = x.SoDienThoai,
                    DuongDanAnh = x.DuongDanAnh,
                    DiaChi = x.DiaChi,
                    NgaySinh = x.NgaySinh!.Value,
                    TrangThai = x.TrangThai,
                    MaVaiTro = x.MaVaiTro,
                    TenVaiTro = x.VaiTro.TenVaiTro,
                    NgayTao = x.NgayTao
                })
                .OrderBy(x => x.TrangThai)
                .ThenByDescending(x => x.NgayTao)
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
            if (id <= 0)
                return null;

            var staff = await _context.NguoiDungs.AsNoTracking()
                .Where(n => n.MaNguoiDung == id && n.NgayXoa == null)
                .Select(x => new StaffResponseDTO
                {
                    MaNguoiDung = x.MaNguoiDung,
                    HoTen = x.HoTen,
                    GioiTinh = x.GioiTinh,
                    Email = x.Email,
                    SoDienThoai = x.SoDienThoai,
                    DuongDanAnh = x.DuongDanAnh,
                    DiaChi = x.DiaChi,
                    NgaySinh = x.NgaySinh!.Value,
                    TrangThai = x.TrangThai,
                    MaVaiTro = x.MaVaiTro,
                    TenVaiTro = x.VaiTro.TenVaiTro,
                    NgayTao = x.NgayTao
                })
                .FirstOrDefaultAsync();
            return staff;

        }
        public async Task<StaffResponseDTO> CreateAsync(StaffDTO staff)
        {

            var entity = new NguoiDung
            {
                HoTen = staff.HoTen ?? "",
                GioiTinh = staff.GioiTinh,
                Email = staff.Email ?? "",
                MatKhau = BCrypt.Net.BCrypt.HashPassword(staff.Matkhau ?? ""),
                SoDienThoai = staff.SoDienThoai ?? "",
                DiaChi = staff.DiaChi,
                NgaySinh = staff.NgaySinh,
                TrangThai = staff.TrangThai ?? 1,
                MaVaiTro = staff.MaVaiTro,
                NgayTao = DateTime.UtcNow
            };

            _context.NguoiDungs.Add(entity);
            await _context.SaveChangesAsync();

            if (staff.DuongDanAnh != null)
            {
                if (!IsImage(staff.DuongDanAnh))
                {
                    throw new Exception(
                        "Chỉ chấp nhận file jpg, jpeg, png, webp");
                }

                if (staff.DuongDanAnh.Length > 2 * 1024 * 1024)
                {
                    throw new Exception(
                        "Ảnh phải nhỏ hơn 2MB");
                }

                string folderPath = Path.Combine(
                    _environment.WebRootPath,
                    "img",
                    "staff"
                );

                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }

                string extension =
                    Path.GetExtension(staff.DuongDanAnh.FileName);

                string fileName =
                    $"{DateTime.Now:yyyyMMddHHmmss}_{entity.MaNguoiDung}_{entity.HoTen.Replace(" ", "")}{extension}";

                string filePath =
                    Path.Combine(folderPath, fileName);

                using (var stream = new FileStream(
                    filePath,
                    FileMode.Create))
                {
                    await staff.DuongDanAnh.CopyToAsync(stream);
                }

                entity.DuongDanAnh =
                    $"/img/staff/{fileName}";

                await _context.SaveChangesAsync();
            }
            return new StaffResponseDTO
            {
                MaNguoiDung = entity.MaNguoiDung,
                HoTen = entity.HoTen,
                Email = entity.Email,
                GioiTinh = entity.GioiTinh,
                SoDienThoai = entity.SoDienThoai,
                DuongDanAnh = entity.DuongDanAnh,
                DiaChi = entity.DiaChi,
                NgaySinh = entity.NgaySinh ?? DateTime.MinValue,
                TrangThai = entity.TrangThai,
                MaVaiTro = entity.MaVaiTro,
                TenVaiTro = (await _context.VaiTros.FindAsync(entity.MaVaiTro))
                    ?.TenVaiTro ?? "",
                NgayTao = entity.NgayTao
            };
        }

        public async Task<StaffResponseDTO?> UpdateAsync(int id, StaffDTO staff)
        {
            var entity = await _context.NguoiDungs.FindAsync(id);

            if (entity == null)
                throw new Exception("Không tìm thấy nhân viên");

            entity.HoTen = staff.HoTen ?? entity.HoTen;
            entity.Email = staff.Email ?? entity.Email;
            entity.GioiTinh = staff.GioiTinh;
            entity.SoDienThoai = staff.SoDienThoai ?? entity.SoDienThoai;
            entity.DiaChi = staff.DiaChi ?? entity.DiaChi;
            entity.NgaySinh = staff.NgaySinh;
            entity.TrangThai = staff.TrangThai ?? entity.TrangThai;
            entity.MaVaiTro = staff.MaVaiTro;
            entity.NgayCapNhat = DateTime.UtcNow;

            // Đổi mật khẩu nếu có nhập
            if (!string.IsNullOrWhiteSpace(staff.Matkhau))
            {
                entity.MatKhau =
                    BCrypt.Net.BCrypt.HashPassword(staff.Matkhau);
            }

            if (staff.DuongDanAnh != null)
            {
                if (!IsImage(staff.DuongDanAnh))
                {
                    throw new Exception(
                        "Chỉ chấp nhận file jpg, jpeg, png, webp");
                }

                if (staff.DuongDanAnh.Length > 2 * 1024 * 1024)
                {
                    throw new Exception(
                        "Ảnh phải nhỏ hơn 2MB");
                }

                // Xóa ảnh cũ
                if (!string.IsNullOrEmpty(entity.DuongDanAnh))
                {
                    string oldFilePath = Path.Combine(
                        _environment.WebRootPath,
                        entity.DuongDanAnh.TrimStart('/')
                            .Replace("/", Path.DirectorySeparatorChar.ToString())
                    );

                    if (File.Exists(oldFilePath))
                    {
                        File.Delete(oldFilePath);
                    }
                }

                string folderPath = Path.Combine(
                    _environment.WebRootPath,
                    "img",
                    "staff"
                );

                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }

                string extension =
                    Path.GetExtension(staff.DuongDanAnh.FileName);

                string fileName =
                    $"{DateTime.Now:yyyyMMddHHmmss}_{entity.MaNguoiDung}_{entity.HoTen.Replace(" ", "")}{extension}";

                string filePath =
                    Path.Combine(folderPath, fileName);

                using (var stream = new FileStream(
                    filePath,
                    FileMode.Create))
                {
                    await staff.DuongDanAnh.CopyToAsync(stream);
                }

                entity.DuongDanAnh =
                    $"/img/staff/{fileName}";
            }

            await _context.SaveChangesAsync();

            return new StaffResponseDTO
            {
                MaNguoiDung = entity.MaNguoiDung,
                HoTen = entity.HoTen,
                Email = entity.Email,
                GioiTinh = entity.GioiTinh,
                SoDienThoai = entity.SoDienThoai,
                DuongDanAnh = entity.DuongDanAnh,
                DiaChi = entity.DiaChi,
                NgaySinh = entity.NgaySinh ?? DateTime.MinValue,
                TrangThai = entity.TrangThai,
                MaVaiTro = entity.MaVaiTro,
                TenVaiTro = (await _context.VaiTros.FindAsync(entity.MaVaiTro))
                    ?.TenVaiTro ?? "",
                NgayTao = entity.NgayTao,
                NgayCapNhat = entity.NgayCapNhat
            };
        }
        public async Task<bool> DeleteAsync(int id)
        {
            var query = await _context.NguoiDungs.FindAsync(id);
            if (query == null)
                return false;
            if (query.TrangThai == 2 || query.TrangThai == 3)
            {
                throw new Exception("không xóa được nhân viên vì còn đang làm việc");
            }
            else
            {
                query.NgayXoa = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }
            return true;
        }
        public async Task<bool> UpdateStatusAsync(int maNguoiDung, int trangthai)
        {
            var staff = await _context.NguoiDungs.FindAsync(maNguoiDung);
            if (staff == null)
                return false;
            staff.TrangThai = trangthai;
            staff.NgayCapNhat = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> ResetPasswordAsync(int maNguoiDung, string newPassword)
        {
            var staff = await _context.NguoiDungs
                .FirstOrDefaultAsync(x =>
                    x.MaNguoiDung == maNguoiDung &&
                    x.NgayXoa == null);

            if (staff == null)
                return false;

            if (string.IsNullOrWhiteSpace(newPassword))
                throw new Exception("Mật khẩu không được để trống");

            if (newPassword.Length < 6)
                throw new Exception(
                    "Mật khẩu phải có ít nhất 6 ký tự");

            staff.MatKhau =
                BCrypt.Net.BCrypt.HashPassword(newPassword);

            staff.NgayCapNhat = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return true;
        }
        private bool IsImage(IFormFile file)
        {
            string[] allowedExtensions =
            {
                ".jpg",
                ".jpeg",
                ".png",
                ".webp"
            };

            string extension = Path.GetExtension(file.FileName).ToLower();

            return allowedExtensions.Contains(extension);
        }
    }
}
