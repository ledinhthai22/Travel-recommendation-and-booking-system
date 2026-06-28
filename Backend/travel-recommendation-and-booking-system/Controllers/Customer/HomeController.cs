using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using travel_recommendation_and_booking_system.DTOs.Tour;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Services;

namespace travel_recommendation_and_booking_system.Controllers.Customer
{
    [Route("api/customer/[controller]")]
    [ApiController]
    [Authorize(Policy = "UserOnly")]
    public class HomeController : ControllerBase
    {
        private ITourService _tour;
        private ILocationService _location;
        public HomeController (ITourService tour, ILocationService location)
        {
            _tour = tour;
            _location = location;
        }

        // địa điểm dành riêng cho bạn
        [HttpGet("get-recommended")]
        public async Task<IActionResult> GetRecommendedLocations([FromQuery] int? limit = null)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized(new { message = "Bạn cần đăng nhập để xem gợi ý." });

            if (!int.TryParse(userIdClaim, out int userId))
                return BadRequest(new { message = "Token không hợp lệ." });

            var result = await _location.GetRecommendedLocationsAsync(userId, limit);

            return Ok(result);
        }

        //tour dành riêng cho  bạn
        [HttpGet("get-tour-design")]
        public async Task<IActionResult> GetTourDesignJustForYou([FromQuery] int? limit = null)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized(new { message = "Bạn cần đăng nhập để xem gợi ý." });

            if (!int.TryParse(userIdClaim, out int userId))
                return BadRequest(new { message = "Token không hợp lệ." });

            var result = await _tour.GetTourDesignJustForYouAsync(userId, limit);

            return Ok(result);
        }


        // Có thể bạn quan tâm
        [HttpGet("get-recommended-tours")]
        public async Task<IActionResult> GetRecommendedTours([FromQuery] int? limit = null)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized(new { message = "Vui lòng đăng nhập để xem gợi ý cá nhân." });
            if (!int.TryParse(userIdClaim, out int userId))
                return BadRequest(new { message = "Token không hợp lệ." });
            var result = await _tour.GetRecommendedToursAsync(userId, limit);

            return Ok(result);
        }

        // gợi ý chuyến đi tiếp theo    
        [HttpGet("get-next-trip-suggestions")]
        public async Task<IActionResult> GetNextTripSuggestions([FromQuery] int? limit = null)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized(new { message = "Bạn cần đăng nhập để xem gợi ý chuyến đi tiếp theo." });

            if (!int.TryParse(userIdClaim, out int userId))
                return BadRequest(new { message = "Token không hợp lệ." });

            try
            {
                var suggestions = await _tour.GetNextTripSuggestionsAsync(userId, limit);

                return Ok(suggestions ?? new List<TourCardDTO>());
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Đã xảy ra lỗi hệ thống khi tải gợi ý.", error = ex.Message });
            }
        }
    }
}
