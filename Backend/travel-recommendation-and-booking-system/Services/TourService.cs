using DTOs.Page;
using Microsoft.EntityFrameworkCore;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.DTOs.ImageTour;
using travel_recommendation_and_booking_system.DTOs.Tour;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Models;

namespace travel_recommendation_and_booking_system.Services
{
    public class TourService:ITour
    {
        private readonly AppDbContext _context;
        public TourService(AppDbContext context)
        {
            _context = context;
        }
        //thêm tour
        public async Task<int> CreateTourAsync(TourDTO tour, List<IFormFile> images)
        {
            var existedTour = await _context.Tours.AnyAsync(x => x.NgayXoa == null && x.TenTour.Trim().ToLower() == tour.TenTour.Trim().ToLower());

            if (existedTour)
                throw new Exception("Tour đã tồn tại");

            if (images != null && images.Count > 0)
            {
                ValidateImages(images);
            }

            var entity = new Tour
            {
                TenTour = tour.TenTour,
                MaLoaiTour = tour.MaLoaiTour,
                MoTa = tour.MoTa,
                ThoiGianTour = tour.ThoiGianTour,
                SoLuongToiDa = tour.SoLuongToiDa,
                DiemKhoiHanh = tour.DiemKhoiHanh,
                TrangThai = true,
                NgayTao = DateTime.Now,
                NgayCapNhat = DateTime.Now
            };

            _context.Tours.Add(entity);
            await _context.SaveChangesAsync();

            if (images != null && images.Count > 0)
            {
                await UploadImagesTourAsync(entity.MaTour,tour.TenTour, images);
            }

            return entity.MaTour;
        }

        //cập nhật tour
        public async Task<bool> UpdateTourAsync(int id, TourDTO tourDto, List<IFormFile>? images)
        {
            var entity = await _context.Tours
        .FirstOrDefaultAsync(x => x.MaTour == id && x.NgayXoa == null);

            if (entity == null)
            {
                throw new Exception("Không tìm thấy tour");
            }

            entity.TenTour = tourDto.TenTour;
            entity.MaLoaiTour = tourDto.MaLoaiTour;
            entity.MoTa = tourDto.MoTa;
            entity.TrangThai = tourDto.TrangThai;
            entity.ThoiGianTour = tourDto.ThoiGianTour;
            entity.SoLuongToiDa = tourDto.SoLuongToiDa;
            entity.DiemKhoiHanh = tourDto.DiemKhoiHanh;
            entity.NgayCapNhat = DateTime.Now;

            if (images != null && images.Any())
            {
                ValidateImages(images);

                await UploadImagesTourAsync(id, tourDto.TenTour, images);
            }
            await _context.SaveChangesAsync();

            return true;
        }
        //xóa tour
        public async Task<bool> DeleteTourAsync(int id)
        {
            var entity = await _context.Tours.FirstOrDefaultAsync(x => x.MaTour == id && x.NgayXoa == null);

            if (entity == null)
            {
                throw new Exception("Không tìm thấy tour");
            }
            if (entity.TrangThai)
            {
                throw new Exception("Chỉ được phép xóa các tour ngưng hoạt động");
            }
            entity.NgayXoa = DateTime.Now;

            await _context.SaveChangesAsync();

            return true;
        }
        // xem chi tiết
        public async Task<TourReponseDTO?> GetTourByIdAsync(int id)
        {
            var tour = await _context.Tours
                .AsNoTracking()
                .Include(x => x.HinhAnhTours)
                .Include(x => x.LoaiHinhTour)
                .FirstOrDefaultAsync(x => x.MaTour == id && x.NgayXoa == null);

            if (tour == null) return null;

            return new TourReponseDTO
            {
                MaTour = tour.MaTour,
                MaLoaiTour = tour.MaLoaiTour,
                TenTour = tour.TenTour,
                MoTa = tour.MoTa,
                ThoiGianTour = tour.ThoiGianTour,
                SoLuongToiDa = tour.SoLuongToiDa,
                LuotDat = tour.LuotDat,
                LuotXem = tour.LuotXem,
                DiemKhoiHanh = tour.DiemKhoiHanh,
                TrangThai = tour.TrangThai,
                NgayTao = tour.NgayTao,
                NgayCapNhat = tour.NgayCapNhat,
                NgayXoa = tour.NgayXoa,

                HinhAnh = tour.HinhAnhTours.Select(img => new ImageTourDTO
                {
                    MaAnhTour = img.MaAnhTour,
                    MaTour = img.MaTour,
                    DuongDanAnh = img.DuongDanAnh,
                    AnhChinh = img.AnhChinh,
                    SoThuTu = img.SoThuTu
                }).ToList()
            };
        }

