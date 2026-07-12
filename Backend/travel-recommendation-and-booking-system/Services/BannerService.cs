using DTOs.Page;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.DTOs.Banner;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Models;

namespace travel_recommendation_and_booking_system.Services
{
    public class BannerService : IBannerService
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IMemoryCache _cache;
        private readonly IBannerCacheService _cacheService;

        public BannerService(
            AppDbContext context,
            IWebHostEnvironment webHostEnvironment,
            IMemoryCache cache,
            IBannerCacheService cacheService)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;
            _cache = cache;
            _cacheService = cacheService;
        }

        public async Task<BannerResponseDTO?> GetBanner()
        {
            var cacheKey = _cacheService.ActiveKey();

            if (_cache.TryGetValue(cacheKey, out BannerResponseDTO? cachedResult))
            {
                return cachedResult;
            }

            var result = await _context.Banners
                .Where(x => x.NgayXoa == null && x.TrangThai)
                .OrderBy(x => x.NgayTao)
                .Select(n => new BannerResponseDTO
                {
                    MaBanner = n.MaBanner,
                    TieuDe = n.TieuDe,
                    DuongDanAnh = n.DuongDanAnh,
                    LinkLienKet = n.LinkLienKet,
                    TrangThai = n.TrangThai,
                    NgayTao = n.NgayTao,
                    NgayCapNhat = n.NgayCapNhat,
                    NgayXoa = n.NgayXoa
                })
                .FirstOrDefaultAsync();

            _cache.Set(cacheKey, result, TimeSpan.FromHours(6));

            return result;
        }

        public async Task<bool> CreateBannerAsync(BannerDTO banner)
        {
            try
            {
                if (banner.DuongDanAnh == null || banner.DuongDanAnh.Length == 0)
                {
                    return false;
                }

                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
                var fileExtension = Path.GetExtension(banner.DuongDanAnh.FileName).ToLower();

                if (!allowedExtensions.Contains(fileExtension) || !banner.DuongDanAnh.ContentType.StartsWith("image/"))
                {
                    throw new Exception("File tải lên không phải là định dạng ảnh hợp lệ.");
                }

                string originalFileName = Path.GetFileName(banner.DuongDanAnh.FileName);
                originalFileName = originalFileName.Replace(" ", "_");
                string timeStamp = DateTime.Now.ToString("yyyyMMddHHmmssfff");
                string uniqueId = Guid.NewGuid().ToString().Substring(0, 6);
                string newFileName = $"{timeStamp}_{uniqueId}{fileExtension}";

                string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "img", "banner");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                string filePath = Path.Combine(uploadsFolder, newFileName);
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await banner.DuongDanAnh.CopyToAsync(fileStream);
                }

                string dbRelativePath = $"/img/banner/{newFileName}";
                var newbanner = new Banner
                {
                    TieuDe = banner.TieuDe,
                    DuongDanAnh = dbRelativePath,
                    LinkLienKet = banner.LinkLienKet,
                    TrangThai = true,
                    NgayTao = DateTime.Now,
                    NgayCapNhat = DateTime.Now
                };
                _context.Banners.Add(newbanner);
                await _context.SaveChangesAsync();

                _cacheService.InvalidateLists();
                _cacheService.InvalidateActive();

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi hệ thống khi upload banner: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> UpdateBannerAsync(int id, BannerDTO request)
        {
            try
            {
                var banner = await _context.Banners.FirstOrDefaultAsync(b => b.MaBanner == id && b.NgayXoa == null);
                if (banner == null) return false;

                if (request.DuongDanAnh != null && request.DuongDanAnh.Length > 0)
                {
                    var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
                    var fileExtension = Path.GetExtension(request.DuongDanAnh.FileName).ToLower();

                    if (!allowedExtensions.Contains(fileExtension) || !request.DuongDanAnh.ContentType.StartsWith("image/"))
                    {
                        throw new Exception("File tải lên không phải là định dạng ảnh hợp lệ.");
                    }

                    if (!string.IsNullOrEmpty(banner.DuongDanAnh))
                    {
                        string oldFilePath = Path.Combine(_webHostEnvironment.WebRootPath, banner.DuongDanAnh.TrimStart('/'));
                        if (System.IO.File.Exists(oldFilePath))
                        {
                            System.IO.File.Delete(oldFilePath);
                        }
                    }

                    string timeStamp = DateTime.Now.ToString("yyyyMMddHHmmssfff");
                    string uniqueId = Guid.NewGuid().ToString().Substring(0, 6);
                    string newFileName = $"{timeStamp}_{uniqueId}{fileExtension}";

                    string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "img", "banner");
                    if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

                    string filePath = Path.Combine(uploadsFolder, newFileName);
                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await request.DuongDanAnh.CopyToAsync(fileStream);
                    }

                    banner.DuongDanAnh = $"/img/banner/{newFileName}";
                }

                banner.TieuDe = request.TieuDe;
                banner.LinkLienKet = request.LinkLienKet;
                banner.TrangThai = request.TrangThai;
                banner.NgayCapNhat = DateTime.Now;

                _context.Banners.Update(banner);
                await _context.SaveChangesAsync();

                _cacheService.InvalidateBannerDetail(id);
                _cacheService.InvalidateLists();
                _cacheService.InvalidateActive();

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi khi cập nhật banner: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> SoftDeleteBannerAsync(int id)
        {
            var banner = await _context.Banners.FindAsync(id);

            if (banner == null || banner.NgayXoa != null || banner.TrangThai == false)
            {
                return false;
            }

            banner.NgayXoa = DateTime.Now;

            _context.Banners.Update(banner);
            await _context.SaveChangesAsync();

            _cacheService.InvalidateBannerDetail(id);
            _cacheService.InvalidateLists();
            _cacheService.InvalidateActive();

            return true;
        }

        public async Task<PageDTO<BannerResponseDTO>> GetBannerAsync(int pageNumber, int pageSize, string? key, bool? status)
        {
            if (pageNumber < 1)
            {
                pageNumber = 1;
            }
            if (pageSize < 1)
            {
                pageSize = 10;
            }

            var searchKey = $"{pageNumber}_{pageSize}_{key ?? ""}_{status?.ToString() ?? "null"}";
            var cacheKey = _cacheService.ListKey(searchKey);

            if (_cache.TryGetValue(cacheKey, out PageDTO<BannerResponseDTO>? cachedResult))
            {
                return cachedResult!;
            }

            var query = _context.Banners.AsNoTracking().Where(b => b.NgayXoa == null);
            if (!string.IsNullOrWhiteSpace(key))
            {
                query = query.Where(n => n.TieuDe.Contains(key));
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
                .Select(n => new BannerResponseDTO
                {
                    MaBanner = n.MaBanner,
                    TieuDe = n.TieuDe,
                    DuongDanAnh = n.DuongDanAnh,
                    LinkLienKet = n.LinkLienKet,
                    TrangThai = n.TrangThai,
                    NgayTao = n.NgayTao,
                    NgayCapNhat = n.NgayCapNhat,
                    NgayXoa = n.NgayXoa
                })
                .ToListAsync();

            var result = new PageDTO<BannerResponseDTO>
            {
                Items = items,
                TotalItems = totalItems,
                PageNumber = pageNumber,
                PageSize = pageSize
            };

            _cache.Set(cacheKey, result, TimeSpan.FromMinutes(30));

            return result;
        }
    }
}