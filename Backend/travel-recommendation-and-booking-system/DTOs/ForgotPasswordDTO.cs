using System.ComponentModel.DataAnnotations;

namespace travel_recommendation_and_booking_system.DTOs
{
    public class ForgotPasswordDTO //quên mật khẩu
    {
        [Required(ErrorMessage = "Email không được trống")]
        [EmailAddress(ErrorMessage = "Email không đúng định dạng")]
        public string Email { get; set; } = null!;
    }
}
