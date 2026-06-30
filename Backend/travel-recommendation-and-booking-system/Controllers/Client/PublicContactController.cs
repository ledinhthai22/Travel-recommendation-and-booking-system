using DTOs.Contact;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using travel_recommendation_and_booking_system.Interfaces;

namespace Controllers.Client
{
    [ApiController]
    [Route("api/[controller]")]
    [AllowAnonymous]
    public class PublicContactController : ControllerBase
    {
        private readonly IContactService _contact;
        public PublicContactController(IContactService contact)
        {
            _contact = contact;
        }

        [HttpPost("sen-contact")]
        public async Task<IActionResult> SenContact([FromBody] ContactDTO contact)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _contact.SendContactAsync(contact);
            if (result)
            {
                return Ok(new { message = "Gửi liên hệ thành công. Chúng tôi sẽ phản hồi sớm nhất!" });
            }

            return StatusCode(500, new { message = "Có lỗi xảy ra khi gửi liên hệ" });
        }
    }
}
