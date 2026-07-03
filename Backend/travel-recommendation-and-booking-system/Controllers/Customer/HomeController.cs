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


  
    }
}
