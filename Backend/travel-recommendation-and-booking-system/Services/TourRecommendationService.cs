using Microsoft.EntityFrameworkCore;
using travel_recommendation_and_booking_system.Common;
using travel_recommendation_and_booking_system.Constants;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.DTOs.Tour;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Models;

namespace travel_recommendation_and_booking_system.Services
{
    public class TourRecommendationService : ITourRecommendationService
    {
        private readonly AppDbContext _context;
        private readonly IRecommendationService _recommendation;

        public TourRecommendationService(AppDbContext context, IRecommendationService recommendation)
        {
            _context = context;
            _recommendation = recommendation;
        }

        public async Task<List<TourCardDTO>> GetBestToursCardAsync(int? limit = null)
        {
            var now = DateTime.Now;
            var query = _context.Tours
                .Include(t => t.LoaiHinhTour)
                .AsNoTracking()
                .WhereVisible(now)
                .OrderByDescending(t => t.LuotDat)
                .Select(TourQueryExtensions.ToCardDTO);

            return limit is > 0 ? await query.Take(limit.Value).ToListAsync() : await query.ToListAsync();
        }

        public async Task<List<TourCardDTO>> GetLatestToursAsync(int? limit = null)
        {
            var now = DateTime.Now;
            var query = _context.Tours
                .Include(t => t.LoaiHinhTour)
                .AsNoTracking()
                .WhereVisible(now)
                .OrderByDescending(t => t.NgayTao)
                .Select(TourQueryExtensions.ToCardDTO);

            return limit is > 0 ? await query.Take(limit.Value).ToListAsync() : await query.ToListAsync();
        }

        private async Task<List<TourCardDTO>> ScorePersonalizedToursAsync(
            int userId, IReadOnlyCollection<int>? excludeTourIds, int? limit)
        {
            // THÊM: đọc điểm ML đã cache 1 lần duy nhất
            var mlScores = await _recommendation.GetCachedScoresForUserAsync(userId);

            var topPreferences = await _context.SoThichNguoiDungs
                .AsNoTracking().Where(s => s.MaNguoiDung == userId).ToListAsync();

            var locationScores = await _context.SoThichDiaDiemNguoiDungs
                .AsNoTracking().Where(s => s.MaNguoiDung == userId).ToListAsync();

            var favoriteTourIds = await _context.DanhSachYeuThichs
                .AsNoTracking().Where(y => y.MaNguoiDung == userId)
                .Select(y => y.MaTour).ToListAsync();

            var now = DateTime.Now;

            var toursQuery = _context.Tours
                .AsNoTracking()
                .Include(t => t.LoaiHinhTour)
                .Include(t => t.LichTrinhs).ThenInclude(l => l.CTLichTrinhs).ThenInclude(ct => ct.DiaDiem)
                .Include(t => t.HinhAnhTours)
                .Include(t => t.ChuyenKhoiHanhs).ThenInclude(c => c.GiaChuyens)
                .Include(t => t.DanhGias)
                .AsSplitQuery()
                .WhereVisible(now);

            if (excludeTourIds != null && excludeTourIds.Count > 0)
                toursQuery = toursQuery.Where(t => !excludeTourIds.Contains(t.MaTour));

            var allTours = await toursQuery.ToListAsync();

            var result = allTours
                .Select(t => new
                {
                    Tour = t,
                    //: ưu tiên điểm ML, fallback heuristic nếu tour chưa có điểm ML
                    TotalScore = mlScores.TryGetValue(t.MaTour, out var mlScore)
                        ? mlScore * 10000f
                        : (favoriteTourIds.Contains(t.MaTour) ? 1000 : 0) +
                          t.LichTrinhs.SelectMany(lt => lt.CTLichTrinhs).Sum(ct =>
                              locationScores.FirstOrDefault(ls => ls.MaDiaDiem == ct.MaDiaDiem)?.DiemYeuThich ?? 0) +
                          (topPreferences.FirstOrDefault(p => p.MaLoaiTour == t.MaLoaiTour)?.DiemYeuThich ?? 0)
                })
                .OrderByDescending(x => x.TotalScore)
                .ThenByDescending(x => x.Tour.LuotDat)
                .Select(x => new TourCardDTO
                {
                    MaTour = x.Tour.MaTour,
                    TenTour = x.Tour.TenTour,
                    DuongDanAnh = x.Tour.HinhAnhTours.FirstOrDefault(a => a.AnhChinh == true)?.DuongDanAnh ?? "default-image.jpg",
                    Ngay = x.Tour.Ngay,
                    Dem = x.Tour.Dem,
                    slug = x.Tour.Slug,
                    DiemDen = x.Tour.LichTrinhs.SelectMany(l => l.CTLichTrinhs)
                        .Select(ct => ct.DiaDiem.TenDiaDiem).FirstOrDefault() ?? "Đang cập nhật",
                    GiaChuyen = x.Tour.ChuyenKhoiHanhs.SelectMany(c => c.GiaChuyens)
                        .Min(g => (decimal?)g.GiaNguoiLon) ?? 0,
                    DiemDanhGia = x.Tour.DanhGias.Any()
                        ? Math.Round(x.Tour.DanhGias.Average(d => (double)d.DiemDanhGia), 1) : 0,
                    SoLuongDanhGia = x.Tour.DanhGias.Count(),
                    IsFavorite = favoriteTourIds.Contains(x.Tour.MaTour),
                    LuotDat = x.Tour.LuotDat,
                    MaLoaiTour = x.Tour.MaLoaiTour,
                    TenLoaiTour = x.Tour.LoaiHinhTour != null ? x.Tour.LoaiHinhTour.TenLoaiTour : null
                })
                .ToList();

            return limit is > 0 ? result.Take(limit.Value).ToList() : result;
        }

