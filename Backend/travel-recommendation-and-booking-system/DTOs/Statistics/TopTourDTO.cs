namespace travel_recommendation_and_booking_system.Dtos.Statistics
{
    public class TopTourDTO
    {
        public int MaTour { get; set; }
        public string TenTour { get; set; } = string.Empty;
        public int BookedCount { get; set; }
        public decimal Revenue { get; set; }
    }
}