namespace travel_recommendation_and_booking_system.DTOs.UserProfile
{
    public class AccountOverviewDTO
    {
        public int TongTour { get; set; }
        public int TongDanhGia { get; set; }
        public decimal TongTien { get; set; }
        public List<RecentTourDTO> Tours { get; set; } = new List<RecentTourDTO>();
    }
}
