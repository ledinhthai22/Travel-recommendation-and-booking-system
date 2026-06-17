using DTOs.Page;
using Microsoft.EntityFrameworkCore;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.DTOs.Amenities;
using travel_recommendation_and_booking_system.DTOs.Hotel;
using travel_recommendation_and_booking_system.DTOs.ImageHotel;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Models;

namespace travel_recommendation_and_booking_system.Services
{
    public class HotelService : IHotelService
    {
        private readonly AppDbContext _context;

        public HotelService(AppDbContext context)
        {
            _context = context;
        }
        public async Task<PageDTO<HotelResponseDTO>> GetPagedHotelAsync(int pageNumber, int pageSize, HotelDTO hotel)
        {
            pageNumber = pageNumber < 1 ? 1 : pageNumber;
            pageSize = pageSize < 1 ? 10 : pageSize;

            var query = _context.KhachSans
                .Include(x => x.HinhAnhSKs)
                .AsNoTracking()
                .Where(x => x.NgayXoa == null);
            if (!string.IsNullOrWhiteSpace(hotel?.TenKhachSan))
                query = query.Where(x => x.TenKhachSan.Contains(hotel.TenKhachSan));

            if (!string.IsNullOrWhiteSpace(hotel?.DiaChi))
                query = query.Where(x => x.DiaChi.Contains(hotel.DiaChi));

            if (!string.IsNullOrWhiteSpace(hotel?.SoDienThoai))
                query = query.Where(x => x.SoDienThoai.Contains(hotel.SoDienThoai));

            if (hotel?.TrangThai != null)
                query = query.Where(x => x.TrangThai == hotel.TrangThai);
            if (hotel?.SoSao != null)
            {
                query = query.Where(x => x.SoSao == hotel.SoSao);
            }

            var totalItems = await query.CountAsync();

            var items = await query
                .OrderByDescending(x => x.NgayTao)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(x => new HotelResponseDTO
                {
                    MaKhachSan = x.MaKhachSan,
                    TenKhachSan = x.TenKhachSan,
                    MoTa = x.MoTa,
                    SoSao = x.SoSao,
                    DiaChi = x.DiaChi,
                    SoDienThoai = x.SoDienThoai,
                    TrangThai = x.TrangThai,
                    NgayTao = x.NgayTao,

                    HinhAnh = x.HinhAnhSKs.Select(img => new ImageHotelDTO
                    {
                        MaAnhSK = img.MaAnhSK,
                        DuongDanAnh = img.DuongDanAnh,
                        AnhChinh = img.AnhChinh,
                        SoThuTu = img.SoThuTu
                    }).ToList(),
                })
                .AsNoTracking()
                .ToListAsync();

            return new PageDTO<HotelResponseDTO>
            {
                Items = items,
                TotalItems = totalItems,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }
        public async Task<HotelResponseDTO?> GetHotelByIdAsync(int id)
        {
            var hotel = await _context.KhachSans
                .AsNoTracking()
                .Include(x => x.HinhAnhSKs)
                .Include(x => x.KS_TNs)
                    .ThenInclude(x => x.TienNghi)
                .FirstOrDefaultAsync(x => x.MaKhachSan == id && x.NgayXoa == null);

            if (hotel == null) return null;

            return new HotelResponseDTO
            {
                MaKhachSan = hotel.MaKhachSan,
                TenKhachSan = hotel.TenKhachSan,
                SoSao = hotel.SoSao,
                DiaChi = hotel.DiaChi,
                SoDienThoai = hotel.SoDienThoai,
                MoTa = hotel.MoTa,
                TrangThai = hotel.TrangThai,
                NgayTao = hotel.NgayTao,
                NgayCapNhat = hotel.NgayCapNhat,

                HinhAnh = hotel.HinhAnhSKs.Select(img => new ImageHotelDTO
                {
                    MaAnhSK = img.MaAnhSK,
                    DuongDanAnh = img.DuongDanAnh,
                    AnhChinh = img.AnhChinh,
                    SoThuTu = img.SoThuTu
                }).ToList(),

                TienNghi = hotel.KS_TNs.Select(tn => new AmenitiesDTO
                {
                    MaTienNghi = tn.MaTienNghi,
                    TenTienNghi = tn.TienNghi.TenTienNghi
                }).ToList()
            };
        }
        public async Task<int> CreateHotelAsync(CreateHotelDTO hotel, List<IFormFile> images)
        {

            var existedHotel = await _context.KhachSans.AnyAsync(x => x.NgayXoa == null && x.TenKhachSan.Trim().ToLower() == hotel.TenKhachSan.Trim().ToLower() && x.DiaChi.Trim().ToLower() == hotel.DiaChi.Trim().ToLower());


            if (existedHotel)
            {
                throw new Exception("Khách sạn đã tồn tại");
            }

            ValidateHotel(hotel);

            var enities = new KhachSan
            {
                TenKhachSan = hotel.TenKhachSan,
                SoSao = hotel.SoSao,
                DiaChi = hotel.DiaChi,
                SoDienThoai = hotel.SoDienThoai,
                MoTa = hotel.MoTa,
                TrangThai = hotel.TrangThai,
                NgayTao = DateTime.Now,
            };

            _context.KhachSans.Add(enities);
            await _context.SaveChangesAsync();

            await UploadImagesAsync(enities.MaKhachSan, hotel.TenKhachSan, images);

            if (hotel.MaTienNghi != null && hotel.MaTienNghi.Count > 0)
            {
                foreach (var maTN in hotel.MaTienNghi)
                {
                    _context.KS_TNs.Add(new KS_TN
                    {
                        MaKhachSan = enities.MaKhachSan,
                        MaTienNghi = maTN
                    });
                }
            }

            await _context.SaveChangesAsync();

            return enities.MaKhachSan;
        }
        public async Task<bool> UpdateStatusAsync(int id, bool status)
        {
            var entity = await _context.KhachSans
                .FirstOrDefaultAsync(x => x.MaKhachSan == id && x.NgayXoa == null);

            if (entity == null)
            {
                throw new Exception("Không tìm thấy khách sạn");
            }

            entity.TrangThai = status;
            entity.NgayCapNhat = DateTime.Now;

            await _context.SaveChangesAsync();

            return true;
        }
        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _context.KhachSans
                .FirstOrDefaultAsync(x => x.MaKhachSan == id && x.NgayXoa == null);

            if (entity == null)
            {
                throw new Exception("Không tìm thấy khách sạn");
            }
            if (entity.TrangThai)
            {
                throw new Exception("Chỉ được phép xóa các khách sạn ngưng hợp tác");
            }
            entity.NgayXoa = DateTime.Now;

            await _context.SaveChangesAsync();

            return true;
        }
        public async Task<bool> UpdateHotelAsync(int id, CreateHotelDTO hotel, List<IFormFile>? images)
        {
            var entity = await _context.KhachSans
                .Include(x => x.KS_TNs)
                .FirstOrDefaultAsync(x =>
                    x.MaKhachSan == id &&
                    x.NgayXoa == null);

            if (entity == null)
                throw new Exception("Không tìm thấy khách sạn");

            ValidateHotel(hotel);

            entity.TenKhachSan = hotel.TenKhachSan;
            entity.SoSao = hotel.SoSao;
            entity.DiaChi = hotel.DiaChi;
            entity.SoDienThoai = hotel.SoDienThoai;
            entity.MoTa = hotel.MoTa;
            entity.TrangThai = hotel.TrangThai;
            entity.NgayCapNhat = DateTime.Now;

            _context.KS_TNs.RemoveRange(entity.KS_TNs);

            if (hotel.MaTienNghi != null)
            {
                foreach (var item in hotel.MaTienNghi)
                {
                    _context.KS_TNs.Add(new KS_TN
                    {
                        MaKhachSan = id,
                        MaTienNghi = item
                    });
                }
            }

            if (images != null && images.Any())
            {
                await UploadImagesAsync(
                    id,
                    hotel.TenKhachSan,
                    images);
            }

            await _context.SaveChangesAsync();

            return true;
        }
        public async Task<bool> SetMainImageAsync(int imageId)
        {
            var image = await _context.HinhAnhSKs
                .FirstOrDefaultAsync(x => x.MaAnhSK == imageId);

            if (image == null)
                throw new Exception("Không tìm thấy ảnh");

            var images = await _context.HinhAnhSKs
                .Where(x => x.MaKhachSan == image.MaKhachSan)
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
            var image = await _context.HinhAnhSKs
                .FirstOrDefaultAsync(x => x.MaAnhSK == imageId);

            if (image == null)
                throw new Exception("Không tìm thấy ảnh");

            bool isMainImage = image.AnhChinh;
            int maKhachSan = image.MaKhachSan;

            _context.HinhAnhSKs.Remove(image);

            await _context.SaveChangesAsync();

            if (isMainImage)
            {
                var nextImage = await _context.HinhAnhSKs
                    .Where(x => x.MaKhachSan == maKhachSan)
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
        private async Task UploadImagesAsync(int maKhachSan, string tenKhachSan, List<IFormFile> images)
        {
            if (images == null || !images.Any())
                return;

            var uploadFolder = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot/img/hotel");

            if (!Directory.Exists(uploadFolder))
                Directory.CreateDirectory(uploadFolder);

            var safeName = tenKhachSan
                .Replace(" ", "_")
                .ToLower();

            bool hasMainImage = await _context.HinhAnhSKs
                .AnyAsync(x => x.MaKhachSan == maKhachSan && x.AnhChinh);

            int index = await _context.HinhAnhSKs
                .CountAsync(x => x.MaKhachSan == maKhachSan) + 1;

            foreach (var file in images)
            {
                var fileName =
                    $"{DateTime.Now:yyyyMMddHHmmssfff}_{maKhachSan}_{tenKhachSan}_{index}{Path.GetExtension(file.FileName)}";

                var fullPath = Path.Combine(uploadFolder, fileName);

                using var stream = new FileStream(fullPath, FileMode.Create);
                await file.CopyToAsync(stream);

                _context.HinhAnhSKs.Add(new HinhAnhSK
                {
                    MaKhachSan = maKhachSan,
                    DuongDanAnh = $"/img/hotel/{fileName}",
                    AnhChinh = !hasMainImage,
                    SoThuTu = index,
                    NgayTao = DateTime.Now,
                    NgayCapNhat = DateTime.Now
                });

                hasMainImage = true;
                index++;
            }
        }
        private void ValidateHotel(CreateHotelDTO hotel)
        {
            if (string.IsNullOrWhiteSpace(hotel.TenKhachSan))
                throw new Exception("Tên khách sạn không được để trống");

            if (string.IsNullOrWhiteSpace(hotel.DiaChi))
                throw new Exception("Địa chỉ không được để trống");

            if (string.IsNullOrWhiteSpace(hotel.SoDienThoai))
                throw new Exception("Số điện thoại không được để trống");

            if (string.IsNullOrWhiteSpace(hotel.MoTa))
                throw new Exception("Mô tả không được để trống");

            if (hotel.SoSao < 1 || hotel.SoSao > 5)
                throw new Exception("Số sao phải từ 1 đến 5");
        }
    }
}
