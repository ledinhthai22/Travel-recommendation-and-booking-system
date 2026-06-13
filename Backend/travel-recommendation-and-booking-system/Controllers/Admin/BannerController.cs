using Azure.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics.Contracts;
using travel_recommendation_and_booking_system.DTOs.Banner;
using travel_recommendation_and_booking_system.Interfaces;

namespace Controllers.Admin
{
    [Route("api/admin/[controller]")]
    [ApiController]
    [Authorize]
    public class BannerController : ControllerBase
    {
        private readonly IBannerService _banner;
        public BannerController(IBannerService banner)
        {
            _banner = banner;
        }

        [HttpGet("get-banner")]
        public async Task<IActionResult> GetBanner([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, [FromQuery] string? key = null)
        {
            try
            {
                var result = await _banner.GetBannerAsync(pageNumber, pageSize, key);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống: " + ex.Message });
            }
        }
        [HttpPost("create-banner")]
        public async Task<IActionResult> CreateBanner([FromForm] BannerDTO banner)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (banner.DuongDanAnh == null || banner.DuongDanAnh.Length == 0)
            {
                return BadRequest(new { success = false, message = "Vui lòng chọn hình ảnh banner." });
            }

            if (banner.DuongDanAnh.Length > 10 * 1024 * 1024)
            {
                return BadRequest(new { success = false, message = "File ảnh vượt quá dung lượng cho phép (Tối đa 10MB)." });
            }

            var isSuccess = await _banner.CreateBannerAsync(banner);

            if (!isSuccess)
            {
                return BadRequest(new { success = false, message = "Thêm Banner thất bại. Chấp nhận định dạng ảnh hợp lệ (JPG, PNG, WEBP, GIF)." });
            }

            return Ok(new { success = true, message = "Thêm Banner mới thành công" });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBanner(int id, [FromForm] BannerDTO request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (request.DuongDanAnh != null && request.DuongDanAnh.Length > 10 * 1024 * 1024)
            {
                return BadRequest(new { success = false, message = "File ảnh vượt quá dung lượng cho phép (Tối đa 10MB)." });
            }

            var isSuccess = await _banner.UpdateBannerAsync(id, request);

            if (!isSuccess)
            {
                return BadRequest(new { success = false, message = "Cập nhật thất bại. Vui lòng kiểm tra định dạng ảnh hoặc dữ liệu." });
            }

            return Ok(new { success = true, message = "Cập nhật Banner thành công" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> SoftDelelteBanner(int id)
        {
            try
            {
                var isbanner = await _banner.SoftDeleteBannerAsync(id);
                if (!isbanner)
                {
                    return NotFound(new { success = false, message = "Không tìm thấy banner này hoặc đã bị xóa từ trước" });
                }
                return Ok(new { success = true, message = "Đã xóa banner thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống: " + ex.Message });
            }
        }
    }
}
