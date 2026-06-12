using System.ComponentModel.DataAnnotations;

namespace travel_recommendation_and_booking_system.DTOs.User
{
    public class StaffUpdateDTO
    {
        [Required(ErrorMessage = "Vui lòng nhập họ tên.")]
        public string HoTen { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập email.")]
        [EmailAddress(ErrorMessage = "Email không hợp lệ.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Số điện thoại không được trống.")]
        [RegularExpression(@"^(0[3|5|7|8|9])[0-9]{8}$", ErrorMessage = "Số điện thoại không đúng định dạng.")]
        public string SoDienThoai { get; set; }

        [Required(ErrorMessage = "Vui lòng chọn vai trò.")]
        public int MaVaiTro { get; set; }

        [Required(ErrorMessage = "Vui lòng chọn chức vụ.")]
        public int ChucVu { get; set; }

        [Required(ErrorMessage = "Vui lòng chọn phòng ban.")]
        public int PhongBan { get; set; }

        [Required(ErrorMessage = "Vui lòng chọn trạng thái.")]
        public int TrangThai { get; set; }

        public IFormFile? DuongDanAnh { get; set; }
    }
}
