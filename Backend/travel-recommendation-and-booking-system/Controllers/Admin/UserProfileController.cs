using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using travel_recommendation_and_booking_system.DTOs.UserProfile;
using travel_recommendation_and_booking_system.Interfaces;

namespace Controllers.Admin
{
    [Route("api/admin/[controller]")]
    [ApiController]
    [Authorize]
    public class UserProfileController : ControllerBase
    {
        private readonly IUserProfileService _user;
        public UserProfileController(IUserProfileService user)
        {
            _user = user;
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
        [Authorize(Policy = "UserOnly")]
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
                    return Ok(new { message = "Cập nhật thông tin thành công!" });
                }
                return BadRequest("Cập nhật thất bại.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
