using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using travel_recommendation_and_booking_system.DTOs;
using travel_recommendation_and_booking_system.Interfaces;

namespace Controllers.Client
{
    [ApiController]
    [Route("api/[controller]")]
    [AllowAnonymous]
    public class PublicNewsletterController : ControllerBase
    {
        private readonly INewsletterService _newsletter;
        public PublicNewsletterController(INewsletterService newsletter)
        {
            _newsletter = newsletter;
        }

        [HttpPost("subscribe")]
        public async Task<IActionResult> Subscribe([FromBody] NewsletterDTO newsletter)
        {
            try
            {
                var result = await _newsletter.SubscribeAsync(newsletter);
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


    }
}
