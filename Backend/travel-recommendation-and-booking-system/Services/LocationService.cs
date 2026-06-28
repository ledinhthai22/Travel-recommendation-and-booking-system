using DTOs.Page;
using Microsoft.EntityFrameworkCore;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.DTOs.Location;
using travel_recommendation_and_booking_system.Helper;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Models;

namespace travel_recommendation_and_booking_system.Services
{
    public class LocationService : ILocationService
    {
        private readonly AppDbContext _context;
        public LocationService(AppDbContext context, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;
        }
        private readonly IWebHostEnvironment _webHostEnvironment;
        public async Task<List<LocationDTO>> GetAllAsync()
        {
            return await _context.DiaDiems
                .Where(x => x.NgayXoa == null)
                .OrderBy(x => x.TenDiaDiem)
                .Select(x => new LocationDTO
                {
                    MaDiaDiem = x.MaDiaDiem,
                    TenDiaDiem = x.TenDiaDiem
                })
                .ToListAsync();
        }
        public async Task<List<LocationCardResponseDTO>> GetLocationCardsAsync(int? limit = null)
        {
            var query = _context.DiaDiems
                .AsNoTracking()
                .Where(d => d.TrangThai == true && d.NgayXoa == null)
                .Select(d => new LocationCardResponseDTO
                {
                    MaDiaDiem = d.MaDiaDiem,
                    TenDiaDiem = d.TenDiaDiem,
                    Slug = d.Slug,
                    DuongDanAnh = d.DuongDanAnh,
                    TinhThanh = d.TinhThanh,
                    MoTa = d.MoTa,
                    SoLuongTour = _context.CTLichTrinhs
                        .Where(ct => ct.MaDiaDiem == d.MaDiaDiem && ct.LichTrinh.NgayXoa == null && ct.LichTrinh.Tour.NgayXoa == null && ct.LichTrinh.Tour.TrangThai == 1)
                        .Select(ct => ct.LichTrinh.MaTour)
                        .Distinct()
                        .Count()
                })
                .OrderByDescending(x => x.SoLuongTour);

            if (limit.HasValue && limit.Value > 0)
            {
                return await query.Take(limit.Value).ToListAsync();
            }

            return await query.ToListAsync();
        }

