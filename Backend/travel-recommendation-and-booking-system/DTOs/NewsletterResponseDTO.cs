namespace travel_recommendation_and_booking_system.DTOs
{
    public class NewsletterResponseDTO
    {
        public int MaNewsletter { get; set; }
        public string Email { get; set; } = null!;
        public DateTime NgayGui { get; set; }
    }
}
