using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using travel_recommendation_and_booking_system.DTOs.Tour;
using travel_recommendation_and_booking_system.DTOs.TypeTour;
using travel_recommendation_and_booking_system.Interfaces;

namespace travel_recommendation_and_booking_system.Controllers.Customer
{
    [Route("api/customer/[controller]")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        private readonly ITourService _tourService;
        private readonly ILocationService _locationService;

        public HomeController(ITourService tourService, ILocationService locationService)
        {
            _tourService = tourService;
            _locationService = locationService;
        }


        [HttpGet("featured")]
        [AllowAnonymous]   
        public async Task<IActionResult> GetFeaturedTours([FromQuery] int take = 12)
        {
            var tours = await _tourService.GetFeaturedToursAsync(take);
            return Ok(tours);
        }


        [HttpGet("new-updated")]
        [AllowAnonymous]
        public async Task<IActionResult> GetNewlyUpdatedTours([FromQuery] int take = 8)
        {
            var tours = await _tourService.GetNewlyUpdatedToursAsync(take);
            return Ok(tours);
        }

        [HttpGet("destination/{diemDen}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetToursByDestination(string diemDen, [FromQuery] int take = 6)
        {
            if (string.IsNullOrWhiteSpace(diemDen))
                return BadRequest("Điểm đến không được để trống");

            var tours = await _tourService.GetToursByFeaturedDestinationAsync(diemDen, take);
            return Ok(tours);
        }
        [HttpGet("most-booked")]
        public async Task<IActionResult> GetMostBookedTours([FromQuery] int take = 8)
        {
            var result = await _tourService.GetMostBookedToursAsync(take);
            return Ok(result);
        }
    }
}