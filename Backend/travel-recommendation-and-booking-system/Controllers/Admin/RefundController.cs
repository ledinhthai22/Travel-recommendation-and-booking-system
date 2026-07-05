using System.Security.Claims;
using DTOs.Page;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using travel_recommendation_and_booking_system.DTOs.UserProfile;
using travel_recommendation_and_booking_system.Interfaces;

namespace Controllers.Admin
{
    [Route("api/admin/refund")]
    [ApiController]
    [Authorize(Policy = "Admin&Staff")]
    public class RefundController : ControllerBase
    {
        private readonly IUserProfileService _userProfileService;

        public RefundController(IUserProfileService userProfileService)
        {
            _userProfileService = userProfileService;
        }

        [HttpGet("pending")]
        public async Task<IActionResult> GetPendingRefunds([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                var result = await _userProfileService.GetPendingRefundsAsync(page, pageSize);
                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "Lỗi tải danh sách chờ hoàn tiền." });
            }
        }

        [HttpPost("confirm/{maThanhToan}")]
        public async Task<IActionResult> ConfirmRefund(int maThanhToan)
        {
            var nhanVienIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(nhanVienIdClaim) || !int.TryParse(nhanVienIdClaim, out int maNhanVien))
            {
                return Unauthorized(new { message = "Không xác định được danh tính nhân viên." });
            }

            try
            {
                await _userProfileService.XacNhanHoanTienAsync(maThanhToan, maNhanVien);
                return Ok(new { message = "Xác nhận hoàn tiền thành công." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}