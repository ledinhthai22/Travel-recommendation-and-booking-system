namespace travel_recommendation_and_booking_system.Dtos.Statistics
{
    public class RecentTransactionDTO
    {
        public int MaDon { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string TourName { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime Time { get; set; }
    }
}