using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using travel_recommendation_and_booking_system.DTOs.User;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Services;

namespace travel_recommendation_and_booking_system.Controllers.Admin
{
    [Route("api/admin/[controller]")]
    [ApiController]
    
    public class UserController : ControllerBase
    {
        private readonly IUserService _user;
        public UserController(IUserService user)
        {
            _user = user;
        }

        [HttpPost("create-user")]
        [Authorize(Policy = "Admin&Staff")]
        public async Task<IActionResult> CreateUser([FromForm] UserCreateDTO request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var isSuccess = await _user.CreateUserAsync(request);

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
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = $"Lỗi hệ thống khi tạo người dùng: {ex.Message}"
                });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> UpdateUser(int id, [FromForm] UserUpdateDTO request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (request.DuongDanAnh != null && request.DuongDanAnh.Length > 0)
            {
                if (request.DuongDanAnh.Length > 10 * 1024 * 1024)
                {
                    return BadRequest(new { success = false, message = "File ảnh vượt quá dung lượng cho phép (Tối đa 10MB)." });
                }

                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
                var extension = Path.GetExtension(request.DuongDanAnh.FileName).ToLowerInvariant();

                if (string.IsNullOrEmpty(extension) || !allowedExtensions.Contains(extension))
                {
                    return BadRequest(new { success = false, message = "Chỉ chấp nhận file ảnh (.jpg, .jpeg, .png, .gif, .webp)." });
                }

                if (!request.DuongDanAnh.ContentType.StartsWith("image/"))
                {
                    return BadRequest(new { success = false, message = "Nội dung file không hợp lệ. Vui lòng chọn đúng định dạng ảnh." });
                }
            }

            try
            {
                var isSuccess = await _user.UpdateUserAsync(id, request);

                if (!isSuccess)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Không tìm thấy tài khoản hoặc Email/Số điện thoại đã bị trùng với người dùng khác."
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Cập nhật thông tin tài khoản thành công!"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = $"Lỗi hệ thống khi cập nhật tài khoản: {ex.Message}"
                });
            }
        }

        [HttpGet("get-user")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> GetUsers([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, [FromQuery] string? keyword = null, [FromQuery] int? status = null)
        {
            try
            {
                var result = await _user.GetUsersAsync(pageNumber, pageSize, keyword, status);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi hệ thống khi tải danh sách người dùng." });
            }
        }
        [HttpGet("booking-select")]

        public async Task<IActionResult> GetUsersForBookingSelect([FromQuery] string? keyword = null, [FromQuery] int? status = null)
        {
            try
            {
                var users = await _user.GetUsersForSelectAsync(keyword, status);
                return Ok(new
                {
                    success = true,
                    data = users
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi khi lấy danh sách người dùng",
                    error = ex.Message
                });
            }
        }
        [HttpGet("{id}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> DetailUser(int id)
        {
            var user = await _user.DetailUserAsync(id);

            if (user == null)
            {
                return NotFound(new { success = false, message = "Không tìm thấy người dùng." });
            }

            return Ok(user);
        }
        [HttpPatch("{id}/lock")]
        [Authorize(Policy = "AdminOnly")]
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
        [Authorize(Policy = "AdminOnly")]
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

    }
}
