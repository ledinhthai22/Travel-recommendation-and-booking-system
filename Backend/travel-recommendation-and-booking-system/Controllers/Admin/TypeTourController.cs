using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using travel_recommendation_and_booking_system.DTOs.TypeTour;
using travel_recommendation_and_booking_system.Interfaces;

namespace travel_recommendation_and_booking_system.Controllers.Admin
{
    [Route("api/admin/[controller]")]
    [ApiController]
    [Authorize(Policy = "Admin&Staff")]
    public class TypeTourController : ControllerBase
    {
        private readonly ITypeTourService _tour;
        public TypeTourController(ITypeTourService tour)
        {
            _tour = tour;
        }
        [HttpGet("get-all")]
        public async Task<IActionResult> GetAll()
        {
            var result = await _tour.GetAllAsync();
            return Ok(result);
        }
        [HttpGet("get-typetour")]
        public async Task<IActionResult> GetTypeTour([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 8, [FromQuery] string? key = null, [FromQuery] bool? status = null)
        {
            try
            {
                var result = await _tour.GetTypeTourAsync(pageNumber, pageSize, key, status);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống: " + ex.Message });
            }
        }

        [HttpPost("create-typetour")]
        public async Task<IActionResult> CreateTypeTour([FromForm] TypeTourDTO typeTour)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var istypetour = await _tour.CreateTypeTourAsync(typeTour);

            if (!istypetour)
            {
                return BadRequest("Loại tour đã tồn tại trong danh sách");
            }

            return Ok(new
            {
                success = true,
                message = "Thêm loại hình tour mới thành công!"
            });
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTypeTour(int id,[FromForm] TypeTourDTO typeTour)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var istype = await _tour.UpdateTypeTourAsync(id, typeTour);

            if (!istype)
            {
                return BadRequest("Loại tour đã tồn tại trong danh sách");
            }

            return Ok(new
            {
                success = true,
                message = "Cập nhật loại hình tour thành công!"
            });
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> SoftDeleteTypeTour(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var istype = await _tour.SoftDeleteTypeTourAsync(id);
            if (!istype)
            {
                return BadRequest(new { message = "xóa thất bại" });
            }
            return Ok(new
            {
                success = true,
                message = "xóa loại hình tour thành công!"
            });
        }
    }
}
