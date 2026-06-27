using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using travel_recommendation_and_booking_system.DTOs.Promotion;
using travel_recommendation_and_booking_system.Interfaces;

namespace travel_recommendation_and_booking_system.Controllers.Admin
{
    [Route("api/admin/[controller]")]
    [ApiController]
    [Authorize(Policy = "AdminOnly")]
    public class PromotionController : ControllerBase
    {
        private readonly IPromotionService _promotionService;

        public PromotionController(IPromotionService promotionService)
        {
            _promotionService = promotionService;
        }

        [HttpGet]
        public async Task<IActionResult> GetPagedPromotionsAsync( [FromQuery] int pageNumber,[FromQuery] int pageSize, [FromQuery] PromotionDTO promotion)
        {
            var result = await _promotionService.GetPagedPromotionsAsync(
                pageNumber,
                pageSize,
                promotion);

            return Ok(result);
        }

        [HttpGet("booking-select")]
        public async Task<IActionResult> GetPromotionsForBookingSelect( [FromQuery] int? status = null)
        {
            try
            {
                var promotions = await _promotionService.GetPromotionsForSelectAsync(status);
                return Ok(new
                {
                    success = true,
                    data = promotions
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi khi lấy danh sách ưu đãi",
                    error = ex.Message
                });
            }
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPromotionByIdAsync(int id)
        {
            var result = await _promotionService.GetPromotionByIdAsync(id);

            if (result == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy ưu đãi"
                });
            }

            return Ok(result);
        }


        [HttpPost]
        public async Task<IActionResult> CreateAsync( [FromBody] PromotionDTO promotion)
        {
            var result = await _promotionService.CreateAsync(promotion);

            return Ok(new
            {
                message = "Tạo ưu đãi thành công",
                data = result
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAsync( int id,[FromBody] PromotionDTO promotion)
        {
            var result = await _promotionService.UpdateAsync(id, promotion);

            if (result == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy ưu đãi"
                });
            }

            return Ok(new
            {
                message = "Cập nhật ưu đãi thành công",
                data = result
            });
        }

        [HttpPatch("{id}/status")]
        public async Task<IActionResult> ChangeStatusAsync( int id, [FromBody] ChangePromotionStatusDTO request)
        {
            var success = await _promotionService.ChangeStatusAsync(
                id,
                request.IsActive);

            if (!success)
            {
                return BadRequest(new
                {
                    message = "Không thể thay đổi trạng thái ưu đãi"
                });
            }

            return Ok(new
            {
                message = request.IsActive
                    ? "Kích hoạt ưu đãi thành công"
                    : "Ngưng hoạt động ưu đãi thành công"
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _promotionService.DeleteAsync(id);

            if (!success)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy ưu đãi"
                });
            }

            return Ok(new
            {
                message = "Xóa ưu đãi thành công"
            });
        }
    }
}