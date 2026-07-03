using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using travel_recommendation_and_booking_system.Interfaces;

namespace Controllers.Client
{
    [ApiController]
    [Route("api/tours/recommendations")]
    public class TourRecommendationController : ControllerBase
    {
        private readonly ITourRecommendationService _tourRecommendation;
        private readonly ICurrentUserService _currentUserService;

        public TourRecommendationController(
            ITourRecommendationService tourRecommendation,
            ICurrentUserService currentUserService)
        {
            _tourRecommendation = tourRecommendation;
            _currentUserService = currentUserService;
        }

        // GET api/tours/recommendations/best?limit=8
        // Công khai — không cần đăng nhập
        [HttpGet("best")]
        public async Task<IActionResult> GetBestTours([FromQuery] int? limit)
        {
            var result = await _tourRecommendation.GetBestToursCardAsync(limit);
            return Ok(result);
        }

        // GET api/tours/recommendations/latest?limit=8
        [HttpGet("latest")]
        public async Task<IActionResult> GetLatestTours([FromQuery] int? limit)
        {
            var result = await _tourRecommendation.GetLatestToursAsync(limit);
            return Ok(result);
        }

        // GET api/tours/recommendations/just-for-you?limit=8
        // Cần đăng nhập — cá nhân hoá theo user hiện tại
        [Authorize]
        [HttpGet("just-for-you")]
        public async Task<IActionResult> GetJustForYou([FromQuery] int? limit)
        {
            var userId = _currentUserService.GetUserId();
            var result = await _tourRecommendation.GetTourDesignJustForYouAsync(userId, limit);
            return Ok(result);
        }

        // GET api/tours/recommendations/for-you?limit=8
        // "Có thể bạn quan tâm" — loại tour đã xem kỹ
        [Authorize]
        [HttpGet("for-you")]
        public async Task<IActionResult> GetRecommended([FromQuery] int? limit)
        {
            var userId = _currentUserService.GetUserId();
            var result = await _tourRecommendation.GetRecommendedToursAsync(userId, limit);
            return Ok(result);
        }

        // GET api/tours/recommendations/next-trip?limit=8
        [Authorize]
        [HttpGet("next-trip")]
        public async Task<IActionResult> GetNextTripSuggestions([FromQuery] int? limit)
        {
            var userId = _currentUserService.GetUserId();
            var result = await _tourRecommendation.GetNextTripSuggestionsAsync(userId, limit);
            return Ok(result);
        }

        // POST api/tours/recommendations/track-view/{tourId}
        // Gọi khi user mở trang chi tiết tour
        [Authorize]
        [HttpPost("track-view/{tourId:int}")]
        public async Task<IActionResult> TrackView(int tourId)
        {
            var userId = _currentUserService.GetUserId();
            await _tourRecommendation.TrackViewTourAsync(userId, tourId);
            return NoContent();
        }

        // POST api/tours/recommendations/track-deep-interest/{tourId}
        // Gọi khi user ở lại trang chi tiết tour đủ lâu (vd: frontend đặt timer 30s rồi gọi)
        [Authorize]
        [HttpPost("track-deep-interest/{tourId:int}")]
        public async Task<IActionResult> TrackDeepInterest(int tourId)
        {
            var userId = _currentUserService.GetUserId();
            await _tourRecommendation.TrackDeepInterestAsync(userId, tourId);
            return NoContent();
        }
    }
}