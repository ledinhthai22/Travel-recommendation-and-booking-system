using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using travel_recommendation_and_booking_system.DTOs.WebInfo;
using travel_recommendation_and_booking_system.Interfaces;

namespace Controllers.Admin
{
    [Route("api/admin/[controller]")]
    [ApiController]
    [Authorize(Policy = "AdminOnly")]
    public class WebInfoController : ControllerBase
    {
        private readonly IWebInfoService _webInfoService;


        public WebInfoController(IWebInfoService webInfoService)
        {
            _webInfoService = webInfoService;

        }


        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] WebinfoDTO webinfo, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var result = await _webInfoService
                .GetPagedWebInfoAsync(pageNumber, pageSize, webinfo);

            return Ok(result);
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _webInfoService
                .GetWebInfoByIdAsync(id);

            if (result == null)
            {
                return NotFound(new
                {
                    Message = "Không tìm thấy thông tin trang"
                });
            }

            return Ok(result);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] UpdateWebInfoDTO dto)
        {
            var result = await _webInfoService
                .UpdateAsync(id, dto);

            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }


        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateStatus(
            int id,
            [FromBody] bool trangthai)
        {
            var result = await _webInfoService
                .UpdateStatusAsync(id, trangthai);

            if (!result)
            {
                return NotFound(new
                {
                    Message = "Không tìm thấy thông tin trang"
                });
            }

            return Ok(new
            {
                Message = "Cập nhật trạng thái thành công"
            });
        }
        [HttpDelete("{id}/content")]
        public async Task<IActionResult> ClearContent(int id)
        {
            var result = await _webInfoService.ClearContentAsync(id);

            if (!result)
                return NotFound();

            return Ok(new { message = "Đã xóa nội dung" });
        }
    }
}

