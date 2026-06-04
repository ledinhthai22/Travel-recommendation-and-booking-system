using System.ComponentModel.DataAnnotations;

namespace travel_recommendation_and_booking_system.DTOs
{
    public class TokenModelDTO
    {
        [Required]
        public string AccessToken { get; set; } = null!;
        [Required]
        public string RefreshToken { get; set; } = null!;
    }
}
