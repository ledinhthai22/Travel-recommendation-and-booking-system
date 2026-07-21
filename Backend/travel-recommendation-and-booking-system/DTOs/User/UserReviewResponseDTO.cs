namespace travel_recommendation_and_booking_system.DTOs.UserProfile
{
    public class UserReviewResponseDTO
    {
        public List<UserReviewDTO> Items { get; set; } = new();
        public int TotalItems { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
    }
}