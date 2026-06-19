using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using travel_recommendation_and_booking_system.DTOs.Amenities;
using travel_recommendation_and_booking_system.Interfaces;

namespace travel_recommendation_and_booking_system.Controllers.Admin
{
    [Route("api/admin/[controller]")]
    [ApiController]
    [Authorize(Policy = "Admin&Staff")]
    public class AmenitiesController : ControllerBase
    {
        private readonly IAmenitiesService _amenitiesservice;

        public AmenitiesController(
            IAmenitiesService amenitiesservice)
        {
            _amenitiesservice = amenitiesservice;
        }
        [HttpGet("paged")]
        public async Task<IActionResult> GetPagedPromotionsAsync([FromQuery] int pageNumber, [FromQuery] int pageSize, [FromQuery] AmenitiesDTO amenities)
        {
            var result = await _amenitiesservice.GetPagedAmenitiesAsync(
                pageNumber,
                pageSize,
                amenities);

            return Ok(result);
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _amenitiesservice.GetAllAsync());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            return Ok(await _amenitiesservice.GetByIdAsync(id));
        }

        [HttpPost]
        public async Task<IActionResult> Create(AmenitiesDTO dto)
        {
            var id = await _amenitiesservice.CreateAsync(dto);

            return Ok(new
            {
                Message = "Thêm tiện nghi thành công",
                Id = id
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, AmenitiesDTO dto)
        {
            await _amenitiesservice.UpdateAsync(id, dto);

            return Ok(new
            {
                Message = "Cập nhật thành công"
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _amenitiesservice.DeleteAsync(id);

            return Ok(new
            {
                Message = "Xóa thành công"
            });
        }
    }
}