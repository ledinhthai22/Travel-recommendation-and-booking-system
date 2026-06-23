using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using travel_recommendation_and_booking_system.Interfaces;

namespace travel_recommendation_and_booking_system.Controllers.Customer
{
    [Route("api/customer/[controller]")]
    [ApiController]
    [Authorize(Policy = "UserOnly")]
    public class TourController : ControllerBase
    {
        private readonly ITourService _tour;
        public TourController(ITourService tour)
        {
            _tour = tour;
        }

        [HttpGet("wishlist")]
        public async Task<IActionResult> GetWishlist([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int maNguoiDung))
            {
                return Unauthorized("Không xác định được danh tính người dùng.");
            }

            try
            {
                var data = await _tour.GetFavoriteToursAsync(maNguoiDung, pageNumber, pageSize);
                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi hệ thống: {ex.Message}");
            }
        }

        [HttpPost("wishlist/{tourId}")]
        public async Task<IActionResult> AddToWishlist(int tourId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int maNguoiDung))
            {
                return Unauthorized("Không xác định được danh tính người dùng.");
            }

            try
            {
                var isSuccess = await _tour.AddFavoriteTourAsync(maNguoiDung, tourId);

                if (isSuccess)
                {
                    return Ok(new { message = "Đã thêm vào danh sách yêu thích thành công!" });
                }

                return BadRequest(new { message = "Tour không tồn tại hoặc đã có sẵn trong danh sách yêu thích của bạn." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi hệ thống: {ex.Message}" });
            }
        }

        [HttpDelete("wishlist")]
        public async Task<IActionResult> DeleteWishlist([FromBody] List<int> tourIds)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int maNguoiDung))
            {
                return Unauthorized("Không xác định được danh tính người dùng.");
            }

            try
            {
                var isSuccess = await _tour.DeleteFavoriteToursAsync(maNguoiDung, tourIds);

                if (isSuccess)
                {
                    return Ok(new { message = "Đã xóa các tour đã chọn khỏi danh sách yêu thích thành công!" });
                }

                return BadRequest(new { message = "Không tìm thấy tour cần xóa hoặc danh sách ID rỗng." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi hệ thống: {ex.Message}" });
            }
        }
    }
}
