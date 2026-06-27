using DTOs.Page;
using Microsoft.EntityFrameworkCore;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.DTOs.WebInfo;
using travel_recommendation_and_booking_system.Interfaces;


namespace travel_recommendation_and_booking_system.Services
{
    public class WebInfoService : IWebInfoService
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _environment;
        public WebInfoService(AppDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }
        public async Task<PageDTO<WebInfoResponseDTO>> GetPagedWebInfoAsync(int pageNumber, int pageSize, WebinfoDTO webinfo)
        {
            if (pageNumber < 1)
                pageNumber = 1;

            if (pageSize < 1)
                pageSize = 10;

            var query = _context.TrangThongTins
                .Where(x => x.NgayXoa == null)
                .AsNoTracking();


            if (!string.IsNullOrWhiteSpace(webinfo.key))
            {
                var keyword = webinfo.key.Trim().ToLower();

                query = query.Where(x =>
                    (x.Key ?? "").ToLower().Contains(webinfo.key)
                );
            }



            if (webinfo.TrangThai.HasValue)
            {
                query = query.Where(x => x.Trangthai == webinfo.TrangThai.Value);
            }

            int totalItems = await query.CountAsync();


            var items = await query
                .OrderByDescending(x => x.NgayCapNhat)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .AsNoTracking()
                .Select(x => new WebInfoResponseDTO
                {
                    MaTTTrang = x.MaTTTrang,
                    Key = x.Key,
                    Noidung = x.Noidung ?? "",
                    Trangthai = x.Trangthai ?? false,
                    NgayCapNhat = x.NgayCapNhat ?? DateTime.Now
                })
                .ToListAsync();

            return new PageDTO<WebInfoResponseDTO>
            {
                Items = items,
                TotalItems = totalItems,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }
        public async Task<WebInfoResponseDTO?> GetWebInfoByIdAsync(int id)
        {
            var webInfo = await _context.TrangThongTins.AsNoTracking()
                .FirstOrDefaultAsync(x =>
                    x.MaTTTrang == id &&
                    x.NgayXoa == null);

            if (webInfo == null)
            {
                return null;
            }

            return new WebInfoResponseDTO
            {
                MaTTTrang = webInfo.MaTTTrang,
                Key = webInfo.Key,
                Noidung = webInfo.Noidung ?? string.Empty,
                Trangthai = webInfo.Trangthai ?? false,
                NgayCapNhat = webInfo.NgayCapNhat ?? DateTime.Now
            };
        }
        public async Task<WebInfoResponseDTO> UpdateAsync(int maTTTrang, UpdateWebInfoDTO webinfo)
        {
            var webInfo = await _context.TrangThongTins
                .FirstOrDefaultAsync(x =>
                    x.MaTTTrang == maTTTrang &&
                    x.NgayXoa == null);

            if (webInfo == null)
            {
                return null ?? new WebInfoResponseDTO();
            }


            if (webInfo.Key == "logo_url")
            {

                if (webinfo.Logo != null)
                {
                    if (!IsImage(webinfo.Logo))
                    {
                        throw new Exception("Chỉ chấp nhận file jpg, jpeg, png, webp");
                    }

                    string folderPath = Path.Combine(
                        _environment.WebRootPath,
                        "img",
                        "Logo_Trang"
                    );

                    if (!Directory.Exists(folderPath))
                    {
                        Directory.CreateDirectory(folderPath);
                    }

                    string extension = Path.GetExtension(webinfo.Logo.FileName);

                    string fileName =
                        $"{DateTime.Now:yyyyMMddHHmmss}_{webInfo.Key}{extension}";

                    string filePath = Path.Combine(folderPath, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await webinfo.Logo.CopyToAsync(stream);
                    }

                    webInfo.Noidung = $"/img/Logo_Trang/{fileName}";
                }

            }
            else
            {

                if (string.IsNullOrWhiteSpace(webinfo.NoiDung))
                {
                    throw new Exception("Nội dung không được để trống");
                }

                webInfo.Noidung = webinfo.NoiDung.Trim();
            }

            webInfo.NgayCapNhat = DateTime.Now;

            await _context.SaveChangesAsync();

            return new WebInfoResponseDTO
            {
                MaTTTrang = webInfo.MaTTTrang,
                Key = webInfo.Key,
                Noidung = webInfo.Noidung ?? string.Empty,
                Trangthai = webInfo.Trangthai ?? false,
                NgayCapNhat = webInfo.NgayCapNhat ?? DateTime.Now
            };
        }
        public async Task<bool> UpdateStatusAsync(int maTTTrang, bool trangthai)
        {
            var webInfo = await _context.TrangThongTins
                .FirstOrDefaultAsync(x =>
                    x.MaTTTrang == maTTTrang &&
                    x.NgayXoa == null);

            if (webInfo == null)
            {
                return false;
            }

            webInfo.Trangthai = trangthai;
            webInfo.NgayCapNhat = DateTime.Now;

            await _context.SaveChangesAsync();

            return true;
        }
        public async Task<bool> ClearContentAsync(int maTTTrang)
        {
            var webInfo = await _context.TrangThongTins
                .FirstOrDefaultAsync(x => x.MaTTTrang == maTTTrang);

            if (webInfo == null)
                return false;

            webInfo.Noidung = string.Empty;
            webInfo.NgayCapNhat = DateTime.Now;

            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<Dictionary<string, string?>> GetWebInfoSettingsClientAsync()
        {
            return await _context.TrangThongTins
                .Where(x =>
                    x.NgayXoa == null &&
                    (x.Trangthai ?? true))
                .ToDictionaryAsync(
                    x => x.Key,
                    x => x.Noidung
                );
        }
        private bool IsImage(IFormFile file)
        {
            string[] allowedExtensions =
            {
                ".png",
            };

            var extension = Path.GetExtension(file.FileName)
                .ToLower();

            return allowedExtensions.Contains(extension);
        }
    }
}
