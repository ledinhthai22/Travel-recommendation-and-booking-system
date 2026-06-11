using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using travel_recommendation_and_booking_system.Interfaces;

namespace travel_recommendation_and_booking_system.Controllers.Client
{

    [ApiController]
    [Route("api/[controller]")]
    [AllowAnonymous]
    public class PublicWebInfoController : ControllerBase
    {
        private readonly IWebInfoService _webInfoService;

        public PublicWebInfoController(
            IWebInfoService webInfoService)
        {
            _webInfoService = webInfoService;
        }

        [HttpGet("settings")]
        public async Task<IActionResult> GetSettings()
        {
            var result =
                await _webInfoService.GetWebInfoSettingsClientAsync();

            return Ok(result);
        }
    }

}
