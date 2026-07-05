using Microsoft.AspNetCore.Mvc;
using travel_recommendation_and_booking_system.DTOs.TourBooking;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Services;

namespace travel_recommendation_and_booking_system.Controllers.Admin
{
    [Route("api/admin/tour-bookings")]
    [ApiController]
    public class AdminTourBookingsController : ControllerBase
    {
        private readonly ITourBookingService _service;

        public AdminTourBookingsController(ITourBookingService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetPaged(
            string? keyword,
            int? bookingStatus,
            int? paymentStatus,
            DateTime? bookingDate,
            int page = 1,
            int size = 10)
        {
            var result = await _service.GetPagedDonDatToursAsync(keyword, bookingStatus, paymentStatus, bookingDate, page, size);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            var result = await _service.GetDetailAsync(id);
            return result == null ? NotFound() : Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateByAdmin([FromBody] CreateBookingAdminDTO dto)
        {
            var id = await _service.CreateBookingByAdminAsync(dto);
            return Ok(new { id, message = "Tạo đơn thành công" });
        }

        [HttpPut("{id}/approve")]
        public async Task<IActionResult> Approve(int id, [FromQuery] int employeeId)
        {
            var result = await _service.ApproveAsync(id, employeeId);
            return result ? Ok(new { message = "Đã duyệt đơn" }) : NotFound();
        }

        [HttpPost("cancel/{id}")]
        public async Task<IActionResult> CancelBooking(int id, [FromQuery] string lyDoHuy)
        {
            try
            {
                var result = await _service.CancelOrderAsync(id, lyDoHuy);
                if (!result) return NotFound(new { message = "Không tìm thấy đơn đặt tour." });
                return Ok(new { message = "Hủy đơn thành công." });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}/payment-status")]
        public async Task<IActionResult> UpdatePayment(int id, [FromBody] int status)
        {
            var result = await _service.UpdatePaymentStatusAsync(id, status);
            return result ? Ok(new { message = "Cập nhật thanh toán thành công" }) : NotFound();
        }

        [HttpPut("{id}/complete")]
        public async Task<IActionResult> Complete(int id)
        {
            var result = await _service.UpdateInvoiceStatusAsync(id, 3); // 3 = Hoàn tất
            return result ? Ok(new { message = "Đã đánh dấu hoàn thành tour" }) : NotFound();
        }

        [HttpPut("passenger/{maKhachHang}")]
        public async Task<IActionResult> UpdatePassenger(int maKhachHang, [FromBody] UpdatePassengerDTO dto)
        {
            var result = await _service.UpdatePassengerAsync(maKhachHang, dto);
            return result ? Ok(new { message = "Cập nhật hành khách thành công" }) : NotFound();
        }

        [HttpPut]
        public async Task<IActionResult> UpdateByAdmin([FromBody] UpdateBookingAdminDTO dto)
        {
            var result = await _service.UpdateBookingByAdminAsync(dto);
            return Ok(new { success = result });
        }

        [HttpPost("print-contract")]
        public async Task<IActionResult> PrintContractsByIds([FromBody] PrintContractByIdsDTO dto)
        {
            if (dto.MaDonDatTours == null || !dto.MaDonDatTours.Any())
                return BadRequest("Chưa chọn đơn nào.");

            try
            {
                var (pdf, fileName) = await _service.GenerateContractsPdfWithNameAsync(dto.MaDonDatTours);

                Response.Headers.Append("Content-Disposition", $"attachment; filename=\"{fileName}\"");
                Response.Headers.Append("Access-Control-Expose-Headers", "Content-Disposition");

                return File(pdf, "application/pdf");
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("print-contract/by-chuyen/{maChuyen}")]
        public async Task<IActionResult> PrintContractsByChuyen(int maChuyen)
        {
            try
            {
                var (pdf, fileName) = await _service.GenerateContractsPdfByChuyenWithNameAsync(maChuyen);

                Response.Headers.Append("Content-Disposition", $"attachment; filename=\"{fileName}\"");
                Response.Headers.Append("Access-Control-Expose-Headers", "Content-Disposition");

                return File(pdf, "application/pdf");
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}