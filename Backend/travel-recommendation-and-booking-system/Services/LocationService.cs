using DTOs.Page;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
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
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IMemoryCache _cache;

        private const string CacheVersionKey = "location:cache:version";
        private static readonly TimeSpan FeaturedCacheDuration = TimeSpan.FromMinutes(15);

        public LocationService(AppDbContext context, IWebHostEnvironment webHostEnvironment, IMemoryCache cache)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;
            _cache = cache;
        }

        private int GetCacheVersion()
        {
            return _cache.GetOrCreate(CacheVersionKey, entry =>
            {
                entry.SlidingExpiration = TimeSpan.FromDays(1);
                return 1;
            });
        }

        private void BumpCacheVersion()
        {
            var current = GetCacheVersion();
            _cache.Set(CacheVersionKey, current + 1, TimeSpan.FromDays(1));
        }

        private string VKey(string key) => $"v{GetCacheVersion()}:{key}";

        public async Task<List<LocationDTO>> GetAllAsync()
        {
            return await _context.DiaDiems
                .Where(x =>
                    x.NgayXoa == null &&
                    x.TrangThai)
                .OrderBy(x => x.TenDiaDiem)
                .Select(x => new LocationDTO
                {
                    MaDiaDiem = x.MaDiaDiem,
                    TenDiaDiem = x.TenDiaDiem
                })
                .ToListAsync();
        }
        public async Task<List<LocationDTO>> GetLocationsByProvinceAsync(string tinhThanh)
        {
            return await _context.DiaDiems
                .Where(x =>
                    x.NgayXoa == null &&
                    x.TrangThai &&
                    x.TinhThanh == tinhThanh)
                .OrderBy(x => x.TenDiaDiem)
                .Select(x => new LocationDTO
                {
                    MaDiaDiem = x.MaDiaDiem,
                    TenDiaDiem = x.TenDiaDiem
                })
                .ToListAsync();
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
            if (pageNumber < 1) pageNumber = 1;
            if (pageSize < 1 || pageSize > 100) pageSize = 10;

            var query = _context.DiaDiems
                .AsNoTracking()
                .Where(b => b.NgayXoa == null);

            if (!string.IsNullOrWhiteSpace(key))
            {
                key = key.Trim();
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
                    TrangThai = n.TrangThai,
                    NgayTao = n.NgayTao,
                    NgayCapNhat = n.NgayCapNhat,
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
                    throw new Exception(
                        "Chỉ nhận các file .jpg, .jpeg, .png, .gif, .webp"
                    );
                }
                bool existedName = await _context.DiaDiems
                    .AnyAsync(x =>
                        x.NgayXoa == null &&
                        x.TenDiaDiem.Trim().ToLower() ==
                        location.TenDiaDiem.Trim().ToLower());

                if (existedName)
                {
                    throw new Exception("Tên địa điểm đã tồn tại.");
                }
                bool existedLocation = await _context.DiaDiems
                .AnyAsync(x =>
                    x.NgayXoa == null &&
                    x.TenDiaDiem.Trim().ToLower() ==
                        location.TenDiaDiem.Trim().ToLower() &&
                    x.TinhThanh.Trim().ToLower() ==
                        location.TinhThanh.Trim().ToLower());

                if (existedLocation)
                {
                    throw new Exception(
                        "Địa điểm này đã tồn tại trong tỉnh thành được chọn"
                    );
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
                    //QuocGia = location.QuocGia,
                    //KhuVuc = location.KhuVuc,
                    TrangThai = true,
                    NgayTao = DateTime.Now,
                    NgayCapNhat = DateTime.Now
                };
                _context.DiaDiems.Add(newlocation);
                await _context.SaveChangesAsync();

                BumpCacheVersion();

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

                bool existedName = await _context.DiaDiems
                .AnyAsync(x =>
                    x.MaDiaDiem != id &&
                    x.NgayXoa == null &&
                    x.TenDiaDiem.Trim().ToLower() ==
                    request.TenDiaDiem.Trim().ToLower());

                if (existedName)
                {
                    throw new Exception("Tên địa điểm đã tồn tại.");
                }
                bool existedLocation = await _context.DiaDiems
                .AnyAsync(x =>
                    x.MaDiaDiem != id &&
                    x.NgayXoa == null &&
                    x.TenDiaDiem.Trim().ToLower() ==
                        request.TenDiaDiem.Trim().ToLower() &&
                    x.TinhThanh.Trim().ToLower() ==
                        request.TinhThanh.Trim().ToLower());

                if (existedLocation)
                {
                    throw new Exception(
                        "Địa điểm này đã tồn tại trong tỉnh thành được chọn"
                    );
                }
                if (request.DuongDanAnh != null && request.DuongDanAnh.Length > 0)
                {
                    var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
                    var fileExtension = Path.GetExtension(request.DuongDanAnh.FileName).ToLower();

                    if (!allowedExtensions.Contains(fileExtension) || !request.DuongDanAnh.ContentType.StartsWith("image/"))
                    {
                        throw new Exception("Chỉ nhận các file .jpg, .jpeg, .png, .gif, .webp"
                        );
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
                //location.QuocGia = request.QuocGia;
                //location.KhuVuc = request.KhuVuc;
                location.NgayCapNhat = DateTime.Now;
                location.TrangThai = request.TrangThai;

                _context.DiaDiems.Update(location);
                await _context.SaveChangesAsync();

                BumpCacheVersion();

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
            var location = await _context.DiaDiems
                .FirstOrDefaultAsync(x => x.MaDiaDiem == id);

            if (location == null)
            {
                throw new Exception("Không tìm thấy địa điểm.");
            }

            if (location.NgayXoa != null)
            {
                throw new Exception("Địa điểm đã được xóa trước đó.");
            }

            bool isUsed = await _context.CTLichTrinhs
                .AnyAsync(x => x.MaDiaDiem == id);

            if (isUsed)
            {
                throw new Exception(
                    "Địa điểm đang được sử dụng trong lịch trình tour."
                );
            }

            if (location.TrangThai)
            {
                throw new Exception(
                    "Vui lòng ngưng khai thác địa điểm trước khi xóa."
                );
            }

            location.NgayXoa = DateTime.Now;
            location.NgayCapNhat = DateTime.Now;

            await _context.SaveChangesAsync();

            BumpCacheVersion();

            return true;
        }
        public async Task<bool> UpdateStatusAsync(int id, bool status)
        {
            var location = await _context.DiaDiems
                .FirstOrDefaultAsync(x =>
                    x.MaDiaDiem == id &&
                    x.NgayXoa == null);

            if (location == null)
                return false;

            // Chỉ kiểm tra khi chuyển sang ngưng hoạt động
            if (status == false)
            {
                bool isUsed = await _context.CTLichTrinhs
                    .AnyAsync(x =>
                        x.MaDiaDiem == id &&
                        x.LichTrinh.NgayXoa == null);

                if (isUsed)
                {
                    throw new Exception(
                        "Địa điểm đang được sử dụng trong lịch trình tour, không thể ngưng hoạt động.");
                }
            }

            location.TrangThai = status;
            location.NgayCapNhat = DateTime.Now;

            await _context.SaveChangesAsync();

            BumpCacheVersion();

            return true;
        }



        public async Task<List<LocationCardResponseDTO>> GetFeaturedDestinationsAsync(int limit = 8)
        {
            var cacheKey = VKey($"location:featured:{limit}");
            if (_cache.TryGetValue(cacheKey, out List<LocationCardResponseDTO>? cached))
                return cached!;

            var now = DateTime.Now;

            var result = await _context.DiaDiems
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
                        .Where(ct => ct.MaDiaDiem == d.MaDiaDiem
                                  && ct.LichTrinh.NgayXoa == null
                                  && ct.LichTrinh.Tour.NgayXoa == null
                                  && ct.LichTrinh.Tour.TrangThai == 1)
                        .Select(ct => ct.LichTrinh.MaTour)
                        .Distinct()
                        .Count()
                })
                .OrderByDescending(d => d.SoLuongTour)
                .ThenByDescending(d => d.TenDiaDiem)
                .Take(limit)
                .ToListAsync();

            _cache.Set(cacheKey, result, FeaturedCacheDuration);

            return result;
        }
    }
}