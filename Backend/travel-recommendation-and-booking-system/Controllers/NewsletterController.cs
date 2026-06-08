using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using travel_recommendation_and_booking_system.DTOs;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Services;

namespace travel_recommendation_and_booking_system.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NewsletterController : ControllerBase
    {
        private readonly INewsletterService _newsletter;
        public NewsletterController(INewsletterService newsletter)
        {
            _newsletter = newsletter;
        }

        [HttpPost("subscribe")]
        public async Task<IActionResult> Subscribe([FromBody] NewsletterDTO newsletter)
        {
            try 
            {
                var result= await _newsletter.SubscribeAsync(newsletter);
                if (!result)
                {
                    return BadRequest(new { message = "Email này đã được đăng ký nhận bản tin trước đó" });
                }

                return Ok(new { message = "Đăng ký nhận bản tin thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống: " + ex.Message });
            }
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetNewsletters([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                var result = await _newsletter.GetPagedNewslettersAsync(pageNumber, pageSize);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống: " + ex.Message });
            }
        }
    }
}