        public async Task<List<LocationCardResponseDTO>> GetRecommendedLocationsAsync(int userId, int? limit = null)
        {
            var favoriteLocations = await _context.SoThichDiaDiemNguoiDungs
                .AsNoTracking()
                .Where(s => s.MaNguoiDung == userId)
                .OrderByDescending(s => s.DiemYeuThich)
                .ThenByDescending(s => s.NgayCapNhat)
                .Take(4)
                .ToListAsync();

            var favoriteLocationIds = favoriteLocations.Select(s => s.MaDiaDiem).ToList();

            var query = _context.DiaDiems
                .AsNoTracking()
                .Where(d => d.TrangThai == true && d.NgayXoa == null)
                .Select(d => new LocationCardResponseDTO
                {
                    MaDiaDiem = d.MaDiaDiem,
                    TenDiaDiem = d.TenDiaDiem,
                    Slug = d.Slug,
                    DuongDanAnh = d.DuongDanAnh,
                    TinhThanh = d.TinhThanh,
                    MoTa = d.MoTa,
                    SoLuongTour = d.CTLichTrinhs
                        .Where(ct => ct.LichTrinh.NgayXoa == null && ct.LichTrinh.Tour.NgayXoa == null && ct.LichTrinh.Tour.TrangThai == 1)
                        .Select(ct => ct.LichTrinh.MaTour)
                        .Distinct()
                        .Count()
                })
                .OrderByDescending(d => favoriteLocationIds.Contains(d.MaDiaDiem))
                .ThenByDescending(d => d.SoLuongTour);

            var allLocations = await query.ToListAsync();

            var result = allLocations
                .OrderByDescending(d => favoriteLocationIds.Contains(d.MaDiaDiem))
                .ThenByDescending(d => d.SoLuongTour)
                .ThenByDescending(d => {
                    var fav = favoriteLocations.FirstOrDefault(f => f.MaDiaDiem == d.MaDiaDiem);
                    return fav != null ? fav.NgayCapNhat : DateTime.MinValue;
                })
                .ToList();

            return limit.HasValue && limit.Value > 0
                ? result.Take(limit.Value).ToList()
                : result;
        }
        public async Task<PageDTO<LocationReponseDTO>> GetLocationAsync(int pageNumber, int pageSize, string? key, bool? status)
        {
            if (pageNumber < 1)
            {
                pageNumber = 1;
            }
            if (pageSize < 1)
            {
                pageSize = 10;
            }

            var query = _context.DiaDiems.AsNoTracking().Where(b => b.NgayXoa == null);
            if (!string.IsNullOrWhiteSpace(key))
            {
                query = query.Where(n => n.TenDiaDiem.Contains(key));
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
                .Select(n => new LocationReponseDTO
                {
                    MaDiaDiem = n.MaDiaDiem,
                    TenDiaDiem = n.TenDiaDiem,
                    DuongDanAnh = n.DuongDanAnh,
                    LoaiDiaDiem = n.LoaiDiaDiem,
                    MoTa = n.MoTa,
                    TinhThanh = n.TinhThanh,
                    QuocGia = n.QuocGia,
                    KhuVuc = n.KhuVuc,
                    TrangThai = n.TrangThai,
                    NgayTao = n.NgayTao,
                    NgayCapNhat = n.NgayCapNhat,
                    NgayXoa = n.NgayXoa
                })
                .ToListAsync();
            return new PageDTO<LocationReponseDTO>
            {
                Items = items,
                TotalItems = totalItems,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }
        public async Task<bool> CreateLocationAsync(LocationDTO location)
        {
            try
            {
                if (location.DuongDanAnh == null || location.DuongDanAnh.Length == 0)
                {
                    return false;
                }

                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
                var fileExtension = Path.GetExtension(location.DuongDanAnh.FileName).ToLower();

                if (!allowedExtensions.Contains(fileExtension) || !location.DuongDanAnh.ContentType.StartsWith("image/"))
                {
                    throw new Exception("File tải lên không phải là định dạng ảnh hợp lệ.");
                }

                string originalFileName = Path.GetFileName(location.DuongDanAnh.FileName);
                originalFileName = originalFileName.Replace(" ", "_");
                string timeStamp = DateTime.Now.ToString("yyyyMMddHHmmssfff");
                string uniqueId = Guid.NewGuid().ToString().Substring(0, 6);
                string newFileName = $"{timeStamp}_{uniqueId}{fileExtension}";

                string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "img", "location");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                string filePath = Path.Combine(uploadsFolder, newFileName);
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await location.DuongDanAnh.CopyToAsync(fileStream);
                }

                string dbRelativePath = $"/img/location/{newFileName}";
                var newlocation = new DiaDiem
                {
                    TenDiaDiem = location.TenDiaDiem,
                    Slug = SlugHelper.GenerateSlug(location.TenDiaDiem),
                    MoTa = location.MoTa,
                    LoaiDiaDiem = location.LoaiDiaDiem,
                    DuongDanAnh = dbRelativePath,
                    TinhThanh = location.TinhThanh,
                    QuocGia = location.QuocGia,
                    KhuVuc = location.KhuVuc,
                    TrangThai = true,
                    NgayTao = DateTime.Now,
                    NgayCapNhat = DateTime.Now
                };
                _context.DiaDiems.Add(newlocation);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                var fullError = ex.Message + (ex.InnerException != null ? " | Inner: " + ex.InnerException.Message : "");
                throw new Exception(fullError);
            }
        }
        public async Task<bool> UpdateLocationAsync(int id, LocationDTO request)
        {
            try
            {
                var location = await _context.DiaDiems.FirstOrDefaultAsync(b => b.MaDiaDiem == id && b.NgayXoa == null);

                if (location == null) return false;

                if (request.DuongDanAnh != null && request.DuongDanAnh.Length > 0)
                {
                    var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
                    var fileExtension = Path.GetExtension(request.DuongDanAnh.FileName).ToLower();

                    if (!allowedExtensions.Contains(fileExtension) || !request.DuongDanAnh.ContentType.StartsWith("image/"))
                    {
                        throw new Exception("File tải lên không phải là định dạng ảnh hợp lệ.");
                    }

                    if (!string.IsNullOrEmpty(location.DuongDanAnh))
                    {
                        string oldFilePath = Path.Combine(_webHostEnvironment.WebRootPath, location.DuongDanAnh.TrimStart('/'));
                        if (System.IO.File.Exists(oldFilePath))
                        {
                            System.IO.File.Delete(oldFilePath);
                        }
                    }

                    string timeStamp = DateTime.Now.ToString("yyyyMMddHHmmssfff");
                    string uniqueId = Guid.NewGuid().ToString().Substring(0, 6);
                    string newFileName = $"{timeStamp}_{uniqueId}{fileExtension}";

                    string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "img", "location");
                    if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

                    string filePath = Path.Combine(uploadsFolder, newFileName);
                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await request.DuongDanAnh.CopyToAsync(fileStream);
                    }

                    location.DuongDanAnh = $"/img/location/{newFileName}";
                }

                location.TenDiaDiem = request.TenDiaDiem;
                location.Slug = SlugHelper.GenerateSlug(request.TenDiaDiem);
                location.MoTa = request.MoTa;
                location.LoaiDiaDiem = request.LoaiDiaDiem;
                location.TinhThanh = request.TinhThanh;
                location.QuocGia = request.QuocGia;
                location.KhuVuc = request.KhuVuc;
                location.NgayCapNhat = DateTime.Now;
                location.TrangThai = request.TrangThai;

                _context.DiaDiems.Update(location);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi khi cập nhật địa điểm: {ex.Message}");
                return false;
            }
        }
        public async Task<bool> SoftDeleteLocationAsync(int id)
        {
            var location = await _context.DiaDiems.FindAsync(id);
            bool isUsed = await _context.CTLichTrinhs
            .AnyAsync(x => x.MaDiaDiem == id);

            if (isUsed)
            {
                throw new Exception(
                    "Địa điểm đang được sử dụng trong lịch trình tour");
            }
            if (location == null || location.NgayXoa != null || location.TrangThai == true)
            {
                return false;
            }

            location.NgayXoa = DateTime.Now;

            _context.DiaDiems.Update(location);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
