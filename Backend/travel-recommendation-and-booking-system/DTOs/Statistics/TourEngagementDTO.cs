namespace travel_recommendation_and_booking_system.Dtos.Statistics
{
    public class TourEngagementDTO
    {
        public string Name { get; set; } = string.Empty;   // Xem tour, Yêu thích, Đặt tour
        public int Value { get; set; }                     // Số lượng hoặc %
        public string Color { get; set; } = "#0EA5E9";
    }
}