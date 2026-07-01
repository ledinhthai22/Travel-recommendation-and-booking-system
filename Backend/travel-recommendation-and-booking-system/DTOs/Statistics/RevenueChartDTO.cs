namespace travel_recommendation_and_booking_system.Dtos.Statistics
{
    public class RevenueChartDTO
    {
        public List<RevenueItemDTO> Data { get; set; } = new List<RevenueItemDTO>();
    }

    public class RevenueItemDTO
    {
        public string Month { get; set; } = string.Empty;   // "Tháng 1", "Tháng 2", ...
        public decimal Revenue { get; set; }
    }
}