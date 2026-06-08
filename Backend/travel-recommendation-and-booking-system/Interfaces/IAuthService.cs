using travel_recommendation_and_booking_system.DTOs;

namespace travel_recommendation_and_booking_system.Interfaces;

public interface IAuthService
{
    Task<Dictionary<string, List<string>>?> RegisterAsync(RegisterDTO register); // đăng ký
    Task<LoginResultDTO> LoginAsync(LoginDTO login, string? ipAddress); // đăng nhập
    Task<LoginResultDTO> RenewTokenAsync(TokenModelDTO token); // gia hạn token
    Task<bool> LogoutAsync(string refreshToken); // đăng xuất
    Task<bool> ForgotPasswordAsync(ForgotPasswordDTO forgot); // quên mật khẩu
    Task<bool> ResetPasswordAsync(ResetPasswordDTO reset); // reset mật khẩu
    Task<bool> VerifyOtpAsync(VerifyOtpDTO otp); // xác thực otp

}
