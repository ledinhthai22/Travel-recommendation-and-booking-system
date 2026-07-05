namespace travel_recommendation_and_booking_system.DTOs.Recommendation
{
    public class TourScoreDTO
    {
        public int ViewScore { get; set; }

        public int FavoriteScore { get; set; }

        public int BookingScore { get; set; }

        public int TotalScore { get; set; }
    }
}