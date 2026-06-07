using System.ComponentModel.DataAnnotations;

namespace travel_recommendation_and_booking_system.DTOs
{
    public class NewsletterDTO
    {
        [Required(ErrorMessage = "Email không được để trống")]
        [EmailAddress(ErrorMessage = "Email không đúng định dạng")]
        public string Email { get; set; } = null!;
    }
}
