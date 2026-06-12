using System.ComponentModel.DataAnnotations;

namespace DTOs.Auth
{
    public class LoginDTO
    {
        [Required(ErrorMessage = "Email không được trống")]
        [EmailAddress(ErrorMessage = "Email không đúng định dạng")]
        public string Email { get; set; }

        [Required(ErrorMessage ="Mật khẩu không được rỗng")]
        public string MatKhau { get; set; }
    }
}
