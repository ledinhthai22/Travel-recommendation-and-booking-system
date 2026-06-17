using System.ComponentModel.DataAnnotations;

namespace DTOs.Auth
{
    public class ForgotPasswordDTO //quên mật khẩu
    {
        [Required(ErrorMessage = "Email không được trống")]
        [EmailAddress(ErrorMessage = "Email không đúng định dạng")]
        public string Email { get; set; } = null!;
    }
}
