using Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using travel_recommendation_and_booking_system.Constants;
using travel_recommendation_and_booking_system.DTOs.Tour;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Models;
using travel_recommendation_and_booking_system.Services;

namespace travel_recommendation_and_booking_system.Controllers.Client
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class HomeController : ControllerBase
    {
        private readonly IRecommendationService _recommen;
        private readonly ITourService _tour;
        private readonly ILocationService _location;

        public HomeController(IRecommendationService recommen,ITourService tour, ILocationService location)
        {
            _recommen = recommen;
            _tour = tour;
            _location = location;
           
        }
        
        //ds Tour nổi bật
        [HttpGet("get-best-tours")]
        public async Task<IActionResult> GetBestTours([FromQuery] int? limit)
        {
            try
            {
                var tours = await _tour.GetBestToursCardAsync(limit);
                return Ok(tours);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi hệ thống: {ex.Message}");
            }
        }
        
        //ds tour mới nhất
        [HttpGet("tours-latest")]
        public async Task<IActionResult> GetLatestTours([FromQuery] int? limit)
        {
            try
            {
                var tours = await _tour.GetLatestToursAsync(limit);
                return Ok(tours);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi hệ thống: {ex.Message}");
            }

        }

        // tìm kiếm chuyến đi
        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] TourFilterParamsDTO p)
        {
            return Ok(await _tour.GetFilteredToursAsync(p));
        }

    }
}
