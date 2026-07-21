using Microsoft.EntityFrameworkCore;
using travel_recommendation_and_booking_system.Constants;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.DTOs.Notifications;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Models;

namespace travel_recommendation_and_booking_system.Job
{
    /// <summary>
    /// Job xử lý nhắc thanh toán và gắn cờ công nợ
    /// Các chức năng tự động hủy và cập nhật trạng thái đã chuyển sang BookingStatusJob
    /// </summary>
    public class PaymentWarningJob
    {
        private readonly AppDbContext _context;
        private readonly IEmailService _emailService;
        private readonly INotificationService _notificationService;
        private readonly ILogger<PaymentWarningJob> _logger;

        public PaymentWarningJob(
            AppDbContext context,
            IEmailService emailService,
            INotificationService notificationService,
            ILogger<PaymentWarningJob> logger)
        {
            _context = context;
            _emailService = emailService;
            _notificationService = notificationService;
            _logger = logger;
        }

        #region 1. Nhắc thanh toán trước 7 ngày

        /// <summary>
        /// Gửi email nhắc thanh toán cho các đơn còn nợ trước 7 ngày khởi hành
        /// </summary>
        public async Task SendPaymentReminders()
        {
            var targetDate = DateTime.Today.AddDays(7);
            var nextDate = targetDate.AddDays(1);

            // Sử dụng điều kiện trực tiếp để EF có thể dịch sang SQL
            var bookings = await _context.DonDatTours
                .Include(x => x.NguoiDung)
                .Include(x => x.ChuyenKhoiHanh)
                .Where(x =>
                    x.TrangThaiDon >= 1 && x.TrangThaiDon <= 4 // IsOrderActive
                    && x.TrangThaiTaiChinh != BookingConstants.TC_DA_THANH_TOAN_DU // Chưa thanh toán đủ
                    && x.SoTienDaThanhToan < x.TongTien
                    && x.ChuyenKhoiHanh != null
                    && x.ChuyenKhoiHanh.NgayKhoiHanh >= targetDate
                    && x.ChuyenKhoiHanh.NgayKhoiHanh < nextDate)
                .ToListAsync();

            if (!bookings.Any())
            {
                _logger.LogInformation("[PaymentWarningJob] Không có đơn nào cần nhắc thanh toán.");
                return;
            }

            int successCount = 0;
            int failCount = 0;

            foreach (var booking in bookings)
            {
                try
                {
                    if (!string.IsNullOrWhiteSpace(booking.NguoiDung?.Email))
                    {
                        await _emailService.SendPaymentReminderAsync(booking);
                        successCount++;
                        _logger.LogInformation($"[PaymentWarningJob] Đã gửi nhắc thanh toán cho đơn {booking.MaDatCho}");
                    }
                }
                catch (Exception ex)
                {
                    failCount++;
                    _logger.LogError(ex, $"[PaymentWarningJob] Lỗi gửi mail nhắc thanh toán cho đơn {booking.MaDatCho}");
                }
            }

            _logger.LogInformation($"[PaymentWarningJob] Đã gửi nhắc thanh toán: thành công {successCount}, thất bại {failCount}");
        }

        #endregion

        #region 2. Gắn cờ công nợ

        /// <summary>
        /// Gắn cờ cảnh báo công nợ cho các đơn còn nợ trong vòng 7 ngày khởi hành
        /// </summary>
        public async Task FlagOverdueDeposits()
        {
            var deadline = DateTime.Today.AddDays(7);

            // Sử dụng điều kiện trực tiếp để EF có thể dịch sang SQL
            var bookings = await _context.DonDatTours
                .Include(x => x.ChuyenKhoiHanh)
                .Where(x =>
                    x.TrangThaiDon >= 1 && x.TrangThaiDon <= 4 // IsOrderActive
                    && x.TrangThaiTaiChinh != BookingConstants.TC_DA_THANH_TOAN_DU // Chưa thanh toán đủ
                    && !x.CoCanhBaoCongNo
                    && x.ChuyenKhoiHanh != null
                    && x.ChuyenKhoiHanh.NgayKhoiHanh <= deadline
                    && x.ChuyenKhoiHanh.NgayKhoiHanh > DateTime.Now)
                .ToListAsync();

            if (!bookings.Any())
            {
                _logger.LogInformation("[PaymentWarningJob] Không có đơn nào cần gắn cờ công nợ.");
                return;
            }

            foreach (var booking in bookings)
            {
                booking.CoCanhBaoCongNo = true;
                booking.NgayGanCoCanhBao = DateTime.Now;
                booking.NgayCapNhat = DateTime.Now;

                _logger.LogInformation($"[PaymentWarningJob] Đã gắn cờ công nợ cho đơn {booking.MaDatCho}");
            }

            await _context.SaveChangesAsync();
            _logger.LogInformation($"[PaymentWarningJob] Đã gắn cờ công nợ cho {bookings.Count} đơn");
        }

        #endregion

        #region 3. Tự động hủy đơn quá hạn (ĐÃ CHUYỂN - KHÔNG CÒN SỬ DỤNG)

        /// <summary>
        /// [DEPRECATED] Phương thức này đã được chuyển sang BookingStatusJob.AutoCancelExpiredDepositsAsync()
        /// </summary>
        [Obsolete("Đã chuyển sang BookingStatusJob.AutoCancelExpiredDepositsAsync()")]
        public async Task CancelExpiredBookings()
        {
            _logger.LogWarning("[PaymentWarningJob] CancelExpiredBookings đã bị deprecated, sử dụng BookingStatusJob.AutoCancelExpiredDepositsAsync()");
            await Task.CompletedTask;
        }

        #endregion

        #region 4. Cập nhật trạng thái tour (ĐÃ CHUYỂN - KHÔNG CÒN SỬ DỤNG)

        /// <summary>
        /// [DEPRECATED] Phương thức này đã được chuyển sang BookingStatusJob
        /// </summary>
        [Obsolete("Đã chuyển sang BookingStatusJob.UpdateToInProgressAsync() và AutoCompleteBookingsAsync()")]
        public async Task UpdateBookingStatus()
        {
            _logger.LogWarning("[PaymentWarningJob] UpdateBookingStatus đã bị deprecated, sử dụng BookingStatusJob");
            await Task.CompletedTask;
        }

        #endregion
    }
}