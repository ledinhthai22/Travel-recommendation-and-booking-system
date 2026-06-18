using DTOs.Page;
using Microsoft.EntityFrameworkCore;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.DTOs.Banner;
using travel_recommendation_and_booking_system.DTOs.TypeLocation;
using travel_recommendation_and_booking_system.DTOs.TypeTour;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Models;
using travelrecommendationandbookingsystem.Migrations;

namespace Services
{
    public class TypeTourService:ITypeTour
    {
        private readonly AppDbContext _context;
        public TypeTourService(AppDbContext context)
        {
            _context = context;
        }
        public async Task<List<TypeTourReponseDTO>> GetAllAsync()
        {
            return await _context.LoaiHinhTours.Where(l => l.NgayXoa == null)
                .Select(l => new TypeTourReponseDTO
                {
                    MaLoaiTour = l.MaLoaiTour,
                    TenLoaiTour = l.TenLoaiTour,
                })
                .ToListAsync();
        }
        public async Task<PageDTO<TypeTourReponseDTO>> GetTypeTourAsync(int pageNumber, int pageSize, string? key, bool? status)
        {
            if (pageNumber < 1)
            {
                pageNumber = 1;
            }
            if (pageSize < 1)
            {
                pageSize = 10;
            }

            var query = _context.LoaiHinhTours.AsNoTracking().Where(b => b.NgayXoa == null);
            if (!string.IsNullOrWhiteSpace(key))
            {
                query = query.Where(n => n.TenLoaiTour.Contains(key));
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
                .Select(n => new TypeTourReponseDTO
                {
                    MaLoaiTour= n.MaLoaiTour,
                    TrangThai = n.TrangThai,
                    NgayTao = n.NgayTao,
                    NgayCapNhat = n.NgayCapNhat,
                    NgayXoa = n.NgayXoa
                })
                .ToListAsync();
            return new PageDTO<TypeTourReponseDTO>
            {
                Items = items,
                TotalItems = totalItems,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }
        public async Task<bool> CreateTypeTourAsync(TypeTourDTO typetour)
        {
            bool istytour = await _context.LoaiHinhTours.AnyAsync( x => x.TenLoaiTour.Trim().ToLower() == typetour.TenLoaiTour.Trim().ToLower() && x.NgayXoa == null);
            if (istytour) return false;
            var newtypetour = new CLoaiHinhTour
            {
                TenLoaiTour= typetour.TenLoaiTour,
                TrangThai=true,
                NgayTao= DateTime.Now,
                NgayCapNhat= DateTime.Now
            };
            _context.LoaiHinhTours.Add(newtypetour);
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> UpdateTypeTourAsync(int id, TypeTourDTO typetour)
        {
            var istypetour = await _context.LoaiHinhTours.FindAsync(id);

            if(istypetour ==null || istypetour.NgayXoa !=null) return false;

            bool isnametypetour = await _context.LoaiHinhTours.AnyAsync(x=>x.TenLoaiTour.Trim().ToLower() == typetour.TenLoaiTour.Trim().ToLower());
            if(isnametypetour) return false;

            istypetour.TenLoaiTour = typetour.TenLoaiTour;
            istypetour.TrangThai = typetour.TrangThai;
            istypetour.NgayCapNhat = DateTime.Now;

            _context.LoaiHinhTours.Update(istypetour);
            await _context.SaveChangesAsync();

            return true;
        }
        public async Task<bool> SoftDeleteTypeTourAsync(int id)
        {
            var istypetour = await _context.LoaiHinhTours.FindAsync(id);
            if(istypetour == null || istypetour.NgayXoa != null || istypetour.TrangThai == true) return false;

            istypetour.NgayXoa= DateTime.Now;

            _context.LoaiHinhTours.Update(istypetour);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
