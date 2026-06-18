using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using travel_recommendation_and_booking_system.DTOs.Banner;
using travel_recommendation_and_booking_system.DTOs.Location;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Models;

namespace travel_recommendation_and_booking_system.Controllers.Admin
{
    [Route("api/admin/[controller]")]
    [ApiController]
    [Authorize]
    public class LocationController : ControllerBase
    {
        private readonly ILocationService _location;
        public LocationController(ILocationService location) {
            _location = location;
        }
        [HttpGet("get-location")]
        public async Task<IActionResult> GetLocation([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, [FromQuery] string? key = null, [FromQuery] bool? status = null)
        {
            try
            {
                var result = await _location.GetLocationAsync(pageNumber, pageSize, key, status);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống: " + ex.Message });
            }
        }

        [HttpPost("create-location")]
        public async Task<IActionResult> CreateLocation([FromForm] LocationDTO location)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (location.DuongDanAnh == null || location.DuongDanAnh.Length == 0)
            {
                return BadRequest(new { success = false, message = "Vui lòng chọn hình ảnh location." });
            }

            if (location.DuongDanAnh.Length > 10 * 1024 * 1024)
            {
                return BadRequest(new { success = false, message = "File ảnh vượt quá dung lượng cho phép (Tối đa 10MB)." });
            }

            var isSuccess = await _location.CreateLocationAsync(location);

            if (!isSuccess)
            {
                return BadRequest(new { success = false, message = "Thêm location thất bại." });
            }

            return Ok(new { success = true, message = "Thêm location mới thành công" });
            
           
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLocation(int id, [FromForm] LocationDTO location)
        {
            ModelState.Remove("DuongDanAnh");

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var isSuccess = await _location.UpdateLocationAsync(id, location);

            if (!isSuccess)
            {
                return BadRequest(new { success = false, message = "Cập nhật thất bại." });
            }

            return Ok(new { success = true, message = "Cập nhật thành công" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> SoftDelelteLocation(int id)
        {
            try
            {
                var islocation = await _location.SoftDeleteLocationAsync(id);
                if (!islocation)
                {
                    return NotFound(new { success = false, message = "Không tìm thấy địa điểm này hoặc đã bị xóa từ trước" });
                }
                return Ok(new { success = true, message = "Đã xóa địa điểm thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống: " + ex.Message });
            }
        }
    }
}
