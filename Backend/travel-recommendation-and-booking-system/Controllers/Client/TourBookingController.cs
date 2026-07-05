using Microsoft.AspNetCore.Mvc;
using travel_recommendation_and_booking_system.DTOs.TourBooking;
using travel_recommendation_and_booking_system.Interfaces;

namespace travel_recommendation_and_booking_system.Controllers.User
{
    [Route("api/user/tour-bookings")]
    [ApiController]
    public class UserTourBookingsController : ControllerBase
    {
        private readonly ITourBookingService _service;
        private readonly ICurrentUserService _currentUserService;
        private readonly ITourRecommendationService _tourRecommendationService;
        public UserTourBookingsController(ITourBookingService service, ICurrentUserService currentUserService, ITourRecommendationService tourRecommendationService)
        {
            _service = service;
            _currentUserService = currentUserService;
            _tourRecommendationService = tourRecommendationService;
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUserBookings(int userId)
        {
            var result = await _service.GetUserBookingsAsync(userId);
            return Ok(result);
        }

        [HttpGet("{userId}/{bookingId}")]
        public async Task<IActionResult> GetDetail(int userId, int bookingId)
        {
            var result = await _service.GetUserBookingDetailAsync(bookingId, userId);
            if (result == null) return NotFound();

            return Ok(result);
        }


        [HttpPost("{userId}")]
        public async Task<IActionResult> CreateBooking(
            int userId,
            [FromBody] CreateBookingClientDTO dto,
            [FromQuery] int? holdId)
        {
            var id = await _service.CreateBookingByClientAsync(userId, dto, holdId);
            return Ok(new { id });
        }

        [HttpPut("{userId}/{bookingId}/cancel")]
        public async Task<IActionResult> Cancel(int userId, int bookingId)
        {
            var result = await _service.CancelByUserAsync(bookingId, userId);
            if (!result) return NotFound();

            return Ok(new { message = "Cancelled" });
        }


        [HttpPost("{userId}/reserve")]
        public async Task<IActionResult> Reserve(int userId, [FromBody] ReserveSeatsDTO dto)
        {
            var result = await _service.ReserveSeatsAsync(userId, dto);
            return Ok(result);
        }

        [HttpDelete("{userId}/reserve/{holdId}")]
        public async Task<IActionResult> Release(int userId, int holdId)
        {
            await _service.ReleaseReservationAsync(holdId, userId);
            return Ok(new { message = "Released" });
        }
    }
}