using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.DTOs;
using travel_recommendation_and_booking_system.Interfaces;

namespace travel_recommendation_and_booking_system.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
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
    }
}
