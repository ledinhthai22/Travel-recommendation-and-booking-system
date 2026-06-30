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
        public async Task UpdatePreference(int userId, int tourId, float weight, bool isAdd)
        {
            // 1. Lấy thông tin Tour
            var tour = await _context.Tours
                .Include(t => t.LichTrinhs).ThenInclude(l => l.CTLichTrinhs)
                .FirstOrDefaultAsync(t => t.MaTour == tourId);
            if (tour == null)
            {
                System.Diagnostics.Debug.WriteLine($"DEBUG: Không tìm thấy Tour với ID {tourId}");
                return;
            }

            // 2. XỬ LÝ LOẠI TOUR
            var prefsLoaiTour = await _context.SoThichNguoiDungs.Where(s => s.MaNguoiDung == userId).ToListAsync();

            // CHỪA LOẠI TOUR HIỆN TẠI RA: Chỉ giảm điểm các loại tour khác
            if (isAdd)
            {
                foreach (var p in prefsLoaiTour.Where(p => p.MaLoaiTour != tour.MaLoaiTour))
                {
                    p.DiemYeuThich *= 0.95f;
                }
            }

            var prefLoaiTour = prefsLoaiTour.FirstOrDefault(s => s.MaLoaiTour == tour.MaLoaiTour);
            if (prefLoaiTour == null && isAdd)
            {
                _context.SoThichNguoiDungs.Add(new SoThichNguoiDung { MaNguoiDung = userId, MaLoaiTour = tour.MaLoaiTour, DiemYeuThich = weight, NgayCapNhat = DateTime.Now });
            }
            else if (prefLoaiTour != null)
            {
                float delta = isAdd ? weight : -weight;
                prefLoaiTour.DiemYeuThich = Math.Clamp(prefLoaiTour.DiemYeuThich + delta, 0, 10000);
                if (isAdd) prefLoaiTour.NgayCapNhat = DateTime.Now; // Chỉ cập nhật ngày khi thêm
            }

            // 3. XỬ LÝ ĐỊA ĐIỂM
            var prefsDiaDiem = await _context.SoThichDiaDiemNguoiDungs.Where(s => s.MaNguoiDung == userId).ToListAsync();
            var diaDiemIds = tour.LichTrinhs?.SelectMany(l => l.CTLichTrinhs ?? Enumerable.Empty<CTLichTrinh>())
                .Select(ct => ct.MaDiaDiem).Where(id => id > 0).Distinct().ToList() ?? new List<int>();

            // CHỪA CÁC ĐỊA ĐIỂM TRONG TOUR RA: Chỉ giảm điểm các địa điểm cũ khác
            if (isAdd)
            {
                foreach (var p in prefsDiaDiem.Where(p => !diaDiemIds.Contains(p.MaDiaDiem)))
                {
                    p.DiemYeuThich *= 0.95f;
                }
            }

            foreach (var id in diaDiemIds)
            {
                var pref = prefsDiaDiem.FirstOrDefault(d => d.MaDiaDiem == id);
                if (pref == null && isAdd)
                {
                    _context.SoThichDiaDiemNguoiDungs.Add(new SoThichDiaDiemNguoiDung
                    {
                        MaNguoiDung = userId,
                        MaDiaDiem = id,
                        DiemYeuThich = weight,
                        NgayCapNhat = DateTime.Now
                    });
                }
                else if (pref != null)
                {
                    float delta = isAdd ? weight : -weight;
                    pref.DiemYeuThich = Math.Clamp(pref.DiemYeuThich + delta, 0, 10000);
                    if (isAdd) pref.NgayCapNhat = DateTime.Now;
                }
            }

            await _context.SaveChangesAsync();
        }
    }
}
