using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using travel_recommendation_and_booking_system.DTOs.TourBooking;
using travel_recommendation_and_booking_system.DTOs.UserProfile;
using travel_recommendation_and_booking_system.Interfaces;

namespace travel_recommendation_and_booking_system.Controllers.User
{
    [Route("api/user/profile")]
    [ApiController]
    [Authorize(Policy = "UserOnly")]
    public class UserProfileController : ControllerBase
    {
        private readonly IUserProfileService _userProfileService;

        public UserProfileController(IUserProfileService userProfileService)
        {
            _userProfileService = userProfileService;
        }

        #region Profile Management

        [HttpGet("me")]
        public async Task<IActionResult> GetMyProfile()
        {
            var userId = GetUserId();
            if (userId == null)
                return Unauthorized(new { message = "Không xác định được danh tính người dùng." });

            var profile = await _userProfileService.GetMyProfileAsync(userId.Value);
            if (profile == null)
                return NotFound(new { message = "Không tìm thấy thông tin tài khoản." });

            return Ok(profile);
        }

        [HttpPut("me")]
        public async Task<IActionResult> UpdateMyProfile([FromForm] UserProfileDTO dto)
        {
            var userId = GetUserId();
            if (userId == null)
                return Unauthorized(new { message = "Không xác định được danh tính người dùng." });

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var result = await _userProfileService.UpdateMyProfileAsync(userId.Value, dto);
                return Ok(new { message = "Cập nhật thông tin thành công!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDTO dto)
        {
            var userId = GetUserId();
            if (userId == null)
                return Unauthorized(new { message = "Phiên đăng nhập hết hạn." });

            if (dto.MatKhauMoi != dto.XacNhanMatKhau)
                return BadRequest(new { errors = new { XacNhanMatKhau = new[] { "Mật khẩu mới không khớp." } } });

            var success = await _userProfileService.ChangePasswordAsync(userId.Value, dto.MatKhau, dto.MatKhauMoi);
            if (!success)
                return BadRequest(new { errors = new { MatKhau = new[] { "Mật khẩu hiện tại không chính xác." } } });

            return Ok(new { message = "Đổi mật khẩu thành công!" });
        }

        #endregion

        #region Account Overview

        [HttpGet("overview")]
        public async Task<IActionResult> GetOverview([FromQuery] int? year = null)
        {
            var userId = GetUserId();
            if (userId == null)
                return Unauthorized(new { message = "Phiên đăng nhập không hợp lệ hoặc đã hết hạn." });

            try
            {
                var overviewData = await _userProfileService.GetAccountOverviewAsync(userId.Value, year);
                return Ok(overviewData);
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "Đã xảy ra lỗi khi tải dữ liệu tổng quan." });
            }
        }

        #endregion

        #region Booking History

        [HttpGet("history")]
        public async Task<IActionResult> GetHistory(
            [FromQuery] string search = "",
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 5,
            [FromQuery] int? status = null)
        {
            var userId = GetUserId();
            if (userId == null)
                return Unauthorized(new { message = "Lỗi xác thực." });

            try
            {
                var result = await _userProfileService.GetBookingHistoryAsync(userId.Value, search, page, pageSize, status);
                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "Lỗi tải lịch sử." });
            }
        }

        [HttpGet("history/{id}")]
        public async Task<IActionResult> GetBookingDetail(int id)
        {
            var userId = GetUserId();
            if (userId == null)
                return Unauthorized(new { message = "Lỗi xác thực." });

            var detail = await _userProfileService.GetBookingDetailAsync(userId.Value, id);
            if (detail == null)
                return NotFound(new { message = "Không tìm thấy đơn hàng." });

            return Ok(detail);
        }

        #endregion

        #region Cancel Booking

        [HttpPost("cancel/{id}")]
        public async Task<IActionResult> CancelBooking(int id, [FromBody] CancelBookingRequestDTO dto)
        {
            var userId = GetUserId();
            if (userId == null)
                return Unauthorized(new { message = "Lỗi xác thực." });

            try
            {
                await _userProfileService.CancelBookingAsync(userId.Value, id, dto.LyDoHuy);
                return Ok(new { message = "Hủy tour thành công." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        #endregion

        #region User Reviews

        [HttpGet("reviews")]
        public async Task<IActionResult> GetUserReviews(
            [FromQuery] string? search = null,
            [FromQuery] int? rating = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 5)
        {
            var userId = GetUserId();
            if (userId == null)
                return Unauthorized(new { message = "Phiên đăng nhập không hợp lệ hoặc đã hết hạn." });

            try
            {
                var result = await _userProfileService.GetUserReviewsAsync(
                    userId.Value,
                    search,
                    rating,
                    page,
                    pageSize);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Đã xảy ra lỗi khi tải lịch sử đánh giá: {ex.Message}" });
            }
        }

        #endregion

        #region Refund Management - ĐÃ CHUYỂN SANG RefundController



        #endregion

        #region Private Methods

        private int? GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                return null;
            return userId;
        }

        #endregion
    }
}