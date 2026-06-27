using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
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
        private IDestinationService _destination;
        public HomeController (ITourService tour, IDestinationService destination)
        {
            _tour = tour;
            _destination = destination;
        }

        //tour dành riêng cho  bạn
        [HttpGet("get-tour-design")]
        public async Task<IActionResult> GetTourDesignJustForYou()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized("Bạn cần đăng nhập để xem gợi ý.");

            int userId = int.Parse(userIdClaim);

            var result = await _tour.GetTourDesignJustForYouAsync(userId);

            return Ok(result);
        }

        // địa điểm dành riêng cho bạn
        [HttpGet("get-recommended")]
        public async Task<IActionResult> GetRecommendedLocations()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized();

            int userId = int.Parse(userIdClaim);
            var result = await _destination.GetRecommendedLocationsAsync(userId);

            return Ok(result);
        }

        // Có thể bạn quan tâm
        [HttpGet("get-recommended-tours")]
        public async Task<IActionResult> GetRecommendedTours()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            // Nếu chưa đăng nhập, bạn có thể trả về Unauthorized hoặc danh sách tour Best Selling (không gợi ý)
            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized("Vui lòng đăng nhập để xem gợi ý cá nhân.");

            int userId = int.Parse(userIdClaim);
            var result = await _tour.GetRecommendedToursAsync(userId);

            return Ok(result);
        }
    }
}
