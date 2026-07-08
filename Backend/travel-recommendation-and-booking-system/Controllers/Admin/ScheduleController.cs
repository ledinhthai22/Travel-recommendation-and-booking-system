using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using travel_recommendation_and_booking_system.DTOs.Schedule;
using travel_recommendation_and_booking_system.DTOs.ScheduleDetails;
using travel_recommendation_and_booking_system.Interfaces;

namespace travel_recommendation_and_booking_system.Controllers.Admin
{
    [Route("api/admin/[controller]")]
    [ApiController]
    [Authorize(Policy = "Admin&Staff")]
    public class ScheduleController : ControllerBase
    {
        private readonly IScheduleService _service;

        public ScheduleController(IScheduleService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> AddSchedule([FromForm] ScheduleDTO dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                // SỬA: Trả về dữ liệu mới thay vì bool
                var result = await _service.AddScheduleAsync(dto);
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
            var list = await _service.GetByTourAsync(maTour);
            return Ok(list);
        }

        [HttpPut("{maLichTrinh}")]
        public async Task<IActionResult> UpdateSchedule(int maLichTrinh, [FromForm] ScheduleDTO dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                // SỬA: Trả về dữ liệu mới thay vì bool
                var result = await _service.UpdateScheduleAsync(maLichTrinh, dto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{maLichTrinh}")]
        public async Task<IActionResult> DeleteSchedule(int maLichTrinh)
        {
            try
            {
                var result = await _service.DeleteScheduleAsync(maLichTrinh);
                return result ? Ok(new { message = "Đã xóa lịch trình thành công!" }) : NotFound("Không tìm thấy lịch trình.");
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("create-ScheduleDetail")]
        public async Task<IActionResult> AddScheduleDetail([FromBody] ScheduleDetailsDTO dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                var result = await _service.AddCTLTAsync(dto);
                return result ? Ok(new { message = "Thêm hoạt động thành công!" }) : BadRequest("Thêm hoạt động thất bại.");
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("by-Schedule/{maLichTrinh}")]
        public async Task<IActionResult> GetBySchedule(int maLichTrinh)
        {
            var list = await _service.GetByLichTrinhAsync(maLichTrinh);
            return Ok(list);
        }

        [HttpPut("update-ScheduleDetail/{maCTLT}")]
        public async Task<IActionResult> UpdateScheduleDetail(int maCTLT, [FromBody] ScheduleDetailsDTO dto)
        {
            try
            {
                var result = await _service.UpdateCTLTAsync(maCTLT, dto);
                return result ? Ok(new { message = "Cập nhật thành công!" }) : NotFound("Không tìm thấy chi tiết lịch trình.");
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("delete-ScheduleDetail/{maCTLT}")]
        public async Task<IActionResult> DeleteScheduleDetail(int maCTLT)
        {
            try
            {
                var result = await _service.DeleteCTLTAsync(maCTLT);
                return result ? Ok(new { message = "Xóa thành công!" }) : NotFound("Không tìm thấy chi tiết lịch trình.");
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}