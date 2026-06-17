using DTOs.Page;
using Microsoft.EntityFrameworkCore;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.DTOs.Amenities;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Models;

namespace travel_recommendation_and_booking_system.Services
{
    public class AmenitiesService : IAmenitiesService
    {
        private readonly AppDbContext _context;

        public AmenitiesService(AppDbContext context)
        {
            _context = context;
        }
        public async Task<PageDTO<AmenitiesDTO>> GetPagedAmenitiesAsync(int pageNumber, int pageSize, AmenitiesDTO amenities)
        {
            if (pageNumber < 1)
                pageNumber = 1;

            if (pageSize < 1)
                pageSize = 10;

            var query = _context.TienNghis
            .Where(x => x.NgayXoa == null)
            .AsNoTracking();

            if (!string.IsNullOrWhiteSpace(amenities?.TenTienNghi))
            {
                var keyword = amenities.TenTienNghi.Trim().ToLower();

                query = query.Where(x =>
                    x.TenTienNghi.ToLower().Contains(keyword)
                );
            }




            int totalItems = await query.CountAsync();

            var items = await query
                .OrderByDescending(x => x.NgayTao)
                .ThenBy(x => x.MaTienNghi)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(x => new AmenitiesDTO
                {
                    MaTienNghi = x.MaTienNghi,
                    TenTienNghi = x.TenTienNghi

                })
                .ToListAsync();
            return new PageDTO<AmenitiesDTO>
            {
                Items = items,
                TotalItems = totalItems,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }
        public async Task<List<AmenitiesDTO>> GetAllAsync()
        {
            return await _context.TienNghis
                .Where(x => x.NgayXoa == null)
                .OrderBy(x => x.TenTienNghi)
                .Select(x => new AmenitiesDTO
                {
                    MaTienNghi = x.MaTienNghi,
                    TenTienNghi = x.TenTienNghi
                })
                .ToListAsync();
        }

        public async Task<AmenitiesDTO?> GetByIdAsync(int id)
        {
            return await _context.TienNghis
                .Where(x =>
                    x.MaTienNghi == id &&
                    x.NgayXoa == null)
                .Select(x => new AmenitiesDTO
                {
                    MaTienNghi = x.MaTienNghi,
                    TenTienNghi = x.TenTienNghi
                })
                .FirstOrDefaultAsync();
        }

        public async Task<int> CreateAsync(AmenitiesDTO amenities)
        {
            if (string.IsNullOrWhiteSpace(amenities.TenTienNghi))
            {
                throw new Exception("Tên tiện nghi không được để trống");
            }

            bool exists = await _context.TienNghis
                .AnyAsync(x =>
                    x.TenTienNghi == amenities.TenTienNghi &&
                    x.NgayXoa == null);

            if (exists)
            {
                throw new Exception("Tiện nghi đã tồn tại");
            }

            var entity = new TienNghi
            {
                TenTienNghi = amenities.TenTienNghi.Trim(),
                NgayTao = DateTime.Now
            };

            _context.TienNghis.Add(entity);

            await _context.SaveChangesAsync();

            return entity.MaTienNghi;
        }

        public async Task<bool> UpdateAsync(int id, AmenitiesDTO amenities)
        {
            var entity = await _context.TienNghis
                .FirstOrDefaultAsync(x =>
                    x.MaTienNghi == id &&
                    x.NgayXoa == null);

            if (entity == null)
            {
                throw new Exception("Không tìm thấy tiện nghi");
            }

            if (string.IsNullOrWhiteSpace(amenities.TenTienNghi))
            {
                throw new Exception("Tên tiện nghi không được để trống");
            }

            bool exists = await _context.TienNghis
                .AnyAsync(x =>
                    x.MaTienNghi != id &&
                    x.TenTienNghi == amenities.TenTienNghi &&
                    x.NgayXoa == null);

            if (exists)
            {
                throw new Exception("Tên tiện nghi đã tồn tại");
            }

            entity.TenTienNghi = amenities.TenTienNghi.Trim();
            entity.NgayCapNhat = DateTime.Now;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _context.TienNghis
                .FirstOrDefaultAsync(x =>
                    x.MaTienNghi == id &&
                    x.NgayXoa == null);

            if (entity == null)
            {
                throw new Exception("Không tìm thấy tiện nghi");
            }

            entity.NgayXoa = DateTime.Now;

            await _context.SaveChangesAsync();

            return true;
        }
    }
}