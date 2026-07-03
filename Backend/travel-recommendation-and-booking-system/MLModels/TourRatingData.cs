using Microsoft.ML.Data;

namespace travel_recommendation_and_booking_system.Services.MLModels
{
    public class TourRatingData
    {
        [KeyType(count: TrainingConstants.MAX_USER_KEY)]
        public uint MaNguoiDung { get; set; }

        [KeyType(count: TrainingConstants.MAX_TOUR_KEY)]
        public uint MaTour { get; set; }

        public float Label { get; set; }
    }

    public class TourRatingPrediction
    {
        public float Score { get; set; }
    }

    public static class TrainingConstants
    {
        // Đặt lớn hơn MaNguoiDung/MaTour lớn nhất trong DB một khoảng an toàn
        public const uint MAX_USER_KEY = 100_000;
        public const uint MAX_TOUR_KEY = 10_000;
    }
}