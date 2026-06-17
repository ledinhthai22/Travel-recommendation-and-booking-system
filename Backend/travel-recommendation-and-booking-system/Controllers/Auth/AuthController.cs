using System.Security.Claims;
using DTOs.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using travel_recommendation_and_booking_system.Interfaces;

namespace Controllers.Auth
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IUserService _userService;

        public AuthController(IAuthService authService, IUserService userService)
        {
            _authService = authService;
            _userService = userService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO register)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var errorResult = await _authService.RegisterAsync(register);

            if (errorResult != null)
            {
                return BadRequest(new { message = errorResult });
            }

            return Ok(new { message = "Đăng ký tài khoản thành công!" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO login)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
            var result = await _authService.LoginAsync(login, ipAddress);

            if (!result.IsSuccess)
            {
                return BadRequest(new { errors = result.Errors });
            }
            return Ok(new
            {
                message = "Đăng nhập thành công!",
                token = result.Token,
                refreshToken = result.RefreshToken,
                maVaiTro = result.MaVaiTro,
                hoTen = result.HoTen
            });
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] TokenModelDTO model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _authService.RenewTokenAsync(model);

            if (!result.IsSuccess)
            {
                return BadRequest(new { errors = result.Errors });
            }

            return Ok(new
            {
                message = "Gia hạn phiên đăng nhập thành công!",
                token = result.Token,
                refreshToken = result.RefreshToken
            });
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDTO model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _authService.ForgotPasswordAsync(model);

            return Ok(new { message = "Nếu email hợp lệ, một mã OTP đã được gửi đến hòm thư của bạn." });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDTO model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _authService.ResetPasswordAsync(model);

            if (!result)
            {
                return BadRequest(new { message = "Mã OTP không chính xác hoặc đã hết hạn" });
            }

            return Ok(new { message = "Khôi phục mật khẩu thành công. Vui lòng đăng nhập lại" });
        }
        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpDTO model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var isValid =
                await _authService.VerifyOtpAsync(model);

            if (!isValid)
            {
                return BadRequest(new
                {
                    message = "Mã OTP không hợp lệ hoặc đã hết hạn"
                });
            }

            return Ok(new
            {
                message = "Mã OTP hợp lệ"
            });
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromBody] LogoutDTO model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var isDeleted = await _authService.LogoutAsync(model.RefreshToken);

            if (!isDeleted)
            {
                return BadRequest(new { message = "Không tìm thấy phiên đăng nhập hợp lệ để đăng xuất" });
            }

            return Ok(new { message = "Đã đăng xuất" });
        }

        [Authorize]
        [HttpGet("me")]

        public async Task<IActionResult> GetMe()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim))
                {
                    return Unauthorized(new { message = "Token không hợp lệ hoặc bị thiếu thông tin định danh." });
                }
                if (!int.TryParse(userIdClaim, out int userId))
                {
                    return BadRequest(new { message = "ID người dùng trong Token bị sai định dạng." });
                }
                var userProfile = await _userService.GetMeAsync(userId);

                if (userProfile == null)
                {
                    return NotFound(new { message = "Tài khoản không tồn tại hoặc đã bị xóa." });
                }
                return Ok(userProfile);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống: " + ex.Message });
            }
        }
    }
}