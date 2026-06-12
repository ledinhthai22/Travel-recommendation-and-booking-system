using System.ComponentModel.DataAnnotations;

namespace DTOs.Auth
{
    public class TokenModelDTO
    {
        [Required]
        public string AccessToken { get; set; } = null!;
        [Required]
        public string RefreshToken { get; set; } = null!;
    }
}