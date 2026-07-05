using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using travel_recommendation_and_booking_system.Interfaces;

namespace Controllers.Customer
{
    [ApiController]
    [Route("api/customer/[controller]")]
    [Authorize(Policy = "UserOnly")]
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

        [Authorize]
        [HttpGet("just-for-you")]
        public async Task<IActionResult> GetJustForYou([FromQuery] int? limit)
        {
            var userId = _currentUserService.GetUserId();
            var result = await _tourRecommendation.GetTourDesignJustForYouAsync(userId, limit);
            return Ok(result);
        }

        [Authorize]
        [HttpGet("for-you")]
        public async Task<IActionResult> GetRecommended([FromQuery] int? limit)
        {
            var userId = _currentUserService.GetUserId();
            var result = await _tourRecommendation.GetRecommendedToursAsync(userId, limit);
            return Ok(result);
        }

        [Authorize]
        [HttpGet("destinations-for-you")]
        public async Task<IActionResult> GetDestinationsForYou([FromQuery] int? limit)
        {
            var userId = _currentUserService.GetUserId();
            var result = await _tourRecommendation.GetDestinationsForYouAsync(userId, null, limit);
            return Ok(result);
        }

        [Authorize]
        [HttpGet("next-trip")]
        public async Task<IActionResult> GetNextTripSuggestions([FromQuery] int? limit)
        {
            var userId = _currentUserService.GetUserId();
            var result = await _tourRecommendation.GetNextTripSuggestionsAsync(userId, limit);
            return Ok(result);
        }

        [Authorize]
        [HttpPost("track-view/{tourId:int}")]
        public async Task<IActionResult> TrackView(int tourId)
        {
            var userId = _currentUserService.GetUserId();
            await _tourRecommendation.TrackViewTourAsync(userId, tourId);
            return NoContent();
        }

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