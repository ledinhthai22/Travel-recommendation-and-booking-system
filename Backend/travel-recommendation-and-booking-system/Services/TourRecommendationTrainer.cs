using Microsoft.EntityFrameworkCore;
using Microsoft.ML;
using Microsoft.ML.Trainers;
using travel_recommendation_and_booking_system.Constants;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Models;
using travel_recommendation_and_booking_system.Services.MLModels;

namespace travel_recommendation_and_booking_system.Services
{
    public class TourRecommendationTrainer : ITourRecommendationTrainer
    {
        private readonly AppDbContext _context;
        private readonly MLContext _mlContext = new MLContext(seed: 42);

        private const int MIN_ROWS_TO_TRAIN = 20;
        private const int MIN_INTERACTIONS_PER_USER = 1;
        private const int TOP_N_PER_USER = 30;

        public TourRecommendationTrainer(AppDbContext context)
        {
            _context = context;
        }

        public async Task<TrainResult> TrainAndSaveAsync(string outputPath = "Models/tour-recommender.zip")
        {
            var views = await _context.TrangThaiTuongTacs
                .Where(t => t.DaXemChiTiet)
                .Select(t => new { t.MaNguoiDung, t.MaTour, Label = RecommendationWeights.ViewTour })
                .ToListAsync();

            var deepInterest = await _context.TrangThaiTuongTacs
                .Where(t => t.DaQuanTamLau)
                .Select(t => new { t.MaNguoiDung, t.MaTour, Label = RecommendationWeights.ConfirmInterest })
                .ToListAsync();

            var wishlist = await _context.DanhSachYeuThichs
                .Select(y => new { y.MaNguoiDung, y.MaTour, Label = RecommendationWeights.WishlistTour })
                .ToListAsync();

            var bookings = await _context.DonDatTours
                .Select(d => new { d.MaNguoiDung, MaTour = d.ChuyenKhoiHanh!.MaTour, Label = RecommendationWeights.BookTour })
                .ToListAsync();

            var merged = views.Concat(deepInterest).Concat(wishlist).Concat(bookings)
                .GroupBy(x => (x.MaNguoiDung, x.MaTour))
                .Select(g => new TourRatingData
                {
                    MaNguoiDung = (uint)g.Key.MaNguoiDung,
                    MaTour = (uint)g.Key.MaTour,
                    Label = g.Max(x => x.Label)
                })
                .ToList();

            if (merged.Count < MIN_ROWS_TO_TRAIN)
            {
                return new TrainResult(merged.Count, outputPath, Success: false,
                    Message: $"Chưa đủ dữ liệu để train (hiện có {merged.Count} dòng, cần tối thiểu {MIN_ROWS_TO_TRAIN}). Hệ thống dùng heuristic cho tới khi đủ dữ liệu.");
            }

            // Train Matrix Factorization
            var trainData = _mlContext.Data.LoadFromEnumerable(merged);

            var options = new MatrixFactorizationTrainer.Options
            {
                MatrixColumnIndexColumnName = nameof(TourRatingData.MaNguoiDung),
                MatrixRowIndexColumnName = nameof(TourRatingData.MaTour),
                LabelColumnName = nameof(TourRatingData.Label),
                LossFunction = MatrixFactorizationTrainer.LossFunctionType.SquareLossOneClass,
                Alpha = 0.01,
                Lambda = 0.025,
                C = 0.00001,
                NumberOfIterations = 20
            };

            var model = _mlContext.Recommendation().Trainers.MatrixFactorization(options).Fit(trainData);

            var dir = Path.GetDirectoryName(outputPath);
            if (!string.IsNullOrEmpty(dir) && !Directory.Exists(dir))
                Directory.CreateDirectory(dir);
            _mlContext.Model.Save(model, trainData.Schema, outputPath);

            //  Batch scoring
            var predictionEngine = _mlContext.Model.CreatePredictionEngine<TourRatingData, TourRatingPrediction>(model);

            var eligibleUserIds = merged
                .GroupBy(x => x.MaNguoiDung)
                .Where(g => g.Count() >= MIN_INTERACTIONS_PER_USER)
                .Select(g => g.Key)
                .ToList();

            var visibleTourIds = await _context.Tours
                .Where(t => t.TrangThai == 1 && t.NgayXoa == null)
                .Select(t => (uint)t.MaTour)
                .ToListAsync();

            var newScores = new List<TourRecommendationScore>();

            foreach (var userId in eligibleUserIds)
            {
                var top = visibleTourIds
                    .Select(tourId => new
                    {
                        MaTour = tourId,
                        Score = predictionEngine.Predict(new TourRatingData { MaNguoiDung = userId, MaTour = tourId }).Score
                    })
                    .OrderByDescending(x => x.Score)
                    .Take(TOP_N_PER_USER);

                foreach (var s in top)
                {
                    newScores.Add(new TourRecommendationScore
                    {
                        MaNguoiDung = (int)userId,
                        MaTour = (int)s.MaTour,
                        Score = s.Score,
                        NgayCapNhat = DateTime.Now
                    });
                }
            }

            //  Ghi đè điểm cũ trong DB bằng điểm mới
            var affectedUserIds = eligibleUserIds.Select(u => (int)u).ToList();
            var oldScores = await _context.TourRecommendationScores
                .Where(s => affectedUserIds.Contains(s.MaNguoiDung))
                .ToListAsync();

            _context.TourRecommendationScores.RemoveRange(oldScores);
            await _context.TourRecommendationScores.AddRangeAsync(newScores);
            await _context.SaveChangesAsync();

            return new TrainResult(merged.Count, outputPath, Success: true,
                Message: $"Đã lưu {newScores.Count} điểm cho {eligibleUserIds.Count} user vào TourRecommendationScore.");
        }
    }
}