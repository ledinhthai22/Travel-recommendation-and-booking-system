using DTOs.Staff;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using travel_recommendation_and_booking_system.DTOs.Staff;
using travel_recommendation_and_booking_system.Interfaces;

namespace travel_recommendation_and_booking_system.Controllers.Admin
{
    [Route("api/admin/[controller]")]
    [ApiController]
    [Authorize(Policy = "AdminOnly")]
    public class StaffController : ControllerBase
    {
        private readonly IStaffService _staffService;

        public StaffController(IStaffService staffService)
        {
            _staffService = staffService;
        }
        [HttpGet("TourGuiDe")]
        public async Task<IActionResult> GetTourGuiDe()
        {
            var result = await _staffService.GetTourGuiDe();
            return Ok(result);
        }
        [HttpGet("Paged")]
        public async Task<IActionResult> GetPagedStaffs(
            [FromQuery] StaffFilterDTO staff,
            int pageNumber = 1,
            int pageSize = 10
            )
        {
            var result = await _staffService.GetPagedStaffsAsync(
                pageNumber,
                pageSize,
                staff);

            return Ok(result);
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var staff = await _staffService.GetStaffByIdAsync(id);

            if (staff == null)
                return NotFound(new
                {
                    message = "Không tìm thấy nhân viên"
                });

            return Ok(staff);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] StaffDTO staff)
        {
            var result = await _staffService.CreateAsync(staff);

            return CreatedAtAction(
                nameof(GetById),
                new { id = result.MaNhanVien },
                result);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] StaffDTO staff)
        {
            var result = await _staffService.UpdateAsync(id, staff);

            if (result == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy nhân viên"
                });
            }

            return Ok(result);
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _staffService.DeleteAsync(id);

            if (!success)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy nhân viên"
                });
            }

            return Ok(new
            {
                message = "Xóa nhân viên thành công"
            });
        }


        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateStatus(
            int id,
            [FromQuery] int trangthai)
        {
            var success = await _staffService.UpdateStatusAsync(
                id,
                trangthai);

            if (!success)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy nhân viên"
                });
            }

            return Ok(new
            {
                message = "Cập nhật trạng thái thành công"
            });
        }
        [HttpPatch("{id}/reset-password")]
        public async Task<IActionResult> ResetPassword(int id, [FromBody] ResetPassStaffDTO model)
        {
            var result = await _staffService.ResetPasswordAsync(id, model!.NewPassword);

            if (!result)
            {
                return NotFound(
                new
                {
                    message = "Không tìm thấy nhân viên"
                });
            }

            return Ok(
            new
            {
                message = "Đổi mật khẩu thành công"
            });
        }
    }
}
