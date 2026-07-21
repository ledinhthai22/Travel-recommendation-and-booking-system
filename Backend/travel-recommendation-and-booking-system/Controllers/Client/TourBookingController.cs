using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using travel_recommendation_and_booking_system.DTOs.TourBooking;
using travel_recommendation_and_booking_system.Interfaces;

namespace travel_recommendation_and_booking_system.Controllers.User
{
    [Route("api/user/tour-bookings")]
    [ApiController]
    [Authorize(Policy = "UserOnly")]
    public class UserTourBookingsController : ControllerBase
    {
        private readonly ITourBookingService _service;
        private readonly ICurrentUserService _currentUserService;

        public UserTourBookingsController(
            ITourBookingService service,
            ICurrentUserService currentUserService)
        {
            _service = service;
            _currentUserService = currentUserService;
        }

        [HttpGet]
        public async Task<IActionResult> GetUserBookings()
        {
            try
            {
                var userId = _currentUserService.GetUserId();
                var result = await _service.GetUserBookingsAsync(userId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Đã xảy ra lỗi khi tải danh sách đặt tour" });
            }
        }

        [HttpGet("{bookingId}")]
        public async Task<IActionResult> GetDetail(int bookingId)
        {
            try
            {
                var userId = _currentUserService.GetUserId();
                var result = await _service.GetUserBookingDetailAsync(bookingId, userId);
                if (result == null)
                    return NotFound(new { message = "Không tìm thấy đơn đặt tour" });
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Đã xảy ra lỗi khi tải chi tiết đơn" });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateBooking([FromBody] CreateBookingClientDTO dto, [FromQuery] int? holdId)
        {
            try
            {
                var userId = _currentUserService.GetUserId();
                var id = await _service.CreateBookingByClientAsync(userId, dto, holdId);
                return Ok(new { id, message = "Đặt tour thành công" });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Đã xảy ra lỗi khi đặt tour" });
            }
        }

        // Trong UserTourBookingsController.cs - ReserveSeats
        [HttpPost("reserve")]
        public async Task<IActionResult> ReserveSeats([FromBody] ReserveSeatsDTO dto)
        {
            var userId = _currentUserService.GetUserId();
            try
            {
              
                var result = await _service.ReserveSeatsAsync(userId, dto);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                // Log chi tiết lỗi
                Console.WriteLine($"=== RESERVE SEATS ERROR ===");
                Console.WriteLine($"Message: {ex.Message}");
                Console.WriteLine($"StackTrace: {ex.StackTrace}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"InnerException: {ex.InnerException.Message}");
                    Console.WriteLine($"Inner StackTrace: {ex.InnerException.StackTrace}");
                }
                Console.WriteLine($"DTO: MaChuyen={dto.MaChuyen}, SoNguoiLon={dto.SoNguoiLon}, SoTreEm={dto.SoTreEm}, SoEmBe={dto.SoEmBe}");
                Console.WriteLine($"UserId: {userId}");
                Console.WriteLine($"==========================");

                return StatusCode(500, new { message = "Đã xảy ra lỗi khi giữ chỗ: " + ex.Message });
            }
        }

        [HttpDelete("reserve/{holdId}")]
        public async Task<IActionResult> ReleaseReservation(int holdId)
        {
            try
            {
                var userId = _currentUserService.GetUserId();
                await _service.ReleaseReservationAsync(holdId, userId);
                return Ok(new { message = "Đã hủy giữ chỗ thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Đã xảy ra lỗi khi hủy giữ chỗ" });
            }
        }

        [HttpPost("{bookingId}/cancel")]
        public async Task<IActionResult> CancelBooking(int bookingId, [FromBody] CancelBookingRequestDTO dto)
        {
            try
            {
                var userId = _currentUserService.GetUserId();
                var result = await _service.CancelOrderAsync(bookingId, dto.LyDoHuy);
                return result ? Ok(new { message = "Hủy đơn thành công" }) : NotFound(new { message = "Không tìm thấy đơn" });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Đã xảy ra lỗi khi hủy đơn" });
            }
        }
    }
}