        public Task<List<TourCardDTO>> GetTourDesignJustForYouAsync(int userId, int? limit = null)
            => ScorePersonalizedToursAsync(userId, excludeTourIds: null, limit);

        public async Task<List<TourCardDTO>> GetRecommendedToursAsync(int userId, int? limit = null)
        {
            var viewedTourIds = await _context.TrangThaiTuongTacs
                .Where(t => t.MaNguoiDung == userId && t.DaXemChiTiet)
                .Select(t => t.MaTour)
                .ToListAsync();

            return await ScorePersonalizedToursAsync(userId, viewedTourIds, limit);
        }

        public async Task<List<TourCardDTO>> GetNextTripSuggestionsAsync(int userId, int? limit = null)
        {
            var recentTypeIds = await _context.SoThichNguoiDungs
                .AsNoTracking().Where(s => s.MaNguoiDung == userId)
                .OrderByDescending(s => s.NgayCapNhat)
                .Take(3)
                .Select(s => s.MaLoaiTour)
                .ToListAsync();

            var tourDaDatIds = await _context.DonDatTours
                .AsNoTracking().Where(d => d.MaNguoiDung == userId)
                .Select(d => d.ChuyenKhoiHanh.MaTour)
                .Distinct()
                .ToListAsync();

            var now = DateTime.Now;
            var query = _context.Tours
                .Include(t => t.LoaiHinhTour)
                .AsNoTracking()
                .WhereVisible(now)
                .Where(t => !tourDaDatIds.Contains(t.MaTour))
                .OrderByDescending(t => recentTypeIds.Contains(t.MaLoaiTour))
                .ThenByDescending(t => t.LuotDat)
                .ThenByDescending(t => t.NgayTao)
                .Take(limit ?? 8)
                .Select(TourQueryExtensions.ToCardDTO);

            return await query.ToListAsync();
        }

        public async Task TrackViewTourAsync(int userId, int tourId)
        {
            var interaction = await _context.TrangThaiTuongTacs
                .FirstOrDefaultAsync(t => t.MaNguoiDung == userId && t.MaTour == tourId);

            if (interaction == null)
            {
                _context.TrangThaiTuongTacs.Add(new TrangThaiTuongTac
                {
                    MaNguoiDung = userId,
                    MaTour = tourId,
                    DaXemChiTiet = true
                });
                await _recommendation.UpdatePreference(userId, tourId, RecommendationWeights.ViewTour, true);
            }
            else if (!interaction.DaXemChiTiet)
            {
                interaction.DaXemChiTiet = true;
                await _recommendation.UpdatePreference(userId, tourId, RecommendationWeights.ViewTour, true);
            }

            await _context.SaveChangesAsync();
        }

        public async Task TrackDeepInterestAsync(int userId, int tourId)
        {
            var interaction = await _context.TrangThaiTuongTacs
                .FirstOrDefaultAsync(t => t.MaNguoiDung == userId && t.MaTour == tourId);

            if (interaction == null)
            {
                _context.TrangThaiTuongTacs.Add(new TrangThaiTuongTac
                {
                    MaNguoiDung = userId,
                    MaTour = tourId,
                    DaXemChiTiet = true,
                    DaQuanTamLau = true
                });
                await _recommendation.UpdatePreference(userId, tourId, RecommendationWeights.ConfirmInterest, true);
            }
            else if (!interaction.DaQuanTamLau)
            {
                interaction.DaQuanTamLau = true;
                await _recommendation.UpdatePreference(userId, tourId, RecommendationWeights.ConfirmInterest, true);
            }

            await _context.SaveChangesAsync();
        }
    }
}