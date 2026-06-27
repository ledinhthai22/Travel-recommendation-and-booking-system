using Microsoft.AspNetCore.Mvc;
using travel_recommendation_and_booking_system.Interfaces;

namespace travel_recommendation_and_booking_system.Controllers.Client
{
    [Route("api/[controller]")]
    [ApiController]
    public class PublicTourController : ControllerBase
    {
        private readonly ITourService _tourService;

        public PublicTourController(ITourService tourService)
        {
            _tourService = tourService;
        }

        [HttpGet("slug/{slug}")]
        public async Task<IActionResult> GetTourDetailBySlug(string slug)
        {
            try
            {
                var result = await _tourService.GetTourDetailBySlugAsync(slug);

                if (result == null)
                {
                    return NotFound(new
                    {
                        message = "Không tìm thấy tour."
                    });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = $"Đã xảy ra lỗi: {ex.Message}"
                });
            }
        }

        [HttpGet("location/{locationSlug}")]
        public async Task<IActionResult> GetToursByLocationSlug(string locationSlug)
        {
            try
            {
                var result = await _tourService.GetToursByLocationSlugAsync(locationSlug);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = $"Đã xảy ra lỗi: {ex.Message}"
                });
            }
        }
    }
}

