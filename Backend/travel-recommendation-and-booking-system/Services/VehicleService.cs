using DTOs.Page;
using Microsoft.EntityFrameworkCore;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.DTOs.Vehicle;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Models;

namespace travel_recommendation_and_booking_system.Services
{
    public class VehicleService : IVehicleService
    {
        private readonly AppDbContext _context;
        public VehicleService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<VehicleReponseDTO>> GetAllAsync()
        {
            return await _context.PhuongTiens
                .Where(x => x.NgayXoa == null)
                .Select(x => new VehicleReponseDTO
                {
                    MaPhuongTien = x.MaPhuongTien,
                    TenPhuongTien = x.TenPhuongTien,
                    MaVietTat = x.MaVietTat,
                    Icon = x.Icon,
                    TrangThai = x.TrangThai,
                    NgayTao = x.NgayTao,
                    NgayCapNhat = x.NgayCapNhat,
                    NgayXoa = x.NgayXoa
                }).ToListAsync();
        }

        public async Task<PageDTO<VehicleReponseDTO>> GetVehicleAsync(int pageNumber, int pageSize, string? key, bool? status)
        {
            if (pageNumber < 1)
            {
                pageNumber = 1;
            }
            if (pageSize < 1)
            {
                pageSize = 10;
            }
            var query = _context.PhuongTiens.Where(x => x.NgayXoa == null);

            if (!string.IsNullOrEmpty(key))
                query = query.Where(x => x.TenPhuongTien.Contains(key));

            if (status.HasValue)
                query = query.Where(x => x.TrangThai == status.Value);

            var totalItems = await query.CountAsync();
            var items = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize)
                .Select(x => new VehicleReponseDTO
                {
                    MaPhuongTien = x.MaPhuongTien,
                    TenPhuongTien = x.TenPhuongTien,
                    Icon = x.Icon,
                    TrangThai = x.TrangThai,
                    NgayTao = x.NgayTao,
                    NgayCapNhat = x.NgayCapNhat
                }).ToListAsync();

            return new PageDTO<VehicleReponseDTO>
            {
                Items = items,
                TotalItems = totalItems,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }

        public async Task<bool> CreateVehicleAsync(VehicleDTO dto)
        {
            var entity = new PhuongTien
            {
                TenPhuongTien = dto.TenPhuongTien,
                Icon = dto.Icon,
                TrangThai = dto.TrangThai,
                NgayTao = DateTime.Now,
                NgayCapNhat = DateTime.Now
            };
            _context.PhuongTiens.Add(entity);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateVehicleAsync(int id, VehicleDTO dto)
        {
            var entity = await _context.PhuongTiens.FindAsync(id);
            if (entity == null || entity.NgayXoa != null) return false;

            entity.TenPhuongTien = dto.TenPhuongTien;
            entity.Icon = dto.Icon;
            entity.TrangThai = dto.TrangThai;
            entity.NgayCapNhat = DateTime.Now;

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> SoftDeleteVehicleAsync(int id)
        {
            var entity = await _context.PhuongTiens.FindAsync(id);
            if (entity == null || entity.NgayXoa != null || entity.TrangThai == true) return false;
            entity.NgayXoa = DateTime.Now;
            return await _context.SaveChangesAsync() > 0;
        }

    }
}
