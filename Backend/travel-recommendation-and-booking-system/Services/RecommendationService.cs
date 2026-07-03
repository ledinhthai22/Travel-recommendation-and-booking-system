using Microsoft.EntityFrameworkCore;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.Interfaces;
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

     
        public async Task UpdatePreference(int userId, int tourId, float weight, bool isAdd)
        {
            var tour = await _context.Tours
                .Include(t => t.LichTrinhs).ThenInclude(l => l.CTLichTrinhs)
                .FirstOrDefaultAsync(t => t.MaTour == tourId);
            if (tour == null) return;

            var prefsLoaiTour = await _context.SoThichNguoiDungs
                .Where(s => s.MaNguoiDung == userId).ToListAsync();

            if (isAdd)
                foreach (var p in prefsLoaiTour.Where(p => p.MaLoaiTour != tour.MaLoaiTour))
                    p.DiemYeuThich *= 0.95f;

            var prefLoaiTour = prefsLoaiTour.FirstOrDefault(s => s.MaLoaiTour == tour.MaLoaiTour);
            if (prefLoaiTour == null && isAdd)
            {
                _context.SoThichNguoiDungs.Add(new SoThichNguoiDung
                {
                    MaNguoiDung = userId,
                    MaLoaiTour = tour.MaLoaiTour,
                    DiemYeuThich = weight,
                    NgayCapNhat = DateTime.Now
                });
            }
            else if (prefLoaiTour != null)
            {
                float delta = isAdd ? weight : -weight;
                prefLoaiTour.DiemYeuThich = Math.Clamp(prefLoaiTour.DiemYeuThich + delta, 0, 10000);
                if (isAdd) prefLoaiTour.NgayCapNhat = DateTime.Now;
            }

            var prefsDiaDiem = await _context.SoThichDiaDiemNguoiDungs
                .Where(s => s.MaNguoiDung == userId).ToListAsync();

            var diaDiemIds = tour.LichTrinhs?
                .SelectMany(l => l.CTLichTrinhs ?? Enumerable.Empty<CTLichTrinh>())
                .Select(ct => ct.MaDiaDiem)
                .Where(id => id > 0)
                .Distinct()
                .ToList() ?? new List<int>();

            if (isAdd)
                foreach (var p in prefsDiaDiem.Where(p => !diaDiemIds.Contains(p.MaDiaDiem)))
                    p.DiemYeuThich *= 0.95f;

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

        // ===== Đọc điểm ML từ DB, fallback heuristic nếu chưa có =====
        public async Task<float> GetPersonalizedScoreAsync(int userId, int tourId)
        {
            var cached = await _context.TourRecommendationScores
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.MaNguoiDung == userId && s.MaTour == tourId);

            if (cached != null)
                return cached.Score;

            var loaiTourScore = await _context.SoThichNguoiDungs
                .Where(s => s.MaNguoiDung == userId)
                .Join(_context.Tours.Where(t => t.MaTour == tourId),
                      s => s.MaLoaiTour, t => t.MaLoaiTour, (s, t) => s.DiemYeuThich)
                .FirstOrDefaultAsync();

            var diaDiemScore = await _context.SoThichDiaDiemNguoiDungs
                .Where(s => s.MaNguoiDung == userId)
                .Join(_context.CTLichTrinhs.Where(ct => ct.LichTrinh.MaTour == tourId),
                      s => s.MaDiaDiem, ct => ct.MaDiaDiem, (s, ct) => s.DiemYeuThich)
                .SumAsync();

            bool isFavorite = await _context.DanhSachYeuThichs
                .AnyAsync(y => y.MaNguoiDung == userId && y.MaTour == tourId);

            return (isFavorite ? 1000 : 0) + loaiTourScore + diaDiemScore;
        }

        public async Task<Dictionary<int, float>> GetCachedScoresForUserAsync(int userId)
        {
            return await _context.TourRecommendationScores
                .AsNoTracking()
                .Where(s => s.MaNguoiDung == userId)
                .ToDictionaryAsync(s => s.MaTour, s => s.Score);
        }
    }
}