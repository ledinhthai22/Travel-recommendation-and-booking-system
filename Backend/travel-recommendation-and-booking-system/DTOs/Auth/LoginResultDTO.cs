namespace DTOs.Auth
{
    public class LoginResultDTO
    {
        public bool IsSuccess { get; set; }
        public string? Token { get; set; }
        public string? RefreshToken { get; set; }
        public int MaVaiTro { get; set; }
        public string? HoTen { get; set; }
        public Dictionary<string, List<string>>? Errors { get; set; }
    }
}
