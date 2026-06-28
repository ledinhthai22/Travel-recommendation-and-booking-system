using DTOs.Page;
using Microsoft.EntityFrameworkCore;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.DTOs.Log;
using travel_recommendation_and_booking_system.DTOs.LogSystem;
using travel_recommendation_and_booking_system.DTOs.TypeTour;
using travel_recommendation_and_booking_system.Helper;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Models;


namespace Services
{
    public class TypeTourService : ITypeTourService
    {
        private readonly AppDbContext _context;
        private readonly ILogService _logService;
        private readonly ICurrentUserService _currentUserService;
        public TypeTourService(AppDbContext context, ILogService logService, ICurrentUserService currentUserService)
        {
            _context = context;
            _logService = logService;
            _currentUserService = currentUserService;
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
                    MaLoaiTour = n.MaLoaiTour,
                    TenLoaiTour = n.TenLoaiTour,
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
            bool istytour = await _context.LoaiHinhTours.AnyAsync(x => x.TenLoaiTour.Trim().ToLower() == typetour.TenLoaiTour.Trim().ToLower() && x.NgayXoa == null);
            if (istytour) return false;
            var newtypetour = new CLoaiHinhTour
            {
                TenLoaiTour = typetour.TenLoaiTour,
                Slug = SlugHelper.GenerateSlug(typetour.TenLoaiTour),
                TrangThai = true,
                NgayTao = DateTime.Now,
                NgayCapNhat = DateTime.Now
            };
            _context.LoaiHinhTours.Add(newtypetour);
            await _context.SaveChangesAsync();
            var currentAccount = _currentUserService.GetUserId() == 1 ? AccountTypeDTO.QuanTriVien : AccountTypeDTO.NguoiDung;
            await _logService.LoggingAsync(new LogDTO
            {
                LoaiTaiKhoan = currentAccount,

                MaTaiKhoan = _currentUserService.GetUserId() ?? 0,
                Email = _currentUserService.GetEmail(),
                TenHanhDong = ActionLogDTO.Tao,

                TenBangTacDong = TableNameDTO.LoaiHinhTour,

                MaDoiTuong = newtypetour.MaLoaiTour,

                GiaTriSau = new
                {
                    newtypetour.TenLoaiTour,
                    newtypetour.TrangThai
                }
            });
            return true;
        }
        public async Task<bool> UpdateTypeTourAsync(int id, TypeTourDTO typetour)
        {
            var istypetour = await _context.LoaiHinhTours.FindAsync(id);

            if (istypetour == null || istypetour.NgayXoa != null) return false;

            bool isnametypetour = await _context.LoaiHinhTours
            .AnyAsync(x =>
                x.TenLoaiTour.Trim().ToLower() ==
                typetour.TenLoaiTour.Trim().ToLower()
                && x.MaLoaiTour != id
                && x.NgayXoa == null);
            if (isnametypetour) return false;
            var oldData = new
            {
                istypetour.TenLoaiTour,
                istypetour.TrangThai
            };
            istypetour.TenLoaiTour = typetour.TenLoaiTour;
            istypetour.Slug = SlugHelper.GenerateSlug(typetour.TenLoaiTour);
            istypetour.TrangThai = typetour.TrangThai;
            istypetour.NgayCapNhat = DateTime.Now;

            _context.LoaiHinhTours.Update(istypetour);
            await _context.SaveChangesAsync();
            var currentAccount = _currentUserService.GetUserId() == 1 ? AccountTypeDTO.QuanTriVien : AccountTypeDTO.NguoiDung;
            await _logService.LoggingAsync(new LogDTO
            {
                LoaiTaiKhoan = currentAccount,

                MaTaiKhoan = _currentUserService.GetUserId() ?? 0,
                Email = _currentUserService.GetEmail(),
                TenHanhDong = ActionLogDTO.CapNhat,

                TenBangTacDong = TableNameDTO.LoaiHinhTour,

                MaDoiTuong = istypetour.MaLoaiTour,

                GiaTriTruoc = oldData,

                GiaTriSau = new
                {
                    istypetour.TenLoaiTour,
                    istypetour.TrangThai
                }
            });
            return true;
        }
        public async Task<bool> SoftDeleteTypeTourAsync(int id)
        {
            var istypetour = await _context.LoaiHinhTours.FindAsync(id);

            if (istypetour == null ||
                istypetour.NgayXoa != null ||
                istypetour.TrangThai == true)
                return false;
            var oldData = new
            {
                istypetour.MaLoaiTour,
                istypetour.TenLoaiTour,
                istypetour.TrangThai
            };
            istypetour.NgayXoa = DateTime.Now;

            await _context.SaveChangesAsync();
            var currentAccount = _currentUserService.GetUserId() == 1 ? AccountTypeDTO.QuanTriVien : AccountTypeDTO.NguoiDung;
            await _logService.LoggingAsync(new LogDTO
            {
                LoaiTaiKhoan = currentAccount,
                Email = _currentUserService.GetEmail(),
                MaTaiKhoan = _currentUserService.GetUserId() ?? 0,

                TenHanhDong = ActionLogDTO.Xoa,

                TenBangTacDong = TableNameDTO.LoaiHinhTour,

                MaDoiTuong = istypetour.MaLoaiTour,

                GiaTriTruoc = oldData,

                GiaTriSau = new
                {
                    istypetour.NgayXoa
                }
            });
            return true;
        }
    }
}
