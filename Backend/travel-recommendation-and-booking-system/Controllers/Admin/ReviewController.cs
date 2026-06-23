using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using travel_recommendation_and_booking_system.DTOs.Review;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Services;

namespace travel_recommendation_and_booking_system.Controllers.Admin
{
    [Route("api/admin/[controller]")]
    [ApiController]
    [Authorize(Policy = "Admin&Staff")]
    public class ReviewController : ControllerBase
    {
        private readonly IReviewService _review;

        public ReviewController(IReviewService review)
        {
            _review = review;
        }

        [HttpGet("get-review")]
        public async Task<IActionResult> GetReviews([FromQuery] int page = 1, [FromQuery] int pageSize = 10,[FromQuery] string? keyword = null, [FromQuery] int? diem = null, [FromQuery] bool? trangThai = null)
        {
            return Ok(await _review.GetReviewsAsync(page, pageSize, keyword, diem, trangThai));
        }

        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateReviewStatusDTO dto)
        {
            var result = await _review.UpdateReviewStatusAsync(id, dto.TrangThai);
            return result ? Ok(new { message = "Cập nhật thành công" }) : BadRequest("Không tìm thấy bình luận");
        }

        [HttpPatch("batch-update-status")]
        public async Task<IActionResult> BatchUpdateStatus([FromBody] BatchActionDTO request)
        {
            if (request.MaDanhGiaList == null || !request.MaDanhGiaList.Any())
            {
                return BadRequest(new { message = "Vui lòng chọn ít nhất một bình luận." });
            }

            var count = await _review.BatchUpdateStatusAsync(request.MaDanhGiaList, request.TrangThai);

            if (count == 0)
            {
                return NotFound(new { message = "Không tìm thấy bình luận nào để cập nhật." });
            }

            return Ok(new { message = $"Đã cập nhật thành công {count} bình luận." });
        }

  
    }
}
