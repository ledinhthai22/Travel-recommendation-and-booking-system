using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using travel_recommendation_and_booking_system.DTOs;
using travel_recommendation_and_booking_system.Interfaces;

namespace travel_recommendation_and_booking_system.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactController : ControllerBase
    {
        private readonly IContactService _contact;
        public ContactController(IContactService contact)
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

        
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetContacts([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                var result = await _contact.GetPagedContactsAsync(pageNumber, pageSize);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống: " + ex.Message });
            }
        }
    }
}
