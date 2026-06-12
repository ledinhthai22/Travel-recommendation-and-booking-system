using DTOs.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Reflection;
using travel_recommendation_and_booking_system.DTOs.User;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Models;
using travel_recommendation_and_booking_system.Services;

namespace travel_recommendation_and_booking_system.Controllers.Admin
{
    [Route("api/admin/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _user;
        public UserController(IUserService user) {
            _user = user;
        }

        [HttpPost("create-user")]
        public async Task<IActionResult> CreateUser([FromForm] UserCreateDTO request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var isSuccess = await _user.CreateUserAsync(request);
            if (request.DuongDanAnh != null && request.DuongDanAnh.Length > 10 * 1024 * 1024)
            {
                return BadRequest(new { success = false, message = "File ảnh vượt quá dung lượng cho phép (Tối đa 10MB)." });
            }
            if (!isSuccess)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Email hoặc Số điện thoại này đã được sử dụng. Vui lòng thử lại!"
                });
            }

            return Ok(new
            {
                success = true,
                message = "Thêm người dùng mới thành công!"
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromForm] UserUpdateDTO request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var isSuccess = await _user.UpdateUserAsync(id, request);
            if (request.DuongDanAnh != null && request.DuongDanAnh.Length > 10 * 1024 * 1024)
            {
                return BadRequest(new { success = false, message = "File ảnh vượt quá dung lượng cho phép (Tối đa 10MB)." });
            }

            if (!isSuccess)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Không tìm thấy tài khoản hoặc Email/Số điện thoại đã bị trùng với người dùng khác"
                });
            }

            return Ok(new
            {
                success = true,
                message = "Cập nhật thông tin tài khoản thành công!"
            });
        }

        [HttpGet("get-user")]
        public async Task<IActionResult> GetUsers([FromQuery] int pageNumber = 1,[FromQuery] int pageSize = 10,[FromQuery] string? keyword = null,[FromQuery] int? status = null)
        {
            try
            {
                var result = await _user.GetUsersAsync(pageNumber, pageSize, keyword, status);
                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi hệ thống khi tải danh sách người dùng." });
            }
        }
        [HttpPatch("{id}/lock")]
        public async Task<IActionResult> LockUser(int id)
        {
            var isSuccess = await _user.LockUserAsync(id);

            if (!isSuccess)
            {
                return NotFound(new
                {
                    success = false,
                    message = "Không tìm thấy tài khoản hoặc tài khoản không hợp lệ."
                });
            }

            return Ok(new
            {
                success = true,
                message = "Đã khóa tài khoản thành công"
            });
        }

        [HttpPatch("{id}/unlock")]
        public async Task<IActionResult> UnlockUser(int id)
        {
            var isSuccess = await _user.UnLockUserAsync(id);

            if (!isSuccess)
            {
                return NotFound(new
                {
                    success = false,
                    message = "Không tìm thấy tài khoản hoặc tài khoản không hợp lệ."
                });
            }

            return Ok(new
            {
                success = true,
                message = "Mở khóa tài khoản thành công"
            });
        }

        // nhân viên
        [HttpPost("create-staff")]
        public async Task<IActionResult> CreateStaff([FromForm] StaffCreateDTO request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (request.DuongDanAnh != null && request.DuongDanAnh.Length > 10 * 1024 * 1024)
            {
                return BadRequest(new { success = false, message = "File ảnh vượt quá dung lượng cho phép (Tối đa 10MB)." });
            }
            var isSuccess = await _user.CreateStaffAsync(request);

            if (!isSuccess)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Thêm thất bại! Email hoặc Số điện thoại đã được đăng ký cho một nhân viên/khách hàng khác."
                });
            }

            return Ok(new
            {
                success = true,
                message = "Thêm nhân sự mới thành công!"
            });
        }

        [HttpPut("update-staff/{id}")]
        public async Task<IActionResult> UpdateStaff(int id, [FromForm] StaffUpdateDTO request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (request.DuongDanAnh != null && request.DuongDanAnh.Length > 10 * 1024 * 1024)
            {
                return BadRequest(new { success = false, message = "File ảnh vượt quá dung lượng cho phép (Tối đa 10MB)." });
            }
            var isSuccess = await _user.UpdateStaffAsync(id, request);

            if (!isSuccess)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Cập nhật thất bại! Không tìm thấy nhân viên hoặc Email/SĐT đã bị trùng."
                });
            }

            return Ok(new
            {
                success = true,
                message = "Cập nhật thông tin nhân viên thành công!"
            });
        }

        [HttpGet("nhan-vien")]
        public async Task<IActionResult> GetStaffs( [FromQuery] int pageNumber = 1,[FromQuery] int pageSize = 10,[FromQuery] string? keyword = null,[FromQuery] int? status = null)
        {
            try
            {
                var result = await _user.GetStaffsAsync(pageNumber, pageSize, keyword, status);
                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi tải danh sách nhân viên: {ex.Message}");
                return StatusCode(500, new { success = false, message = "Lỗi hệ thống khi tải danh sách nhân sự." });
            }
        }
    }
}
