using System.ComponentModel.DataAnnotations;

namespace travel_recommendation_and_booking_system.DTOs.UserProfile
{
    public class ChangePasswordDTO
    {
        [Required(ErrorMessage = "Mật khẩu không được trống")]
        public string MatKhau { get; set; }

        [Required(ErrorMessage = "Mật khẩu mới không được trống")]
        [MinLength(8, ErrorMessage = "Mật khẩu phải có ít nhất 8 ký tự")]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$", ErrorMessage = "Mật khẩu phải có chữ hoa, chữ thường, số và ký tự đặc biệt.")]
        public string MatKhauMoi { get; set; }
        [Required(ErrorMessage = "Xác nhận Mật khẩu không được trống")]
        public string XacNhanMatKhau { get; set; }
    }
}
