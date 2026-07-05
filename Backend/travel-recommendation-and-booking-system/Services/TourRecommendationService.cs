using DTOs.Destination;
using Microsoft.EntityFrameworkCore;
using travel_recommendation_and_booking_system.Common;
using travel_recommendation_and_booking_system.Constants;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.DTOs.Destination;
using travel_recommendation_and_booking_system.DTOs.Tour;
using travel_recommendation_and_booking_system.DTOs.TypeTour;
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

        public async Task<List<TourCardResponseDTO>> GetBestToursCardAsync(int? limit = null)
        {
            var now = DateTime.Now;
            var query = _context.Tours
                .Include(t => t.LoaiHinhTour)
                .AsNoTracking()
                .WhereVisible(now)
                .OrderByDescending(t => t.LuotDat)
                .Select(TourQueryExtensions.ToCardResponseDTO);

            return limit is > 0 ? await query.Take(limit.Value).ToListAsync() : await query.ToListAsync();
        }

        public async Task<List<TourCardResponseDTO>> GetLatestToursAsync(int? limit = null)
        {
            var now = DateTime.Now;
            var query = _context.Tours
                .Include(t => t.LoaiHinhTour)
                .AsNoTracking()
                .WhereVisible(now)
                .OrderByDescending(t => t.NgayTao)
                .Select(TourQueryExtensions.ToCardResponseDTO);

            return limit is > 0 ? await query.Take(limit.Value).ToListAsync() : await query.ToListAsync();
        }

    

        private record UserPreferenceContext(
            Dictionary<int, float> MlScores,
            Dictionary<int, float> TypeScoreMap,
            Dictionary<int, float> LocationScoreMap,
            HashSet<int> FavoriteTourIds);

        private async Task<UserPreferenceContext> LoadUserPreferenceContextAsync(int userId)
        {
            var mlScores = await _recommendation.GetCachedScoresForUserAsync(userId);

            var topPreferences = await _context.SoThichNguoiDungs
                .AsNoTracking().Where(s => s.MaNguoiDung == userId).ToListAsync();

            var locationScores = await _context.SoThichDiaDiemNguoiDungs
                .AsNoTracking().Where(s => s.MaNguoiDung == userId).ToListAsync();

            var favoriteTourIds = await _context.DanhSachYeuThichs
                .AsNoTracking().Where(y => y.MaNguoiDung == userId)
                .Select(y => y.MaTour).ToListAsync();
            var typeScoreMap = topPreferences
                .GroupBy(p => p.MaLoaiTour)
                .ToDictionary(g => g.Key, g => g.First().DiemYeuThich);

            var locationScoreMap = locationScores
                .GroupBy(s => s.MaDiaDiem)
                .ToDictionary(g => g.Key, g => g.First().DiemYeuThich);

            return new UserPreferenceContext(mlScores, typeScoreMap, locationScoreMap, favoriteTourIds.ToHashSet());
        }

        private sealed class TourScoringRow
        {
            public int MaTour { get; set; }
            public int MaLoaiTour { get; set; }
            public int LuotDat { get; set; }
            public List<int> DiaDiemIds { get; set; } = new();
        }

        private async Task<List<TourScoringRow>> LoadTourScoringDataAsync(
            DateTime now, IReadOnlyCollection<int>? excludeTourIds)
        {
            var query = _context.Tours
                .AsNoTracking()
                .WhereVisible(now);

            if (excludeTourIds != null && excludeTourIds.Count > 0)
                query = query.Where(t => !excludeTourIds.Contains(t.MaTour));

            return await query
                .Select(t => new TourScoringRow
                {
                    MaTour = t.MaTour,
                    MaLoaiTour = t.MaLoaiTour,
                    LuotDat = t.LuotDat,
                    DiaDiemIds = t.LichTrinhs
                        .SelectMany(lt => lt.CTLichTrinhs)
                        .Select(ct => ct.MaDiaDiem)
                        .ToList()
                })
                .ToListAsync();
        }

        private async Task<List<TourCardResponseDTO>> HydrateTourCardsAsync(
            List<int> orderedTourIds, HashSet<int> favoriteTourIds, bool forceIsFavoriteFalse)
        {
            if (orderedTourIds.Count == 0) return new List<TourCardResponseDTO>();

            var tours = await _context.Tours
                .AsNoTracking()
                .Include(t => t.LoaiHinhTour)
                .Include(t => t.HinhAnhTours)
                .Include(t => t.ChuyenKhoiHanhs).ThenInclude(c => c.GiaChuyens)
                .Include(t => t.DanhGias)
                .AsSplitQuery()
                .Where(t => orderedTourIds.Contains(t.MaTour))
                .ToListAsync();

            var tourById = tours.ToDictionary(t => t.MaTour);

            var result = new List<TourCardResponseDTO>(orderedTourIds.Count);
            foreach (var id in orderedTourIds)
            {
                if (!tourById.TryGetValue(id, out var t)) continue;

                result.Add(new TourCardResponseDTO
                {
                    MaTour = t.MaTour,
                    TenTour = t.TenTour,
                    Slug = t.Slug,
                    MoTa = t.MoTa?.Length > 120 ? t.MoTa.Substring(0, 120) + "..." : t.MoTa,
                    Ngay = t.Ngay,
                    Dem = t.Dem,

                    GiaTu = t.ChuyenKhoiHanhs
                        .SelectMany(c => c.GiaChuyens)
                        .Select(g => (decimal?)g.GiaNguoiLon)
                        .DefaultIfEmpty(0)
                        .Min() ?? 0,

                    HinhAnhChinh = t.HinhAnhTours
                        .Where(a => a.NgayXoa == null)
                        .OrderByDescending(a => a.AnhChinh)
                        .Select(a => a.DuongDanAnh)
                        .FirstOrDefault() ?? "default-image.jpg",

                    DiemDens = t.ChuyenKhoiHanhs
                        .Where(c => c.NgayXoa == null)
                        .Select(c => c.DiemDen)
                        .Distinct()
                        .ToList(),

                    SoDanhGia = t.DanhGias.Count,
                    DiemDanhGia = t.DanhGias.Count > 0
                        ? Math.Round(t.DanhGias.Average(d => (double)d.DiemDanhGia), 1) : 0,

                    LuotDat = t.LuotDat,
                    LuotXem = t.LuotXem,
                    TenLoaiTour = t.LoaiHinhTour?.TenLoaiTour,
                    IsFavorite = !forceIsFavoriteFalse && favoriteTourIds.Contains(t.MaTour)
                });
            }

            return result;
        }

        public Task<List<TourCardResponseDTO>> GetTourDesignJustForYouAsync(int userId, int? limit = null)
            => ScorePersonalizedToursAsync(userId, excludeTourIds: null, limit);

        private async Task<List<TourCardResponseDTO>> ScorePersonalizedToursAsync(
            int userId, IReadOnlyCollection<int>? excludeTourIds, int? limit)
        {
            var prefs = await LoadUserPreferenceContextAsync(userId);
            var now = DateTime.Now;
            var scoringRows = await LoadTourScoringDataAsync(now, excludeTourIds);

            var ranked = scoringRows
                .Select(t => new
                {
                    t.MaTour,
                    t.LuotDat,
                    // ưu tiên ml train, không có fallback heuristic nếu tour chưa có điểm ML
                    TotalScore = prefs.MlScores.TryGetValue(t.MaTour, out var mlScore)
                        ? mlScore * 10000f
                        : (prefs.FavoriteTourIds.Contains(t.MaTour) ? 1000 : 0) +
                          t.DiaDiemIds.Sum(diaDiemId => prefs.LocationScoreMap.GetValueOrDefault(diaDiemId, 0)) +
                          prefs.TypeScoreMap.GetValueOrDefault(t.MaLoaiTour, 0)
                })
                .OrderByDescending(x => x.TotalScore)
                .ThenByDescending(x => x.LuotDat)
                .Select(x => x.MaTour)
                .ToList();

            var topIds = limit is > 0 ? ranked.Take(limit.Value).ToList() : ranked;

            return await HydrateTourCardsAsync(topIds, prefs.FavoriteTourIds, forceIsFavoriteFalse: false);
        }

        public async Task<List<TourCardResponseDTO>> GetRecommendedToursAsync(int userId, int? limit = null)
        {
            var viewedTourIds = await _context.TrangThaiTuongTacs
                .Where(t => t.MaNguoiDung == userId && t.DaXemChiTiet)
                .Select(t => t.MaTour)
                .ToListAsync();

            var favoriteTourIds = await _context.DanhSachYeuThichs
                .AsNoTracking().Where(y => y.MaNguoiDung == userId)
                .Select(y => y.MaTour).ToListAsync();

      
            var excludeTourIds = viewedTourIds.Union(favoriteTourIds).ToList();

            return await ScoreDiscoveryToursAsync(userId, excludeTourIds, limit);
        }

        private async Task<List<TourCardResponseDTO>> ScoreDiscoveryToursAsync(
            int userId, IReadOnlyCollection<int>? excludeTourIds, int? limit)
        {
            var prefs = await LoadUserPreferenceContextAsync(userId);
            var now = DateTime.Now;
            var scoringRows = await LoadTourScoringDataAsync(now, excludeTourIds);

            var ranked = scoringRows
                .Select(t =>
                {
                    var locationScore = t.DiaDiemIds.Sum(diaDiemId => prefs.LocationScoreMap.GetValueOrDefault(diaDiemId, 0));
                    var typeScore = prefs.TypeScoreMap.GetValueOrDefault(t.MaLoaiTour, 0);
                    var hasMlScore = prefs.MlScores.TryGetValue(t.MaTour, out var mlScore);

                
                    var totalScore = (hasMlScore ? mlScore * 100f : 0) + locationScore + typeScore;

                    return new { t.MaTour, t.LuotDat, TotalScore = totalScore };
                })
                .OrderByDescending(x => x.TotalScore)
                .ThenByDescending(x => x.LuotDat)
                .Select(x => x.MaTour)
                .ToList();

            var topIds = limit is > 0 ? ranked.Take(limit.Value).ToList() : ranked;

            return await HydrateTourCardsAsync(topIds, prefs.FavoriteTourIds, forceIsFavoriteFalse: true);
        }

        

        public async Task<List<DestinationTourDTO>> GetDestinationsForYouAsync(
            int userId, IReadOnlyCollection<int>? excludeDestinationIds = null, int? limit = null)
        {
            var destinationQuery = _context.DiaDiems
                .AsNoTracking()
                .Where(d => d.TrangThai && d.NgayXoa == null);

            if (excludeDestinationIds != null && excludeDestinationIds.Count > 0)
                destinationQuery = destinationQuery.Where(d => !excludeDestinationIds.Contains(d.MaDiaDiem));

        
            var destinations = await destinationQuery
                .Select(d => new
                {
                    d.MaDiaDiem,
                    d.TenDiaDiem,
                    d.DuongDanAnh,
                    d.MoTa,
                    SoLuongTour = d.CTLichTrinhs
                        .Where(ct => ct.LichTrinh.TrangThai && ct.LichTrinh.NgayXoa == null)
                        .Select(ct => ct.LichTrinh.MaTour)
                        .Distinct()
                        .Count()
                })
                .ToListAsync();

         
            var preferenceRows = await _context.SoThichDiaDiemNguoiDungs
                .AsNoTracking()
                .Where(s => s.MaNguoiDung == userId)
                .ToListAsync();

            var preferenceMap = preferenceRows
                .GroupBy(p => p.MaDiaDiem)
                .ToDictionary(g => g.Key, g => g.First().DiemYeuThich);

            var ranked = destinations
                .Select(d => new
                {
                    d.MaDiaDiem,
                    d.TenDiaDiem,
                    d.DuongDanAnh,
                    d.MoTa,
                    d.SoLuongTour,
                    Score = preferenceMap.GetValueOrDefault(d.MaDiaDiem, 0f)
                })
                .OrderByDescending(x => x.Score)
                .ThenByDescending(x => x.SoLuongTour)
                .ThenByDescending(x => x.MaDiaDiem)
                .Select(x => new DestinationTourDTO
                {
                    MaDiaDiem = x.MaDiaDiem,
                    TenDiaDiem = x.TenDiaDiem,
                    DuongDanAnh = x.DuongDanAnh,
                    MoTa = x.MoTa,
                    SoLuongTour = x.SoLuongTour
                })
                .ToList();

            return limit is > 0 ? ranked.Take(limit.Value).ToList() : ranked;
        }

        public async Task<List<TourCardResponseDTO>> GetNextTripSuggestionsAsync(int userId, int? limit = null)
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
                .Select(TourQueryExtensions.ToCardResponseDTO);

            return await query.ToListAsync();
        }

        private async Task UpsertInteractionAsync(
            int userId, int tourId, float weight,
            Func<TrangThaiTuongTac> createEntity,
            Func<TrangThaiTuongTac, bool> isAlreadyMarked,
            Action<TrangThaiTuongTac> markAsSet)
        {
            var interaction = await _context.TrangThaiTuongTacs
                .FirstOrDefaultAsync(t => t.MaNguoiDung == userId && t.MaTour == tourId);

            if (interaction == null)
            {
                _context.TrangThaiTuongTacs.Add(createEntity());
                await _recommendation.UpdatePreference(userId, tourId, weight, true);
            }
            else if (!isAlreadyMarked(interaction))
            {
                markAsSet(interaction);
                await _recommendation.UpdatePreference(userId, tourId, weight, true);
            }

            await _context.SaveChangesAsync();
        }

        public Task TrackViewTourAsync(int userId, int tourId)
            => UpsertInteractionAsync(userId, tourId, RecommendationWeights.ViewTour,
                createEntity: () => new TrangThaiTuongTac
                {
                    MaNguoiDung = userId,
                    MaTour = tourId,
                    DaXemChiTiet = true
                },
                isAlreadyMarked: t => t.DaXemChiTiet,
                markAsSet: t => t.DaXemChiTiet = true);

        public Task TrackDeepInterestAsync(int userId, int tourId)
            => UpsertInteractionAsync(userId, tourId, RecommendationWeights.ConfirmInterest,
                createEntity: () => new TrangThaiTuongTac
                {
                    MaNguoiDung = userId,
                    MaTour = tourId,
                    DaXemChiTiet = true,
                    DaQuanTamLau = true
                },
                isAlreadyMarked: t => t.DaQuanTamLau,
                markAsSet: t => t.DaQuanTamLau = true);
    }
}