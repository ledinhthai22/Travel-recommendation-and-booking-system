using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using travel_recommendation_and_booking_system.DTOs.TourBooking;
using travel_recommendation_and_booking_system.Interfaces;

namespace travel_recommendation_and_booking_system.Controllers.Admin
{
    [Route("api/admin/refund")]
    [ApiController]
    [Authorize(Policy = "Admin&Staff")]
    public class RefundController : ControllerBase
    {
        private readonly IRefundService _refundService;
        private readonly ITourBookingService _tourBookingService;
        private readonly ICurrentUserService _currentUserService;

        public RefundController(
            IRefundService refundService,
            ITourBookingService tourBookingService,
            ICurrentUserService currentUserService)
        {
            _refundService = refundService;
            _tourBookingService = tourBookingService;
            _currentUserService = currentUserService;
        }

        #region Refund Management

        [HttpGet("pending")]
        public async Task<IActionResult> GetPendingRefunds([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                var result = await _refundService.GetPendingRefundsAsync(page, pageSize);
                return Ok(new
                {
                    success = true,
                    data = result.Items,
                    totalItems = result.TotalItems,
                    pageNumber = result.PageNumber,
                    pageSize = result.PageSize
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Đã xảy ra lỗi khi lấy danh sách đơn chờ hoàn tiền" });
            }
        }

        [HttpGet("calculate-policy/{maDonDatTour}")]
        public async Task<IActionResult> CalculateRefundPolicy(int maDonDatTour)
        {
            try
            {
                var result = await _refundService.CalculateRefundPolicyAsync(maDonDatTour);
                return Ok(new { success = true, data = result });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Đã xảy ra lỗi khi tính toán chính sách hoàn tiền" });
            }
        }

        /// <summary>
        /// Xác nhận hoàn tiền cho giao dịch — PHIÊN BẢN DEBUG: trả về message/stacktrace thật
        /// </summary>
        [HttpPost("confirm/{maThanhToan}")]
        public async Task<IActionResult> ConfirmRefund(int maThanhToan)
        {


            try
            {
                int maNhanVien;
                try
                {
                    maNhanVien = _currentUserService.GetUserId();
                    Console.WriteLine($"[ConfirmRefund] GetCurrentUserId() = {maNhanVien}");
                }
                catch (Exception exUser)
                {
                    Console.WriteLine("[ConfirmRefund] LỖI khi lấy UserId:");
                    Console.WriteLine(exUser.ToString());
                    return StatusCode(500, new
                    {
                        success = false,
                        message = "Lỗi xác thực người dùng: " + exUser.Message,
                        stack = exUser.StackTrace
                    });
                }

                Console.WriteLine($"[ConfirmRefund] Gọi _refundService.ConfirmRefundAsync({maThanhToan}, {maNhanVien})");
                var result = await _refundService.ConfirmRefundAsync(maThanhToan, maNhanVien);
                Console.WriteLine($"[ConfirmRefund] Service trả về: {result}");

                if (result)
                    return Ok(new { success = true, message = "Xác nhận hoàn tiền thành công" });

                return BadRequest(new { success = false, message = "Xác nhận hoàn tiền thất bại" });
            }
            catch (KeyNotFoundException ex)
            {
                Console.WriteLine($"[ConfirmRefund] KeyNotFoundException: {ex.Message}");
                return NotFound(new { success = false, message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                Console.WriteLine($"[ConfirmRefund] InvalidOperationException: {ex.Message}");
                return BadRequest(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {


                return StatusCode(500, new
                {
                    success = false,
                    message = ex.Message,
                    exceptionType = ex.GetType().FullName,
                    stack = ex.StackTrace,
                    innerMessage = ex.InnerException?.Message,
                    innerStack = ex.InnerException?.StackTrace
                });
            }
        }

        [HttpPost("confirm-order/{maDonDatTour}")]
        public async Task<IActionResult> ConfirmRefundForOrder(int maDonDatTour)
        {
            try
            {
                var result = await _refundService.ConfirmRefundForOrderAsync(maDonDatTour);

                if (result)
                    return Ok(new { success = true, message = "Xác nhận hoàn tiền cho đơn thành công" });

                return BadRequest(new { success = false, message = "Xác nhận hoàn tiền cho đơn thất bại" });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { success = false, message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Đã xảy ra lỗi khi xác nhận hoàn tiền cho đơn" });
            }
        }

        [HttpPost("reject/{maThanhToan}")]
        public async Task<IActionResult> RejectRefund(int maThanhToan, [FromBody] RejectRefundRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.LyDoTuChoi))
                    return BadRequest(new { success = false, message = "Vui lòng nhập lý do từ chối" });

                var maNhanVien = GetCurrentUserId();
                var result = await _refundService.RejectRefundAsync(maThanhToan, maNhanVien, request.LyDoTuChoi);

                if (result)
                    return Ok(new { success = true, message = "Từ chối hoàn tiền thành công" });

                return BadRequest(new { success = false, message = "Từ chối hoàn tiền thất bại" });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { success = false, message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Đã xảy ra lỗi khi từ chối hoàn tiền" });
            }
        }

        [HttpPost("process/{maDonDatTour}")]
        public async Task<IActionResult> ProcessRefund(int maDonDatTour)
        {
            try
            {
                var maNhanVien = GetCurrentUserId();
                var result = await _refundService.ProcessRefundAsync(maDonDatTour, maNhanVien);

                if (result)
                    return Ok(new { success = true, message = "Xử lý hoàn tiền thành công" });

                return BadRequest(new { success = false, message = "Xử lý hoàn tiền thất bại" });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { success = false, message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Đã xảy ra lỗi khi xử lý hoàn tiền" });
            }
        }

        [HttpPost("refund-deposit/{maDonDatTour}")]
        public async Task<IActionResult> RefundDeposit(int maDonDatTour, [FromBody] RefundDepositRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.LyDoHoan))
                    return BadRequest(new { success = false, message = "Vui lòng nhập lý do hoàn cọc" });

                var result = await _refundService.RefundDepositAsync(maDonDatTour, request.LyDoHoan);

                if (result)
                    return Ok(new { success = true, message = "Hoàn cọc thành công" });

                return BadRequest(new { success = false, message = "Hoàn cọc thất bại" });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { success = false, message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Đã xảy ra lỗi khi hoàn cọc" });
            }
        }

        #endregion

        #region Payment Status Management

        [HttpPut("payment-status/{maDonDatTour}")]
        public async Task<IActionResult> UpdatePaymentStatus(int maDonDatTour, [FromBody] UpdatePaymentStatusRequest request)
        {
            try
            {
                var result = await _refundService.UpdatePaymentStatusAsync(
                    maDonDatTour,
                    request.TrangThaiThanhToan,
                    request.MaNhanVien,
                    request.SoTienThanhToanLanNay);

                return result
                    ? Ok(new { success = true, message = "Cập nhật thanh toán thành công" })
                    : NotFound(new { success = false, message = "Không tìm thấy đơn" });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Đã xảy ra lỗi khi cập nhật thanh toán" });
            }
        }

        [HttpPut("deposit-status/{maDonDatTour}")]
        public async Task<IActionResult> UpdateDepositStatus(int maDonDatTour, [FromBody] UpdateDepositStatusRequest request)
        {
            try
            {
                var result = await _refundService.UpdateDepositStatusAsync(
                    maDonDatTour,
                    request.TrangThaiCoc,
                    request.MaNhanVien);

                return result
                    ? Ok(new { success = true, message = "Cập nhật trạng thái cọc thành công" })
                    : NotFound(new { success = false, message = "Không tìm thấy đơn" });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Đã xảy ra lỗi khi cập nhật trạng thái cọc" });
            }
        }

        [HttpPut("invoice-status/{maDonDatTour}")]
        public async Task<IActionResult> UpdateInvoiceStatus(int maDonDatTour, [FromBody] int trangThai)
        {
            try
            {
                var result = await _refundService.UpdateInvoiceStatusAsync(maDonDatTour, trangThai);

                return result
                    ? Ok(new { success = true, message = "Cập nhật trạng thái đơn thành công" })
                    : NotFound(new { success = false, message = "Không tìm thấy đơn" });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Đã xảy ra lỗi khi cập nhật trạng thái đơn" });
            }
        }

        [HttpPost("confirm-deposit/{maDonDatTour}")]
        public async Task<IActionResult> XacNhanDaDatCoc(int maDonDatTour, [FromBody] ConfirmDepositRequest request)
        {
            try
            {
                var maNhanVien = GetCurrentUserId();
                var result = await _refundService.XacNhanDaDatCocAsync(
                    maDonDatTour,
                    maNhanVien,
                    request.PhuongThucThanhToan,
                    request.SoTienThu);

                return result
                    ? Ok(new { success = true, message = "Ghi nhận đặt cọc thành công" })
                    : NotFound(new { success = false, message = "Không tìm thấy đơn" });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Đã xảy ra lỗi khi ghi nhận đặt cọc" });
            }
        }

        #endregion

        #region Private Methods

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst("UserId")?.Value ?? User.FindFirst("nameid")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                throw new UnauthorizedAccessException("Không thể xác định người dùng");

            return userId;
        }

        #endregion
    }

    #region Request DTOs

    public class RejectRefundRequest
    {
        public string LyDoTuChoi { get; set; } = string.Empty;
    }

    public class RefundDepositRequest
    {
        public string LyDoHoan { get; set; } = string.Empty;
    }

    public class UpdatePaymentStatusRequest
    {
        public int TrangThaiThanhToan { get; set; }
        public int MaNhanVien { get; set; }
        public decimal SoTienThanhToanLanNay { get; set; }
    }

    public class UpdateDepositStatusRequest
    {
        public int TrangThaiCoc { get; set; }
        public int MaNhanVien { get; set; }
    }

    public class ConfirmDepositRequest
    {
        public int PhuongThucThanhToan { get; set; }
        public decimal SoTienThu { get; set; }
    }

    #endregion
}