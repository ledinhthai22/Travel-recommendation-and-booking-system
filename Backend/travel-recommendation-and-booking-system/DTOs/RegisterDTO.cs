using System.ComponentModel.DataAnnotations;

namespace travel_recommendation_and_booking_system.DTOs
{
    public class RegisterDTO
    {
        [Required(ErrorMessage ="Họ tên không được trống")]
        public string HoTen { get; set; } = null!;

        [Required(ErrorMessage ="Email không được trống")]
        [EmailAddress(ErrorMessage = "Email không đúng định dạng")] 
        public string Email { get; set; } = null!;

        [Required(ErrorMessage ="Mật khẩu không được trống")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Mật khẩu phải từ 6 ký tự trở lên")]
        public string MatKhau { get; set; } = null!;

        [Required(ErrorMessage ="Số điện thoại không được trống ")]
        [RegularExpression(@"^(0[3|5|7|8|9])[0-9]{8}$", ErrorMessage = "Số điện thoại không đúng định dạng")]
        public string SoDienThoai { get; set; } = null!;
    }
}
