using System.Security.Claims;
using DTOs.Page;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.DTOs.UserProfile;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Services;

namespace Controllers.Customer
{
    [Route("api/customer/[controller]")]
    [ApiController]
    [Authorize(Policy = "UserOnly")]
    public class UserProfileController : ControllerBase
    {
        private readonly IUserProfileService _user;
        private readonly AppDbContext _context;
        public UserProfileController(IUserProfileService user,AppDbContext context)
        {
            _user = user;
            _context = context;
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetMyProfile()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int maNguoiDung))
            {
                return Unauthorized("Không xác định được danh tính người dùng.");
            }
            var profile = await _user.GetMyProfileAsync(maNguoiDung);

            if (profile == null)
            {
                return NotFound("Không tìm thấy thông tin tài khoản.");
            }
            return Ok(profile);
        }

        [HttpPut("me")]
        public async Task<IActionResult> UpdateMyProfile([FromForm] UserProfileDTO dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int maNguoiDung))
            {
                return Unauthorized("Không xác định được danh tính người dùng.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var result = await _user.UpdateMyProfileAsync(maNguoiDung, dto);
                if (result)
                {
                    var updatedUser = await _context.NguoiDungs.FindAsync(maNguoiDung);

                    return Ok(new
                    {
                        message = "Cập nhật thông tin thành công!",
                        newImagePath = updatedUser.DuongDanAnh
                    });
                }
                return BadRequest("Cập nhật thất bại.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDTO dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int maNguoiDung))
            {
                return Unauthorized("Phiên đăng nhập hết hạn.");
            }

            if (dto.MatKhauMoi != dto.XacNhanMatKhau)
            {
                return BadRequest(new
                {
                    errors = new { XacNhanMatKhau = new[] { "Mật khẩu mới không khớp." } }
                });
            }

            var success = await _user.ChangePasswordAsync(maNguoiDung, dto.MatKhau, dto.MatKhauMoi);

            if (!success)
            {
                return BadRequest(new
                {
                    errors = new { MatKhau = new[] { "Mật khẩu hiện tại không chính xác." } }
                });
            }

            return Ok(new { message = "Đổi mật khẩu thành công!" });
        }

        [HttpGet("overview")]
        public async Task<IActionResult> GetOverview()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new { message = "Phiên đăng nhập không hợp lệ hoặc đã hết hạn." });
            }

            try
            {
                var overviewData = await _user.GetAccountOverviewAsync(userId);
                return Ok(overviewData);
            }
            catch (System.Exception)
            {
                return StatusCode(500, new { message = "Đã xảy ra lỗi khi tải dữ liệu tổng quan." });
            }
        }

        [HttpGet("history")]
        public async Task<IActionResult> GetHistory([FromQuery] string search = "", [FromQuery] int page = 1, [FromQuery] int pageSize = 5, [FromQuery] int? status=null)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                return Unauthorized(new { message = "Lỗi xác thực." });

            try
            {
                var result = await _user.GetBookingHistoryAsync(userId, search, page, pageSize,status);
                return Ok(result);
            }
            catch (System.Exception)
            {
                return StatusCode(500, new { message = "Lỗi tải lịch sử." });
            }
        }

        [HttpGet("history/{id}")]
        public async Task<IActionResult> GetBookingDetail(int id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                return Unauthorized(new { message = "Lỗi xác thực." });

            var detail = await _user.GetBookingDetailAsync(userId, id);
            if (detail == null) return NotFound(new { message = "Không tìm thấy đơn hàng." });
            return Ok(detail);
        }

        [HttpPost("cancel/{id}")]
        public async Task<IActionResult> CancelBooking(int id,string LyDoHuy)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            try
            {
                await _user.CancelBookingAsync(userId, id, LyDoHuy);
                return Ok(new { message = "Hủy tour thành công." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

    }
}
