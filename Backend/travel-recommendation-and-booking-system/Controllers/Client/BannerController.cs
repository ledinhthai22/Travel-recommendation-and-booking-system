using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using travel_recommendation_and_booking_system.Interfaces;

namespace travel_recommendation_and_booking_system.Controllers.Client
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class PublicBannerController : ControllerBase
    {
        private readonly IBannerService _bannerService;
        public PublicBannerController(IBannerService bannerService)
        {
            _bannerService = bannerService;
        }
        [HttpGet]
        public async Task<IActionResult> GetBanner()
        {
            var banners = await _bannerService.GetBanner();
            return Ok(banners);
        }
    }
}
