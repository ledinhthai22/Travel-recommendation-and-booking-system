using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IO.Compression;
using travel_recommendation_and_booking_system.DTOs.TourBooking;
using travel_recommendation_and_booking_system.Interfaces;

namespace travel_recommendation_and_booking_system.Controllers.Admin
{
    [Route("api/admin/tour-bookings")]
    [ApiController]
    [Authorize(Policy = "Admin&Staff")]
    public class AdminTourBookingsController : ControllerBase
    {
        private readonly ITourBookingService _service;
        private readonly IRefundService _refundService;

        public AdminTourBookingsController(
            ITourBookingService service,
            IRefundService refundService)
        {
            _service = service;
            _refundService = refundService;
        }

        #region Booking Management

        [HttpGet]
        public async Task<IActionResult> GetPaged(
            string? keyword,
            int? bookingStatus,
            int? paymentStatus,
            DateTime? fromDate,
            DateTime? toDate,
            int page = 1,
            int size = 10)      
        {
            var result = await _service.GetPagedDonDatToursAsync(
                keyword,
                bookingStatus,
                paymentStatus,
                fromDate,
                toDate,
                page,
                size);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            var result = await _service.GetDetailAsync(id);
            return result == null ? NotFound(new { message = "Không tìm thấy đơn đặt tour" }) : Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateByAdmin([FromBody] CreateBookingAdminDTO dto)
        {
            try
            {
                var id = await _service.CreateBookingByAdminAsync(dto);
                return Ok(new { id, message = "Tạo đơn thành công" });
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
                return StatusCode(500, new { message = "Đã xảy ra lỗi khi tạo đơn" });
            }
        }

        [HttpPut]
        public async Task<IActionResult> UpdateByAdmin([FromBody] UpdateBookingAdminDTO dto)
        {
            try
            {
                var result = await _service.UpdateBookingByAdminAsync(dto);
                return Ok(new { success = result, message = "Cập nhật đơn thành công" });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}/approve")]
        public async Task<IActionResult> Approve(int id, [FromQuery] int employeeId)
        {
            try
            {
                var result = await _service.ApproveAsync(id, employeeId);
                return result ? Ok(new { message = "Đã duyệt đơn thành công" }) : NotFound(new { message = "Không tìm thấy đơn" });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("{id}/cancel")]
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

        [HttpPut("{id}/complete")]
        public async Task<IActionResult> CompleteOrder(int id)
        {
            try
            {
                var result = await _service.CompleteOrderAsync(id);
                return result ? Ok(new { message = "Đã đánh dấu hoàn thành tour" }) : NotFound(new { message = "Không tìm thấy đơn" });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("passenger/{maKhachHang}")]
        public async Task<IActionResult> UpdatePassenger(int maKhachHang, [FromBody] UpdatePassengerDTO dto)
        {
            try
            {
                var result = await _service.UpdatePassengerAsync(maKhachHang, dto);
                return result ? Ok(new { message = "Cập nhật hành khách thành công" }) : NotFound(new { message = "Không tìm thấy hành khách" });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        #endregion

        #region Refund Management (Chuyển sang RefundController)

        // ĐÃ CHUYỂN: Các API hoàn tiền đã được chuyển sang RefundController
        // - POST {id}/confirm-refund → POST api/admin/refund/confirm-order/{id}
        // - PUT {id}/payment-status → PUT api/admin/refund/payment-status/{id}
        // - PUT {id}/deposit-status → PUT api/admin/refund/deposit-status/{id}
        // - POST {id}/refund-deposit → POST api/admin/refund/refund-deposit/{id}
        // - PUT {id}/invoice-status → PUT api/admin/refund/invoice-status/{id}

        #endregion

        #region Contract Printing

        [HttpPost("print-contract")]
        public async Task<IActionResult> PrintContractsByIds([FromBody] PrintContractByIdsDTO dto)
        {
            if (dto.MaDonDatTours == null || !dto.MaDonDatTours.Any())
                return BadRequest(new { message = "Chưa chọn đơn nào để in." });

            try
            {
                var files = await _service.GenerateContractsPdfWithNameAsync(dto.MaDonDatTours);
                return BuildFileResult(files);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("print-contract/by-chuyen/{maChuyen}")]
        public async Task<IActionResult> PrintContractsByChuyen(int maChuyen)
        {
            try
            {
                var files = await _service.GenerateContractsPdfByChuyenWithNameAsync(maChuyen);
                return BuildFileResult(files);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        private IActionResult BuildFileResult(List<(byte[] Pdf, string FileName)> files)
        {
            if (files == null || !files.Any())
                return BadRequest(new { message = "Không có hợp đồng nào được tạo." });

            if (files.Count == 1)
            {
                var (pdf, fileName) = files[0];
                Response.Headers.Append("Content-Disposition", $"attachment; filename=\"{fileName}\"");
                Response.Headers.Append("Access-Control-Expose-Headers", "Content-Disposition");
                return File(pdf, "application/pdf");
            }

            using var memoryStream = new MemoryStream();
            using (var archive = new ZipArchive(memoryStream, ZipArchiveMode.Create, leaveOpen: true))
            {
                foreach (var (pdf, fileName) in files)
                {
                    var entry = archive.CreateEntry(fileName, CompressionLevel.Fastest);
                    using var entryStream = entry.Open();
                    entryStream.Write(pdf, 0, pdf.Length);
                }
            }

            memoryStream.Position = 0;
            var zipFileName = $"HopDong_{DateTime.Now:yyyyMMddHHmmss}.zip";

            Response.Headers.Append("Content-Disposition", $"attachment; filename=\"{zipFileName}\"");
            Response.Headers.Append("Access-Control-Expose-Headers", "Content-Disposition");

            return File(memoryStream.ToArray(), "application/zip");
        }

        #endregion
    }
}