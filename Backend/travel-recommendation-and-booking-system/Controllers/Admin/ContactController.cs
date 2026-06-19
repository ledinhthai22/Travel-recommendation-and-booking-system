using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using travel_recommendation_and_booking_system.Interfaces;

namespace travel_recommendation_and_booking_system.Controllers.Admin
{
    [Route("api/admin/[controller]")]
    [ApiController]
    [Authorize(Policy = "Admin&Staff")]
    public class ContactController : ControllerBase
    {
        private readonly IContactService _contact;
        public ContactController(IContactService contact)
        {
            _contact = contact;
        }

        [HttpGet("get-contact")]
        public async Task<IActionResult> GetContacts([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, [FromQuery] string? key = null, [FromQuery] bool? status = null)
        {
            try
            {
                var result = await _contact.GetPagedContactsAsync(pageNumber, pageSize, key, status);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống: " + ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> SoftDeleteContact(int id)
        {
            try
            {
                var iscontact = await _contact.SoftDeleteContactAsync(id);
                if (!iscontact)
                {
                    return NotFound(new { success = false, message = "Không tìm thấy liên hệ này hoặc đã bị xóa từ trước" });
                }
                return Ok(new { success = true, message = "Đã xóa liên hệ đăng ký thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống: " + ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetContactById(int id)
        {
            try
            {
                var result = await _contact.GetContactByIdAsync(id);

                if (result == null)
                {
                    return NotFound(new { success = false, message = "Không tìm thấy thông tin liên hệ hoặc dữ liệu đã bị xóa" });
                }

                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống: " + ex.Message });
            }
        }
    }
}