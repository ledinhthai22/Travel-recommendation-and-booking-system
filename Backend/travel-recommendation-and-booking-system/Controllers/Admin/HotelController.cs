using Microsoft.AspNetCore.Mvc;
using travel_recommendation_and_booking_system.DTOs.Hotel;
using travel_recommendation_and_booking_system.Interfaces;

namespace travel_recommendation_and_booking_system.Controllers.Admin
{
    [Route("api/admin/[controller]")]
    [ApiController]
    public class HotelController : ControllerBase
    {
        private readonly IHotelService _hotelService;

        public HotelController(IHotelService hotelService)
        {
            _hotelService = hotelService;
        }

        [HttpGet]
        public async Task<IActionResult> GetPaged([FromQuery] HotelDTO hotel, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var result = await _hotelService.GetPagedHotelAsync(
                pageNumber,
                pageSize,
                hotel);

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _hotelService.GetHotelByIdAsync(id);

            if (result == null)
            {
                return NotFound(new
                {
                    Message = "Không tìm thấy khách sạn"
                });
            }

            return Ok(result);
        }

        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Create([FromForm] CreateHotelDTO hotel, [FromForm] List<IFormFile> images)
        {
            var id = await _hotelService.CreateHotelAsync(hotel, images);

            return Ok(new
            {
                Message = "Thêm khách sạn thành công",
                MaKhachSan = id
            });
        }

        [HttpPut("{id}")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Update(int id, [FromForm] CreateHotelDTO hotel, [FromForm] List<IFormFile>? images)
        {
            var result = await _hotelService.UpdateHotelAsync(id, hotel, images);

            return Ok(new
            {
                Message = "Cập nhật khách sạn thành công",
                Success = result
            });
        }

        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateHotelStatusDTO statusDto)
        {
            var result = await _hotelService.UpdateStatusAsync(id, statusDto.TrangThai);
            return Ok(new
            {
                Message = "Cập nhật trạng thái thành công",
                Success = result
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _hotelService.DeleteAsync(id);

            return Ok(new
            {
                Message = "Xóa khách sạn thành công",
                Success = result
            });
        }

        [HttpPatch("images/{imageId}/set-main")]
        public async Task<IActionResult> SetMainImage(int imageId)
        {
            var result = await _hotelService.SetMainImageAsync(imageId);

            return Ok(new
            {
                Message = "Đặt ảnh chính thành công",
                Success = result
            });
        }

        [HttpDelete("images/{imageId}")]
        public async Task<IActionResult> DeleteImage(int imageId)
        {
            var result = await _hotelService.DeleteImageAsync(imageId);

            return Ok(new
            {
                Message = "Xóa ảnh thành công",
                Success = result
            });
        }
    }
}