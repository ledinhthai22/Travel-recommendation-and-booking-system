using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using travel_recommendation_and_booking_system.DTOs.TypeLocation;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Models;

namespace travel_recommendation_and_booking_system.Controllers.Admin
{
    [Route("api/admin/[controller]")]
    [ApiController]
    [Authorize]
    public class TypeLocationController : ControllerBase
    {
        private readonly ITypeLocation _type;
        public TypeLocationController(ITypeLocation type) { 
            _type = type;
        }

        [HttpGet("get-typelocation")]
        public async Task<IActionResult> GetTypeLocaton([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 9, [FromQuery] string? key = null)
        {
            try
            {
                var result = await _type.getTypeLocationAsync(pageNumber, pageSize, key);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống: " + ex.Message });
            }
        }

        [HttpPost("create-typelocation")]
        public async Task<IActionResult> CreateTypeLocation([FromBody] TypeLocationDTO dto)
        {
            try
            {
                if (dto == null || string.IsNullOrWhiteSpace(dto.TenLoaiDD))
                    return BadRequest(new { message = "Dữ liệu không được để trống!" });

                var success = await _type.CreateTypeLocationAsync(dto);

                if (!success)
                    return BadRequest(new { message = "Tên loại địa điểm đã tồn tại!" });

                return Ok(new { message = "Thêm thành công" });
            }
            catch (Exception ex)
            {
                // Đây là bước quan trọng nhất: Lấy lỗi chi tiết từ Database
                var message = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                return BadRequest(new { message = "Lỗi Database: " + message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTypeLocation(int id, [FromBody] TypeLocationDTO dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var success = await _type.UpdateTypeLocationAsync(id, dto);

            if (!success)
            {
                return BadRequest(new { message = "Cập nhật thất bại, vui lòng kiểm tra lại tên hoặc ID!" });
            }

            return Ok(new { message = "Cập nhật thành công" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTypeLocation(int id)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var success =await _type.DeleteTypeLocationAsync(id);
            if (!success)
            {
                return BadRequest(new { message = "xóa thất bại" });
            }
            return Ok(new { message = "Cập nhật thành công" });
        }

    }
}
