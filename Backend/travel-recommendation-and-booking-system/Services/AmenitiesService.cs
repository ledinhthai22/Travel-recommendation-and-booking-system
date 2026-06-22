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

            var query = _context.TienIches
            .Where(x => x.NgayXoa == null)
            .AsNoTracking();

            if (!string.IsNullOrWhiteSpace(amenities?.TenTienIch))
            {
                var keyword = amenities.TenTienIch.Trim().ToLower();

                query = query.Where(x =>
                    x.TenTienIch.ToLower().Contains(keyword)
                );
            }




            int totalItems = await query.CountAsync();

            var items = await query
                .OrderByDescending(x => x.NgayTao)
                .ThenBy(x => x.MaTienIch)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(x => new AmenitiesDTO
                {
                    MaTienIch = x.MaTienIch,
                    TenTienIch = x.TenTienIch

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
            return await _context.TienIches
                .Where(x => x.NgayXoa == null)
                .OrderBy(x => x.TenTienIch)
                .Select(x => new AmenitiesDTO
                {
                    MaTienIch = x.MaTienIch,
                    TenTienIch = x.TenTienIch
                })
                .ToListAsync();
        }

        public async Task<AmenitiesDTO?> GetByIdAsync(int id)
        {
            return await _context.TienIches
                .Where(x =>
                    x.MaTienIch == id &&
                    x.NgayXoa == null)
                .Select(x => new AmenitiesDTO
                {
                    MaTienIch = x.MaTienIch,
                    TenTienIch = x.TenTienIch
                })
                .FirstOrDefaultAsync();
        }

        public async Task<int> CreateAsync(AmenitiesDTO amenities)
        {
            if (string.IsNullOrWhiteSpace(amenities.TenTienIch))
            {
                throw new Exception("Tên tiện nghi không được để trống");
            }

            bool exists = await _context.TienIches
                .AnyAsync(x =>
                    x.TenTienIch == amenities.TenTienIch &&
                    x.NgayXoa == null);

            if (exists)
            {
                throw new Exception("Tiện nghi đã tồn tại");
            }

            var entity = new TienIch
            {
                TenTienIch = amenities.TenTienIch.Trim(),
                NgayTao = DateTime.Now
            };

            _context.TienIches.Add(entity);

            await _context.SaveChangesAsync();

            return entity.MaTienIch;
        }

        public async Task<bool> UpdateAsync(int id, AmenitiesDTO amenities)
        {
            var entity = await _context.TienIches
                .FirstOrDefaultAsync(x =>
                    x.MaTienIch == id &&
                    x.NgayXoa == null);

            if (entity == null)
            {
                throw new Exception("Không tìm thấy tiện nghi");
            }

            if (string.IsNullOrWhiteSpace(amenities.TenTienIch))
            {
                throw new Exception("Tên tiện nghi không được để trống");
            }

            bool exists = await _context.TienIches
                .AnyAsync(x =>
                    x.MaTienIch != id &&
                    x.TenTienIch == amenities.TenTienIch &&
                    x.NgayXoa == null);

            if (exists)
            {
                throw new Exception("Tên tiện nghi đã tồn tại");
            }

            entity.TenTienIch = amenities.TenTienIch.Trim();
            entity.NgayCapNhat = DateTime.Now;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _context.TienIches
                .FirstOrDefaultAsync(x =>
                    x.MaTienIch == id &&
                    x.NgayXoa == null);
            bool isUsed = await _context.KS_TNs.AnyAsync(x => x.MaTienIch == id);
            if (entity == null)
            {
                throw new Exception("Không tìm thấy tiện nghi");
            }
            if (isUsed)
            {
                throw new Exception("Tiện nghi đang được sử dụng, không thể xóa");
            }

            entity.NgayXoa = DateTime.Now;

            await _context.SaveChangesAsync();

            return true;
        }
    }
}