using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using travel_recommendation_and_booking_system.Interfaces;

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

        [HttpGet("cards")]
        [AllowAnonymous]
        public async Task<IActionResult> GetLocationCards([FromQuery] int? limit)
        {
            var result = await _IlocationService.GetLocationCardsAsync(limit);
            return Ok(result);
        }
    }
}
