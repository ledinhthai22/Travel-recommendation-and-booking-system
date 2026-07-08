using DTOs.Destination;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
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
        private readonly IMemoryCache _cache;

        // Danh sách chung (không phụ thuộc user) - cache lâu hơn vì ít thay đổi
        private static readonly TimeSpan GlobalListCacheDuration = TimeSpan.FromMinutes(10);
        // Preference context của user - cache ngắn hơn vì thay đổi theo hành vi
        private static readonly TimeSpan UserPrefCacheDuration = TimeSpan.FromMinutes(5);

        private const string BestToursCacheKey = "tours:best";
        private const string LatestToursCacheKey = "tours:latest";
        private static string UserPrefCacheKey(int userId) => $"tours:userpref:{userId}";

        public TourRecommendationService(AppDbContext context, IRecommendationService recommendation, IMemoryCache cache)
        {
            _context = context;
            _recommendation = recommendation;
            _cache = cache;
        }

        public async Task<List<TourCardResponseDTO>> GetBestToursCardAsync(int? limit = null)
        {
            var cacheKey = $"{BestToursCacheKey}:{limit?.ToString() ?? "all"}";

            if (_cache.TryGetValue(cacheKey, out List<TourCardResponseDTO>? cached))
                return cached!;

            var now = DateTime.Now;
            var query = _context.Tours
                .Include(t => t.LoaiHinhTour)
                .AsNoTracking()
                .WhereVisible(now)
                .OrderByDescending(t => t.LuotDat)
                .Select(TourQueryExtensions.ToCardResponseDTO);

            var result = limit is > 0
                ? await query.Take(limit.Value).ToListAsync()
                : await query.ToListAsync();

            _cache.Set(cacheKey, result, GlobalListCacheDuration);
            return result;
        }

        public async Task<List<TourCardResponseDTO>> GetLatestToursAsync(int? limit = null)
        {
            var cacheKey = $"{LatestToursCacheKey}:{limit?.ToString() ?? "all"}";

            if (_cache.TryGetValue(cacheKey, out List<TourCardResponseDTO>? cached))
                return cached!;

            var now = DateTime.Now;
            var query = _context.Tours
                .Include(t => t.LoaiHinhTour)
                .AsNoTracking()
                .WhereVisible(now)
                .OrderByDescending(t => t.NgayTao)
                .Select(TourQueryExtensions.ToCardResponseDTO);

            var result = limit is > 0
                ? await query.Take(limit.Value).ToListAsync()
                : await query.ToListAsync();

            _cache.Set(cacheKey, result, GlobalListCacheDuration);
            return result;
        }

        private record UserPreferenceContext(
            Dictionary<int, float> MlScores,
            Dictionary<int, float> TypeScoreMap,
            Dictionary<int, float> LocationScoreMap,
            HashSet<int> FavoriteTourIds);

        private async Task<UserPreferenceContext> LoadUserPreferenceContextAsync(int userId)
        {
            var cacheKey = UserPrefCacheKey(userId);

            if (_cache.TryGetValue(cacheKey, out UserPreferenceContext? cached))
                return cached!;

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

            var result = new UserPreferenceContext(mlScores, typeScoreMap, locationScoreMap, favoriteTourIds.ToHashSet());

            _cache.Set(cacheKey, result, UserPrefCacheDuration);
            return result;
        }

        // Gọi khi user có tương tác mới (yêu thích, xem, đặt tour...) để cache không bị cũ
        private void InvalidateUserPreferenceCache(int userId)
        {
            _cache.Remove(UserPrefCacheKey(userId));
        }

        private sealed class TourScoringRow
        {
            public int MaTour { get; set; }
            public int MaLoaiTour { get; set; }
            public int LuotDat { get; set; }
            public List<int> DiaDiemIds { get; set; } = new();
        }

        // Dữ liệu scoring của toàn bộ tour hợp lệ - phụ thuộc excludeTourIds nên cache theo key riêng
        private async Task<List<TourScoringRow>> LoadTourScoringDataAsync(
            DateTime now, IReadOnlyCollection<int>? excludeTourIds)
        {
            // Chỉ cache khi không có exclude list (trường hợp phổ biến nhất, danh sách toàn bộ tour)
            bool cacheable = excludeTourIds == null || excludeTourIds.Count == 0;
            const string cacheKey = "tours:scoringdata:all";

            if (cacheable && _cache.TryGetValue(cacheKey, out List<TourScoringRow>? cached))
                return cached!;

            var query = _context.Tours
                .AsNoTracking()
                .WhereVisible(now);

            if (excludeTourIds != null && excludeTourIds.Count > 0)
                query = query.Where(t => !excludeTourIds.Contains(t.MaTour));

            var result = await query
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

            if (cacheable)
                _cache.Set(cacheKey, result, TimeSpan.FromMinutes(3));

            return result;
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
               .Select(t =>
               {
                   var mlScore = prefs.MlScores.GetValueOrDefault(t.MaTour);

                   var favoriteScore = prefs.FavoriteTourIds.Contains(t.MaTour)
                       ? RecommendationWeights.WishlistTour
                       : 0;

                   var locationScore = t.DiaDiemIds.Sum(diaDiemId =>
                       prefs.LocationScoreMap.GetValueOrDefault(diaDiemId, 0));

                   var typeScore = prefs.TypeScoreMap.GetValueOrDefault(t.MaLoaiTour, 0);

                   var totalScore =
                       (mlScore * 10000f) +
                       favoriteScore +
                       locationScore +
                       typeScore;

                   return new
                   {
                       t.MaTour,
                       t.LuotDat,
                       TotalScore = totalScore
                   };
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
                    d.Slug,
                    d.MoTa,
                    d.TinhThanh,
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
                    d.Slug,
                    d.TinhThanh,
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
                    Slug = x.Slug,
                    TinhThanh = x.TinhThanh,
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

            bool changed = false;

            if (interaction == null)
            {
                _context.TrangThaiTuongTacs.Add(createEntity());
                await _recommendation.UpdatePreference(userId, tourId, weight, true);
                changed = true;
            }
            else if (!isAlreadyMarked(interaction))
            {
                markAsSet(interaction);
                await _recommendation.UpdatePreference(userId, tourId, weight, true);
                changed = true;
            }

            await _context.SaveChangesAsync();

            // Có thay đổi preference thật sự -> xóa cache để lần load tiếp theo lấy dữ liệu mới
            if (changed)
                InvalidateUserPreferenceCache(userId);
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