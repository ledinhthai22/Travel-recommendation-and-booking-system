using Microsoft.AspNetCore.Mvc;
using travel_recommendation_and_booking_system.DTOs.Amenities;
using travel_recommendation_and_booking_system.Interfaces;

namespace travel_recommendation_and_booking_system.Controllers.Admin
{
    [Route("api/admin/[controller]")]
    [ApiController]
    public class AmenitiesController : ControllerBase
    {
        private readonly IAmenitiesService _service;

        public AmenitiesController(
            IAmenitiesService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _service.GetAllAsync());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            return Ok(await _service.GetByIdAsync(id));
        }

        [HttpPost]
        public async Task<IActionResult> Create(AmenitiesDTO dto)
        {
            var id = await _service.CreateAsync(dto);

            return Ok(new
            {
                Message = "Thêm tiện nghi thành công",
                Id = id
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, AmenitiesDTO dto)
        {
            await _service.UpdateAsync(id, dto);

            return Ok(new
            {
                Message = "Cập nhật thành công"
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteAsync(id);

            return Ok(new
            {
                Message = "Xóa thành công"
            });
        }
    }
}