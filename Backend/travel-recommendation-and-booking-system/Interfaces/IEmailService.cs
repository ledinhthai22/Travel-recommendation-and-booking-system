using travel_recommendation_and_booking_system.Models;

namespace travel_recommendation_and_booking_system.Interfaces
{
    public interface IEmailService
    {
        /// <summary>
        /// Gửi email cơ bản
        /// </summary>
        Task SendEmailAsync(string toEmail, string subject, string body);

        /// <summary>
        /// Gửi email nhắc thanh toán
        /// </summary>
        Task SendPaymentReminderAsync(DonDatTour order);

        /// <summary>
        /// Gửi email thông báo hủy đơn
        /// </summary>
        Task SendBookingCancelledAsync(DonDatTour order);

        /// <summary>
        /// Gửi email xác nhận đặt tour
        /// </summary>
        Task SendBookingConfirmationAsync(DonDatTour order);

        /// <summary>
        /// Gửi email thông báo yêu cầu hủy đơn
        /// </summary>
        Task SendCancelRequestNotificationAsync(DonDatTour order);

        /// <summary>
        /// Gửi email kết quả xử lý hủy đơn
        /// </summary>
        Task SendCancelProcessedAsync(DonDatTour order);

        /// <summary>
        /// Gửi email thông báo đang xử lý hoàn tiền
        /// </summary>
        Task SendRefundProcessingAsync(DonDatTour order, ThanhToan? thanhToan);

        /// <summary>
        /// Gửi email xác nhận người dùng đã nhận hoàn tiền
        /// </summary>
        Task SendRefundConfirmedByUserAsync(DonDatTour order, ThanhToan thanhToan);

        /// <summary>
        /// Gửi email thông báo hủy không hoàn tiền
        /// </summary>
        Task SendCancelNoRefundAsync(DonDatTour order);

        /// <summary>
        /// Gửi email thông báo hoàn tiền đang chờ xử lý (Legacy - giữ để tương thích)
        /// </summary>
        [Obsolete("Use SendRefundProcessingAsync instead")]
        Task SendRefundPendingAsync(DonDatTour order, ThanhToan thanhToan);

        /// <summary>
        /// Gửi email xác nhận hoàn tiền thành công (Legacy - giữ để tương thích)
        /// </summary>
        [Obsolete("Use SendRefundProcessingAsync or SendCancelProcessedAsync instead")]
        Task SendRefundCompletedAsync(DonDatTour order, ThanhToan thanhToan);
    }
}