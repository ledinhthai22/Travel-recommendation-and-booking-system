using Microsoft.AspNetCore.Mvc;
using System.IO.Compression;
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
        public async Task<IActionResult> UpdatePayment(int id, [FromBody] int status, int maNhanVien)
        {
            var result = await _service.UpdatePaymentStatusAsync(id, status, maNhanVien);
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
                var files = await _service.GenerateContractsPdfWithNameAsync(dto.MaDonDatTours);
                return BuildFileResult(files);
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
                var files = await _service.GenerateContractsPdfByChuyenWithNameAsync(maChuyen);
                return BuildFileResult(files);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
        private IActionResult BuildFileResult(List<(byte[] Pdf, string FileName)> files)
        {
            if (files == null || !files.Any())
                return BadRequest("Không có hợp đồng nào được tạo.");

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
    }
}