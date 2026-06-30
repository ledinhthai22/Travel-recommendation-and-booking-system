using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using travel_recommendation_and_booking_system.Interfaces;

namespace travel_recommendation_and_booking_system.Controllers.Client
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class ReviewController : ControllerBase
    {
        private readonly IReviewService _review;

        public ReviewController(IReviewService review)
        {
            _review = review;
        }

        [HttpGet("approved")]
        public async Task<IActionResult> GetApprovedReviews()
        {
            return Ok(await _review.GetTop3ReviewAsync());
        }
    }
}
