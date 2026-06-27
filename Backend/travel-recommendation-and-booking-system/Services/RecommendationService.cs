using Interfaces;
using Microsoft.EntityFrameworkCore;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.DTOs.Tour;
using travel_recommendation_and_booking_system.Models;

namespace travel_recommendation_and_booking_system.Services
{
    public class RecommendationService : IRecommendationService
    {
        private readonly AppDbContext _context;

        public RecommendationService(AppDbContext context)
        {
            _context = context;
        }
        // Theo dõi hành vi người dùng
        public async Task UpdatePreference(int userId, int tourId, float weight)
        {
            var tour = await _context.Tours
                .Include(t => t.LichTrinhs).ThenInclude(l => l.CTLichTrinhs)
                .FirstOrDefaultAsync(t => t.MaTour == tourId);

            if (tour == null) return;

            // --- XỬ LÝ LOẠI HÌNH TOUR ---
            await _context.SoThichNguoiDungs
                .Where(s => s.MaNguoiDung == userId)
                .ExecuteUpdateAsync(s => s.SetProperty(p => p.DiemYeuThich, p => p.DiemYeuThich * 0.95f));

            var prefLoaiTour = await _context.SoThichNguoiDungs
                .FirstOrDefaultAsync(s => s.MaNguoiDung == userId && s.MaLoaiTour == tour.MaLoaiTour);

            if (prefLoaiTour == null)
                _context.SoThichNguoiDungs.Add(new SoThichNguoiDung
                {
                    MaNguoiDung = userId,
                    MaLoaiTour = tour.MaLoaiTour,
                    DiemYeuThich = weight,
                    NgayCapNhat = DateTime.Now
                });
            else
            {
                prefLoaiTour.DiemYeuThich = Math.Min(prefLoaiTour.DiemYeuThich + weight, 10000);
                prefLoaiTour.NgayCapNhat = DateTime.Now; // CẬP NHẬT MỐC THỜI GIAN MỚI
            }

            // --- XỬ LÝ ĐỊA ĐIỂM ---
            await _context.SoThichDiaDiemNguoiDungs
                .Where(s => s.MaNguoiDung == userId)
                .ExecuteUpdateAsync(s => s.SetProperty(p => p.DiemYeuThich, p => p.DiemYeuThich * 0.95f));

            var diaDiemIds = tour.LichTrinhs.SelectMany(l => l.CTLichTrinhs).Select(ct => ct.MaDiaDiem).Distinct();

            foreach (var diaDiemId in diaDiemIds)
            {
                var prefDiaDiem = await _context.SoThichDiaDiemNguoiDungs
                    .FirstOrDefaultAsync(d => d.MaNguoiDung == userId && d.MaDiaDiem == diaDiemId);

                if (prefDiaDiem == null)
                    _context.SoThichDiaDiemNguoiDungs.Add(new SoThichDiaDiemNguoiDung
                    {
                        MaNguoiDung = userId,
                        MaDiaDiem = diaDiemId,
                        DiemYeuThich = weight,
                        NgayCapNhat = DateTime.Now
                    });
                else
                {
                    prefDiaDiem.DiemYeuThich = Math.Min(prefDiaDiem.DiemYeuThich + weight, 10000);
                    prefDiaDiem.NgayCapNhat = DateTime.Now; // CẬP NHẬT MỐC THỜI GIAN MỚI
                }
            }

            await _context.SaveChangesAsync();
        }
    }
}
