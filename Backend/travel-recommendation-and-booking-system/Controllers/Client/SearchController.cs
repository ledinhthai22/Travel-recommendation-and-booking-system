using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using travel_recommendation_and_booking_system.DTOs.Tour;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Models;

namespace travel_recommendation_and_booking_system.Controllers.Client
{
    [ApiController]
    [Route("api/client/[controller]")]
    public class SearchController : ControllerBase
    {
        private readonly ITourService _tourService;
        private readonly ITypeTourService _typeTourService;

        public SearchController(ITourService tourService, ITypeTourService typeTourService)
        {
            _tourService = tourService;
            _typeTourService = typeTourService;
        }

        [HttpGet("filter")]
        [AllowAnonymous]
        public async Task<IActionResult> FilterTours([FromQuery] FilterTourDTO request)
        {
            var result = await _tourService.FilterToursAsync(request);
            return Ok(result);
        }
        [HttpGet("type-tour")]
        [AllowAnonymous]
        public async Task<IActionResult> getAllTypeTour()
        {
            var result = await _typeTourService.GetAllAsync();
            return Ok(result);
        }
    }
}