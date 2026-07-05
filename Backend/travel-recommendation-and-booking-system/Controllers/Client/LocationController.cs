using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Services;

namespace travel_recommendation_and_booking_system.Controllers.Client
{
    [Route("api/[controller]")]
    [ApiController]

    public class PublicLocationController : ControllerBase
    {
        private readonly ILocationService _IlocationService;
        public PublicLocationController(ILocationService locationService)
        {
            _IlocationService = locationService;
        }

        [HttpGet("destination/featured")]
        [AllowAnonymous]
        public async Task<IActionResult> GetFeaturedDestinations([FromQuery] int limit = 8)
        {
            var destinations = await _IlocationService.GetFeaturedDestinationsAsync(limit);
            return Ok(destinations);
        }
    }
}
