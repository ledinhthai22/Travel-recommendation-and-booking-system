using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services;
using travel_recommendation_and_booking_system.DTOs.Departure;
using travel_recommendation_and_booking_system.Interfaces;

namespace travel_recommendation_and_booking_system.Controllers.Admin
{
    [Route("api/admin/[controller]")]
    [ApiController]
    [Authorize(Policy = "Admin&Staff")]
    public class DepartureController : ControllerBase
    {
        private readonly IDepartureService _service;

        public DepartureController(IDepartureService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> AddDeparture([FromBody] DepartureFullDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (dto.ChuyenKhoiHanh.NgayKetThuc < dto.ChuyenKhoiHanh.NgayKhoiHanh)
            {
                return BadRequest(new { message = "Ngày kết thúc phải sau ngày khởi hành." });
            }

            try
            {
                var result = await _service.AddDepartureFullAsync(dto);

                if (result)
                {
                    return Ok(new { message = "Khởi tạo chuyến khởi hành và bảng giá thành công!" });
                }

                return StatusCode(500, new { message = "Có lỗi xảy ra trong quá trình lưu dữ liệu." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Đã có lỗi xảy ra: " + ex.Message });
            }
        }

        [HttpPut("{maChuyen}")]
        public async Task<IActionResult> Update(int maChuyen, [FromBody] DepartureFullDTO dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                // Giả sử UpdateDepartureAsync đã được sửa để trả về DepartureFullDTO
                var result = await _service.UpdateDepartureAsync(maChuyen, dto);

                // Trả về dữ liệu mới đã update
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("tour/{maTour}")]
        public async Task<IActionResult> GetByTour(int maTour)
        {
            var result = await _service.GetByTourAsync(maTour);
            return Ok(result);
        }

        [HttpDelete("{maChuyen}")]
        public async Task<IActionResult> Delete(int maChuyen)
        {
            var result = await _service.DeleteDepartureAsync(maChuyen);
            return result ? Ok(new { message = "Xóa thành công!" }) : NotFound();
        }
        [HttpGet("booking-select")]
        public async Task<IActionResult> GetDeparturesForBookingSelect( [FromQuery] int? tourId = null, [FromQuery] string? keyword = null)
        {
            try
            {
                var departures = await _service.GetDeparturesForSelectAsync(tourId, keyword);
                return Ok(new
                {
                    success = true,
                    data = departures
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi khi lấy danh sách chuyến khởi hành",
                    error = ex.Message
                });
            }
        }
    }
}