        //danh sách tour
        public async Task<PageDTO<TourReponseDTO>> GetPagedTourAsync(int pageNumber, int pageSize, string key, bool? status)
        {
            pageNumber = pageNumber < 1 ? 1 : pageNumber;
            pageSize = pageSize < 1 ? 10 : pageSize;

            var query = _context.Tours
                .AsNoTracking()
                .Include(x => x.HinhAnhTours)
                .Where(x => x.NgayXoa == null);

            if (!string.IsNullOrWhiteSpace(key))
            {
                query = query.Where(x => x.TenTour.Contains(key) || x.DiemKhoiHanh.Contains(key));
            }

            if (status.HasValue)
            {
                query = query.Where(x => x.TrangThai == status.Value);
            }

            var totalItems = await query.CountAsync();

            var items = await query
                .OrderByDescending(x => x.NgayTao)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(x => new TourReponseDTO
                {
                    MaTour = x.MaTour,
                    TenTour = x.TenTour,
                    MaLoaiTour = x.MaLoaiTour,
                    MoTa = x.MoTa,
                    ThoiGianTour = x.ThoiGianTour,
                    SoLuongToiDa = x.SoLuongToiDa,
                    LuotDat = x.LuotDat,
                    LuotXem = x.LuotXem,
                    DiemKhoiHanh = x.DiemKhoiHanh,
                    TrangThai = x.TrangThai,
                    NgayTao = x.NgayTao,
                    NgayCapNhat = x.NgayCapNhat,
                    NgayXoa = x.NgayXoa,

                    HinhAnh = x.HinhAnhTours.Select(img => new ImageTourDTO
                    {
                        MaAnhTour = img.MaAnhTour,
                        MaTour = img.MaTour,
                        DuongDanAnh = img.DuongDanAnh,
                        AnhChinh = img.AnhChinh,
                        SoThuTu = img.SoThuTu
                    }).ToList()
                })
                .ToListAsync();

            return new PageDTO<TourReponseDTO>
            {
                Items = items,
                TotalItems = totalItems,
                PageNumber = pageNumber,
                PageSize = pageSize,
            };
        }


        public async Task<bool> SetMainImageAsync(int imageId)
        {
            var image = await _context.HinhAnhTours.FirstOrDefaultAsync(x => x.MaAnhTour == imageId);

            if (image == null)
                throw new Exception("Không tìm thấy ảnh");

            var images = await _context.HinhAnhTours
                .Where(x => x.MaTour == image.MaTour)
                .ToListAsync();

            foreach (var item in images)
            {
                item.AnhChinh = false;
            }

            image.AnhChinh = true;
            image.NgayCapNhat = DateTime.Now;

            await _context.SaveChangesAsync();

            return true;
        }
        public async Task<bool> DeleteImageAsync(int imageId)
        {
            var image = await _context.HinhAnhTours
                .FirstOrDefaultAsync(x => x.MaAnhTour == imageId);

            if (image == null)
                throw new Exception("Không tìm thấy ảnh");

            bool isMainImage = image.AnhChinh;
            int maTour = image.MaTour;

            _context.HinhAnhTours.Remove(image);

            await _context.SaveChangesAsync();

            if (isMainImage)
            {
                var nextImage = await _context.HinhAnhTours
                    .Where(x => x.MaTour == maTour)
                    .OrderBy(x => x.SoThuTu)
                    .FirstOrDefaultAsync();

                if (nextImage != null)
                {
                    nextImage.AnhChinh = true;
                    await _context.SaveChangesAsync();
                }
            }

            return true;
        }

        //private
        private async Task UploadImagesTourAsync(int maTour, string tenTour, List<IFormFile> images)
        {
            if (images == null || !images.Any())
                return;

            var uploadFolder = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot/img/tour");

            if (!Directory.Exists(uploadFolder))
                Directory.CreateDirectory(uploadFolder);

            bool hasMainImage = await _context.HinhAnhTours
                .AnyAsync(x => x.MaTour == maTour && x.AnhChinh);

            int index = await _context.HinhAnhTours
                .CountAsync(x => x.MaTour == maTour) + 1;

            foreach (var file in images)
            {
                var fileName = $"{DateTime.Now:yyyyMMddHHmmssfff}_{maTour}_{index}{Path.GetExtension(file.FileName)}";
                var fullPath = Path.Combine(uploadFolder, fileName);

                using var stream = new FileStream(fullPath, FileMode.Create);
                await file.CopyToAsync(stream);

                _context.HinhAnhTours.Add(new HinhAnhTour
                {
                    MaTour = maTour,
                    DuongDanAnh = $"/img/tour/{fileName}",
                    AnhChinh = !hasMainImage,
                    SoThuTu = index,
                    NgayTao = DateTime.Now,
                    NgayCapNhat = DateTime.Now
                });

                hasMainImage = true;
                index++;
            }

            await _context.SaveChangesAsync();
        }

        private void ValidateImages(List<IFormFile> images)
        {
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
            const long maxFileSize = 10 * 1024 * 1024;

            foreach (var image in images)
            {
                if (image.Length > maxFileSize)
                    throw new Exception($"Ảnh {image.FileName} vượt quá 10MB.");

                var extension = Path.GetExtension(image.FileName).ToLower();
                if (!allowedExtensions.Contains(extension))
                    throw new Exception($"Ảnh {image.FileName} không đúng định dạng (chỉ chấp nhận jpg, jpeg, png, gif).");
            }
        }
    }
}
