using Microsoft.AspNetCore.Mvc;
using travel_recommendation_and_booking_system.DTOs;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Models;

namespace travel_recommendation_and_booking_system.Controllers.Client
{
    [Route("api/[controller]")]
    [ApiController]
    public class PublicTourController : ControllerBase
    {
        private readonly ITourService _tourService;
        private ITourRecommendationService _ItourRecommendationService;
        private ICurrentUserService _IcurrentUserService;
        public PublicTourController(ITourService tourService, ITourRecommendationService itourRecommendationService, ICurrentUserService icurrentUserService)
        {
            _tourService = tourService;
            _ItourRecommendationService = itourRecommendationService;
            _IcurrentUserService = icurrentUserService;
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

               
                if (User.Identity?.IsAuthenticated == true)
                {
                    var userId = _IcurrentUserService.GetUserId();

                    await _ItourRecommendationService.TrackViewTourAsync(
                        userId,
                        result.TourInfo.MaTour
                    );
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
        [HttpGet("search")]
        public async Task<IActionResult> SearchTours([FromQuery] SearchDTO request)
        {
            var result = await _tourService.SearchToursAsync(request);
            return Ok(result);
        }
        [HttpGet("{maTour}/related")]
        public async Task<IActionResult> GetRelatedTours(int maTour)
        {
            var result = await _tourService.GetRelatedToursAsync(maTour);

            return Ok(result);
        }
        [HttpGet("{maKhachSan}/related-tours-hotel")]
        public async Task<IActionResult> GetRelatedToursWithHotel(int maKhachSan)
        {
            var data = await _tourService.GetRelatedToursByHotelAsync(maKhachSan);

            return Ok(data);
        }
    }
}

