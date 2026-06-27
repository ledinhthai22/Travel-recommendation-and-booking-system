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
            return await _context.DiaDiems
                .Select(d => new DestinationDTO
                {
                    TenDiemDen = d.TinhThanh,
                    SoLuongTour = d.CTLichTrinhs.Count(ct => ct.LichTrinh.Tour.TrangThai == 1),
                    Mota = d.MoTa,
                    QuocGia = d.QuocGia,
                    DuongDanAnh = d.DuongDanAnh ?? "/img/default-location.jpg"
                })
                .OrderByDescending(d => d.SoLuongTour)
                .Take(8)
                .ToListAsync();
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
