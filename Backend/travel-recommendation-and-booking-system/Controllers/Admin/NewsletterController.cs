using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using travel_recommendation_and_booking_system.Interfaces;

namespace travel_recommendation_and_booking_system.Controllers.Admin
{
    [Route("api/admin/[controller]")]
    [ApiController]
    [Authorize(Policy = "AdminOnly")]
    public class NewsletterController : ControllerBase
    {
        private readonly INewsletterService _newsletter;
        public NewsletterController(INewsletterService newsletter)
        {
            _newsletter = newsletter;
        }
        [HttpGet("get-newsletter")]
        public async Task<IActionResult> GetNewsletters([FromQuery] string? key = null, [FromQuery] int page = 1, [FromQuery] int size = 10)
        {
            var result = await _newsletter.GetPagedNewslettersAsync(key, page, size);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> SoftDeleteNewsletter(int id)
        {
            try
            {
                var isnewsletter = await _newsletter.SoftDeleteNewsletterAsync(id);
                if (!isnewsletter)
                {
                    return NotFound(new { success = false, message = "Không tìm thấy email này hoặc đã bị xóa từ trước" });
                }
                return Ok(new { success = true, message = "Đã xóa email đăng ký thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống: " + ex.Message });
            }
        }
    }
}