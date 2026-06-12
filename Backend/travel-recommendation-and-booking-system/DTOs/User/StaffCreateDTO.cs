using System.ComponentModel.DataAnnotations;

namespace DTOs.User
{
    public class StaffCreateDTO
    {
        [Required(ErrorMessage = "Vui lòng nhập họ tên.")]
        public string HoTen { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập email.")]
        [EmailAddress(ErrorMessage = "Email không hợp lệ.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Mật khẩu không được trống.")]
        [MinLength(8, ErrorMessage = "Mật khẩu phải có ít nhất 8 ký tự.")]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$", ErrorMessage = "Mật khẩu phải có chữ hoa, chữ thường, số và ký tự đặc biệt.")]
        public string MatKhau { get; set; }

        [Required(ErrorMessage = "Vui lòng xác nhận mật khẩu.")]
        [Compare("MatKhau", ErrorMessage = "Mật khẩu xác nhận không khớp.")]
        public string XacNhanMatKhau { get; set; }

        [Required(ErrorMessage = "Số điện thoại không được trống.")]
        [RegularExpression(@"^(0[3|5|7|8|9])[0-9]{8}$", ErrorMessage = "Số điện thoại không đúng định dạng.")]
        public string SoDienThoai { get; set; }

        [Required(ErrorMessage = "Vui lòng chọn vai trò.")]
        public int MaVaiTro { get; set; }

        [Required(ErrorMessage = "Vui lòng chọn chức vụ.")]
        public int ChucVu { get; set; }

        [Required(ErrorMessage = "Vui lòng chọn phòng ban.")]
        public int PhongBan { get; set; }
        public IFormFile? DuongDanAnh { get; set; }
    }
}
