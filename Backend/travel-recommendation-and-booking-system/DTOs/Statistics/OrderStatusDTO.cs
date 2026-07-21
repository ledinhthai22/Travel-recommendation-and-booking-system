namespace travel_recommendation_and_booking_system.Dtos.Statistics
{
    public class OrderStatusDTO
    {
        public string StatusName { get; set; } = string.Empty;
        public int Count { get; set; }
        public decimal Percentage { get; set; }
        public string Color { get; set; } = "#0EA5E9";

        public int StatusCode { get; set; }
    }
}