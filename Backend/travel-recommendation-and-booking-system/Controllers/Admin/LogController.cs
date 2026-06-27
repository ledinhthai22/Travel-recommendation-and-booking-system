using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using travel_recommendation_and_booking_system.Interfaces;

namespace travel_recommendation_and_booking_system.Controllers
{
    [ApiController]
    [Route("api/admin/[controller]")]
    [Authorize(Policy = "AdminOnly")]
    public class LogController : ControllerBase
    {
        private readonly ILogService _logService;

        public LogController(ILogService logService)
        {
            _logService = logService;
        }

        [HttpGet]
        public async Task<IActionResult> GetPagedLogs(
            [FromQuery] int page = 1,
            [FromQuery] int size = 10,
            [FromQuery] string? key = null,
            [FromQuery] string? accountType = null,
            [FromQuery] int? accountId = null)
        {
            try
            {
                var result = await _logService.GetPagedLogsAsync(page, size, key, accountType, accountId);
                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }


        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetLogById(int id)
        {
            try
            {
                if (id <= 0)
                    return BadRequest(new { success = false, message = "ID không hợp lệ." });

                var result = await _logService.GetLogByIdAsync(id);
                if (result == null)
                    return NotFound(new { success = false, message = "Không tìm thấy bản ghi log." });

                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
    }
}