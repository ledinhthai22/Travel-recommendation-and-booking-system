using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using travel_recommendation_and_booking_system.Interfaces;

namespace travel_recommendation_and_booking_system.Controllers.User
{
    [Route("api/user/refund")]
    [ApiController]
    [Authorize(Policy = "UserOnly")]
    public class UserRefundController : ControllerBase
    {
        private readonly IRefundService _refundService;

        public UserRefundController(IRefundService refundService)
        {
            _refundService = refundService;
        }

        /// <summary>
        /// Xác nhận hoàn tiền cho người dùng
        /// </summary>
        [HttpPost("confirm/{maThanhToan}")]
        public async Task<IActionResult> ConfirmRefund(int maThanhToan)
        {
            var userId = GetUserId();
            if (userId == null)
                return Unauthorized(new { message = "Lỗi xác thực." });

            try
            {
                var result = await _refundService.ConfirmRefundUserAsync(maThanhToan);
                if (result)
                    return Ok(new { message = "Xác nhận hoàn tiền thành công" });

                return BadRequest(new { message = "Xác nhận hoàn tiền thất bại" });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Đã xảy ra lỗi khi xác nhận hoàn tiền" });
            }
        }

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