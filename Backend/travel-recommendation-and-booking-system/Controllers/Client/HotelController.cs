using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using travel_recommendation_and_booking_system.Interfaces;

namespace travel_recommendation_and_booking_system.Controllers.Client
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class PublicHotelController : ControllerBase
    {
        private readonly IHotelService _hotelService;

        public PublicHotelController(IHotelService hotelService)
        {
            _hotelService = hotelService;
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _hotelService.GetHotelByIdAsync(id);

            if (result == null)
            {
                return NotFound(new
                {
                    Message = "Không tìm thấy khách sạn"
                });
            }

            return Ok(result);
        }
    }
}
