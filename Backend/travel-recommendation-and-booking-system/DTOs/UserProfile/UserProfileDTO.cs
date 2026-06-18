using System.ComponentModel.DataAnnotations;

namespace travel_recommendation_and_booking_system.DTOs.UserProfile
{
    public class UserProfileDTO
    {
        public int MaNguoiDung { get; set; }

        [Required(ErrorMessage = "Họ tên không được để trống.")]
        public string HoTen { get; set; }

        [Required(ErrorMessage = "Email không được để trống.")]
        [EmailAddress(ErrorMessage = "Email không đúng định dạng.")]
        public string Email { get; set; }
        public IFormFile? DuongDanAnh { get; set; }
        public string? DiaChi { get; set; }
        public DateTime? NgaySinh { get; set; }

        [Required(ErrorMessage = "Số điện thoại không được để trống.")]
        [RegularExpression(@"^(0[3|5|7|8|9])+([0-9]{8})$", ErrorMessage = "Số điện thoại không hợp lệ.")]
        public string SoDienThoai { get; set; }

        public bool GioiTinh { get; set; }
    }
}
