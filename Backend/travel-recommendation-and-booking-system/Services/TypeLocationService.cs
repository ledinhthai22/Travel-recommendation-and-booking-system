using Azure;
using DTOs.Contact;
using DTOs.Page;
using Microsoft.EntityFrameworkCore;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.DTOs.TypeLocation;
using travel_recommendation_and_booking_system.Interfaces;

namespace travel_recommendation_and_booking_system.Services
{
    public class TypeLocationService: ITypeLocation
    {
        private readonly AppDbContext _context;

        public TypeLocationService(AppDbContext context)
        {
            _context = context;
        }
        public async Task<List<TypeLocationReponseDTO>> GetAllAsync()
        {
            return await _context.LoaiDiaDiem.Where(l=>l.Ngayxoa==null)
                .Select(l => new TypeLocationReponseDTO
                {
                    MaLoaiDD = l.MaLoaiDiaDiem,
                    TenLoaiDD = l.TenLoaiDiaDiem,
                })
                .ToListAsync();
        }
        public async Task<PageDTO<TypeLocationReponseDTO>> getTypeLocationAsync(int pageNumber, int pageSize, string? key)
        {
            if (pageNumber < 1)
            {
                pageNumber = 1;
            }
            if (pageSize < 1)
            {
                pageSize = 10;
            }

            var query = _context.LoaiDiaDiem.Where(l => l.Ngayxoa == null).AsNoTracking();
            if (!string.IsNullOrWhiteSpace(key))
            {
                var lowerKey = key.ToLower();

                query = query.Where(l => l.TenLoaiDiaDiem.ToLower().Contains(lowerKey));
            }
            int totalItems = await query.CountAsync();

            var items = await query
                .OrderByDescending(l => l.NgayTao)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(l => new TypeLocationReponseDTO
                {
                    MaLoaiDD=l.MaLoaiDiaDiem,
                    TenLoaiDD=l.TenLoaiDiaDiem,
                    NgayTao=l.NgayTao
                }
                ).ToListAsync();

            return new PageDTO<TypeLocationReponseDTO>
            {
                Items = items,
                TotalItems = totalItems,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }
        public async Task<bool> CreateTypeLocationAsync(TypeLocationDTO dto)
        {
            try
            {
                bool exists = await _context.LoaiDiaDiem.AnyAsync(x =>
                    x.TenLoaiDiaDiem.ToLower() == dto.TenLoaiDD.Trim().ToLower()
                    && x.Ngayxoa == null);

                if (exists) return false;

                var entity = new LoaiDiaDiem
                {
                    TenLoaiDiaDiem = dto.TenLoaiDD.Trim(),
                    NgayTao = DateTime.Now,
                    NgayCapNhat = DateTime.Now
                };

                _context.LoaiDiaDiem.Add(entity);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (DbUpdateException ex)
            {
                var innerMessage = ex.InnerException?.Message;
                System.Diagnostics.Debug.WriteLine("LỖI DB CHI TIẾT: " + innerMessage);
                throw;
            }
        }

        public async Task<bool> UpdateTypeLocationAsync(int id, TypeLocationDTO dto)
        {
            var entity = await _context.LoaiDiaDiem.FindAsync(id);
            if (entity == null || entity.Ngayxoa != null) return false;

            bool exists = await _context.LoaiDiaDiem
                .AnyAsync(x => x.TenLoaiDiaDiem == dto.TenLoaiDD
                            && x.MaLoaiDiaDiem != id
                            && x.Ngayxoa == null);

            if (exists) return false;

            entity.TenLoaiDiaDiem = dto.TenLoaiDD;
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteTypeLocationAsync(int id)
        {
            var typeLDD = await _context.LoaiDiaDiem.FindAsync(id);

            if (typeLDD == null || typeLDD.Ngayxoa != null)
            {
                return false;
            }
            typeLDD.Ngayxoa = DateTime.Now;
            _context.LoaiDiaDiem.Update(typeLDD);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
