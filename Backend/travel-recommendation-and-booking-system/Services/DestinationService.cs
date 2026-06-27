using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.DTOs.Destination;
using travel_recommendation_and_booking_system.Interfaces;
using Microsoft.EntityFrameworkCore;
using DTOs.Destination;

namespace travel_recommendation_and_booking_system.Services
{
    public class DestinationService : IDestinationService
    {
        private readonly AppDbContext _context;
        public DestinationService(AppDbContext context)
        {
            _context = context;
        }

        //Địa Điểm nổi bật (số lượng tour)  
        public async Task<List<DestinationDTO>> GetTopDestinationsAsync()
        {
            var listDiaDiem = await _context.DiaDiems
                .Select(d => new
                {
                    d.TinhThanh,
                    d.DuongDanAnh,
                    Count = d.CTLichTrinhs.Count(ct => ct.LichTrinh.Tour.TrangThai == 1)
                })
                .ToListAsync();
            var data = listDiaDiem
                .GroupBy(d => d.TinhThanh)
                .Select(g => new
                {
                    TinhThanh = g.Key,
                    SoLuongTour = g.Sum(x => x.Count),
                    DuongDanAnh = g.FirstOrDefault().DuongDanAnh
                })
                .OrderByDescending(x => x.SoLuongTour)
                .Take(12)
                .ToList();

            return data.Select(d => new DestinationDTO
            {
                TenDiemDen = d.TinhThanh,
                SoLuongTour = d.SoLuongTour,
                MoTa = $"Khám phá vẻ đẹp thiên nhiên và văn hóa tại {d.TinhThanh}.",
                DuongDanAnh = d.DuongDanAnh ?? "/img/default-location.jpg",
                TinhThanh = d.TinhThanh
            }).ToList();
        }

        // Địa điểm dành cho bạn
        public async Task<List<DestinationTourDTO>> GetRecommendedLocationsAsync(int userId)
        {
            // 1. Lấy danh sách địa điểm người dùng thích nhất
            var favoriteLocationIds = await _context.SoThichDiaDiemNguoiDungs
                .Where(s => s.MaNguoiDung == userId)
                .OrderByDescending(s => s.DiemYeuThich)
                .Take(8)
                .Select(s => s.MaDiaDiem)
                .ToListAsync();

            // 2. Lấy danh sách địa điểm (kết hợp sở thích + lấp đầy bằng địa điểm Hot)
            var query = _context.DiaDiems
                .Select(d => new DestinationTourDTO
                {
                    MaDiaDiem = d.MaDiaDiem,
                    TenDiaDiem = d.TinhThanh,
                    DuongDanAnh = d.DuongDanAnh,
                    MoTa = d.MoTa,
                    SoLuongTour = d.CTLichTrinhs.Count(ct => ct.LichTrinh.Tour.TrangThai == 1)
                })
                .OrderByDescending(d => favoriteLocationIds.Contains(d.MaDiaDiem))
                .ThenByDescending(d => d.SoLuongTour)
                .Take(8);

            return await query.ToListAsync();
        }
    }
}
