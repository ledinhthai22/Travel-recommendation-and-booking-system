using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using travel_recommendation_and_booking_system.DTOs.Location;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Services;

namespace travel_recommendation_and_booking_system.Controllers.Admin
{
    [Route("api/admin/[controller]")]
    [ApiController]
    [Authorize(Policy = "Admin&Staff")]
    public class LocationController : ControllerBase
    {
        private readonly ILocationService _location;
        public LocationController(ILocationService location)
        {
            _location = location;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _location.GetAllAsync();
            return Ok(result);
        }
        [HttpGet("dropdown-by-province")]
        public async Task<IActionResult> GetLocationsByProvince( [FromQuery] string tinhThanh)
        {
            var result = await _location.GetLocationsByProvinceAsync(tinhThanh);

            return Ok(result);
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
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] bool trangThai)
        {
            var result = await _location.UpdateStatusAsync(id, trangThai);

            if (!result)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Không tìm thấy địa điểm!"
                });
            }

            return Ok(new
            {
                success = true,
                message = trangThai
                    ? "Đã bật trạng thái địa điểm"
                    : "Đã tắt trạng thái địa điểm"
            });
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
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }
    }
}
