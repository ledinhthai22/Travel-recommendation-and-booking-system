using System.ComponentModel.DataAnnotations;

namespace DTOs.Auth
{
    public class RegisterDTO
    {
        [Required(ErrorMessage ="Họ tên không được trống")]
        public string HoTen { get; set; } = null!;

        [Required(ErrorMessage ="Email không được trống")]
        [EmailAddress(ErrorMessage = "Email không đúng định dạng")] 
        public string Email { get; set; } = null!;

        [Required(ErrorMessage ="Mật khẩu không được trống")]
        [MinLength(8,ErrorMessage = "Mật khẩu phải có ít nhất 8 ký tự")]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$",ErrorMessage = "Mật khẩu phải có chữ hoa, chữ thường, số và ký tự đặc biệt.")]
        public string MatKhau { get; set; } = null!;

        [Required(ErrorMessage = "Mật khẩu không được trống")]
        [Compare("MatKhau", ErrorMessage = "Mật khẩu xác nhận không khớp.")]
        public string XacNhanMatKhau { get; set; }

        [Required(ErrorMessage ="Số điện thoại không được trống ")]
        [RegularExpression(@"^(0[3|5|7|8|9])[0-9]{8}$", ErrorMessage = "Số điện thoại không đúng định dạng")]
        public string SoDienThoai { get; set; } = null!;
        public bool GioiTinh {  get; set; }
    }
}
