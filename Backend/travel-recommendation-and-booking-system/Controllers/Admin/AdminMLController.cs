using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Services;

namespace travel_recommendation_and_booking_system.Controllers
{
    [ApiController]
    [Route("api/admin/ml")]
    //[Authorize(Roles = "Admin")] // đổi tên role cho khớp hệ thống phân quyền thật của bạn
    public class AdminMLController : ControllerBase
    {
        private readonly ITourRecommendationTrainer _trainer;

        public AdminMLController(ITourRecommendationTrainer trainer)
        {
            _trainer = trainer;
        }

        [HttpPost("retrain")]
        public async Task<IActionResult> Retrain()
        {
            var result = await _trainer.TrainAndSaveAsync();
            return result.Success ? Ok(result) : BadRequest(result);
        }
    }
}