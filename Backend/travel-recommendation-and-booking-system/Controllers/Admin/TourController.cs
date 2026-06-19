using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using travel_recommendation_and_booking_system.DTOs.Tour;
using travel_recommendation_and_booking_system.DTOs.Tour_KS;
using travel_recommendation_and_booking_system.Interfaces;

namespace travel_recommendation_and_booking_system.Controllers.Admin
{
    [Route("api/admin/[controller]")]
    [ApiController]
    [Authorize(Policy = "Admin&Staff")]
    public class TourController : ControllerBase
    {
        private readonly ITourService _tour;
        public TourController(ITourService tour)
        {
            _tour = tour;
        }

        [HttpGet]
        public async Task<IActionResult> GetPaged([FromQuery] int pageNumber, [FromQuery] int pageSize, [FromQuery] string key = "", [FromQuery] bool? status = null)
        {
            var result = await _tour.GetPagedTourAsync(pageNumber, pageSize, key, status);

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _tour.GetTourByIdAsync(id);

            if (result == null)
            {
                return NotFound(new
                {
                    Message = "Không tìm thấy tour"
                });
            }

            return Ok(result);
        }

        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Create([FromForm] TourDTO tour, [FromForm] List<IFormFile> images)
        {
            var id = await _tour.CreateTourAsync(tour, images);

            return Ok(new
            {
                Message = "Thêm tour thành công",
                MaTour = id
            });
        }

        [HttpPut("{id}")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Update(int id, [FromForm] TourDTO tour, [FromForm] List<IFormFile>? images)
        {
            var result = await _tour.UpdateTourAsync(id, tour, images);

            return Ok(new
            {
                Message = "Cập nhật tour thành công",
                Success = result
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _tour.DeleteTourAsync(id);

            return Ok(new
            {
                Message = "Xóa tour thành công",
                Success = result
            });
        }

        [HttpPatch("images/{imageId}/set-main")]
        public async Task<IActionResult> SetMainImage(int imageId)
        {
            var result = await _tour.SetMainImageAsync(imageId);

            return Ok(new
            {
                Message = "Đặt ảnh chính thành công",
                Success = result
            });
        }

        [HttpDelete("images/{imageId}")]
        public async Task<IActionResult> DeleteImage(int imageId)
        {
            var result = await _tour.DeleteImageAsync(imageId);

            return Ok(new
            {
                Message = "Xóa ảnh thành công",
                Success = result
            });
        }

        [HttpPost("create-tour-ks")]
        public async Task<IActionResult> Add([FromBody] Tour_KSDTO dto)
        {
            return await _tour.AddToTourAsync(dto)
                ? Ok("Đã gán khách sạn vào tour")
                : BadRequest("Không thể gán (có thể đã tồn tại)");
        }

        [HttpDelete("{maTour}/{maKhachSan}")]
        public async Task<IActionResult> Remove(int maTour, int maKhachSan)
        {
            return await _tour.RemoveFromTourAsync(maTour, maKhachSan)
                ? Ok("Đã gỡ khách sạn khỏi tour")
                : NotFound();
        }

    }
}
