
using DTOs.Page;
using Microsoft.EntityFrameworkCore;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.DTOs.Banner;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Models;
using static Microsoft.Extensions.Logging.EventSource.LoggingEventSource;

namespace travel_recommendation_and_booking_system.Services
{
    public class BannerService : IBannerService
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public BannerService(AppDbContext context, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;
        }

        public async Task<bool> CreateBannerAsync(BannerDTO banner)
        {
            try
            {
                if (banner.DuongDanAnh == null || banner.DuongDanAnh.Length == 0)
                {
                    return false;
                }
                // giới hạn dung lượng 10MB
                long maxfilesize = 10 * 1014 * 1014;

                string originalFileName = Path.GetFileName(banner.DuongDanAnh.FileName);
                originalFileName = originalFileName.Replace(" ", "_");

                string timeStamp = DateTime.Now.ToString("yyyyMMddHHmmssfff");
                string uniqueId = Guid.NewGuid().ToString().Substring(0, 6);

                string newFileName = $"{timeStamp}_{uniqueId}_{originalFileName}";

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
                    TieuDe=banner.TieuDe,
                    DuongDanAnh = dbRelativePath,
                    LinkLienKet = banner.LinkLienKet,
                    TrangThai = true,
                    NgayTao = DateTime.Now,
                    NgayCapNhat = DateTime.Now
                };
                _context.Banners.Add(newbanner);
                await _context.SaveChangesAsync();
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

                if (request.DuongDanAnh == null || request.DuongDanAnh.Length == 0)
                {
                    return false;
                }
                // giới hạn dung lượng 10MB
                long maxfilesize = 10 * 1014 * 1014;
                if (request.DuongDanAnh != null && request.DuongDanAnh.Length > 0)
                {

                    if (!string.IsNullOrEmpty(banner.DuongDanAnh))
                    {
                        string oldFilePath = Path.Combine(_webHostEnvironment.WebRootPath, banner.DuongDanAnh.TrimStart('/'));

                        if (System.IO.File.Exists(oldFilePath))
                        {
                            System.IO.File.Delete(oldFilePath);
                        }
                    }

                    string originalFileName = Path.GetFileName(request.DuongDanAnh.FileName).Replace(" ", "_");
                    string timeStamp = DateTime.Now.ToString("yyyyMMddHHmmssfff");
                    string uniqueId = Guid.NewGuid().ToString().Substring(0, 6);
                    string newFileName = $"{timeStamp}_{uniqueId}_{originalFileName}";

                    string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "img", "banner");
                    if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

                    string filePath = Path.Combine(uploadsFolder, newFileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await request.DuongDanAnh.CopyToAsync(fileStream);
                    }

                    banner.DuongDanAnh = $"/img/banner/{newFileName}";
                }
                banner.TieuDe=request.TieuDe;
                banner.LinkLienKet = request.LinkLienKet;
                banner.NgayCapNhat = DateTime.Now;
                _context.Banners.Update(banner);
                await _context.SaveChangesAsync();
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

            if(banner == null || banner.NgayXoa != null)
            {
                return false;
            }

            banner.TrangThai=false;
            banner.NgayXoa = DateTime.Now;

            _context.Banners.Update(banner);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<PageDTO<BannerResponseDTO>> GetBannerAsync(int pageNumber, int pageSize, string? key)
        {
            if (pageNumber < 1)
            {
                pageNumber = 1;
            }
            if (pageSize < 1)
            {
                pageSize = 10;
            }

            var query = _context.Banners.AsNoTracking().Where(b=>b.NgayXoa ==null);
            if (!string.IsNullOrWhiteSpace(key))
            {
                query = query.Where(n => n.TieuDe.Contains(key));
            }

            int totalItems = await query.CountAsync();
            var items = await query
                .OrderByDescending(n => n.NgayTao)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(n => new BannerResponseDTO
                {
                   MaBanner= n.MaBanner,
                   TieuDe= n.TieuDe,
                   DuongDanAnh= n.DuongDanAnh,
                   LinkLienKet = n.LinkLienKet,
                   TrangThai = n.TrangThai,
                   NgayTao = n.NgayTao,
                   NgayCapNhat = n.NgayCapNhat,
                   NgayXoa = n.NgayXoa
                })
                .ToListAsync();
            return new PageDTO<BannerResponseDTO>
            {
                Items = items,
                TotalItems = totalItems,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }
    }
}