using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using travel_recommendation_and_booking_system.DTOs.Vehicle;
using travel_recommendation_and_booking_system.Interfaces;

namespace travel_recommendation_and_booking_system.Controllers.Admin
{
    [Route("api/admin/[controller]")]
    [ApiController]
    [Authorize]
    public class VehicleController : ControllerBase
    {
        private readonly IVehicleService _service;
        public VehicleController(IVehicleService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

        [HttpGet("paging")]
        public async Task<IActionResult> GetPaging([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, [FromQuery] string? key = null, [FromQuery] bool? status = null)
        {
            return Ok(await _service.GetVehicleAsync(pageNumber, pageSize, key, status));
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] VehicleDTO dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            return await _service.CreateVehicleAsync(dto) ? Ok("Tạo thành công") : BadRequest();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] VehicleDTO dto)
        {
            return await _service.UpdateVehicleAsync(id, dto) ? Ok("Cập nhật thành công") : NotFound();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            return await _service.SoftDeleteVehicleAsync(id) ? Ok("Xóa thành công") : NotFound();
        }
    }
}
