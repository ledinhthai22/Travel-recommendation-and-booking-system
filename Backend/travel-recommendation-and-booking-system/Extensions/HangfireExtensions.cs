using Hangfire;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Job;
using travel_recommendation_and_booking_system.Jobs;

namespace travel_recommendation_and_booking_system.Extensions
{
    public static class HangfireExtensions
    {
        #region Existing Jobs (Giữ nguyên)

        public static void UseCustomHangfireJobs(this WebApplication app)
        {
            using var scope = app.Services.CreateScope();

            var recurringJobManager =
                scope.ServiceProvider.GetRequiredService<IRecurringJobManager>();

            recurringJobManager.AddOrUpdate<PromotionStatusJob>(
                "promotion-status-job",
                job => job.UpdatePromotionStatus(),
                Cron.Daily()
            );
        }

        public static void UseCustomHangfireReview(this WebApplication app)
        {
            RecurringJob.AddOrUpdate<IReviewService>(
                "auto-process-reviews-batch",
                service => service.ProcessReviewsBatchAsync(),
                "0 23 * * *"
            );
        }

        public static void UseCleanExpriedReservationsJob(this WebApplication app)
        {
            using var scope = app.Services.CreateScope();

            var recurringJobManager =
                scope.ServiceProvider.GetRequiredService<IRecurringJobManager>();

            recurringJobManager.AddOrUpdate<CleanExpiredReservationsJob>(
                "clean-expired-reservations",
                job => job.ExecuteAsync(),
                "*/5 * * * *"
            );
        }

        public static void UseDepartureChangeStatusJob(this WebApplication app)
        {
            using var scope = app.Services.CreateScope();

            var recurringJobManager =
                scope.ServiceProvider.GetRequiredService<IRecurringJobManager>();

            recurringJobManager.AddOrUpdate<DepartureChangeStatus>(
                "departure-change-status",
                job => job.UpdateStatusesAsync(),
                Cron.Daily()
            );
        }

        public static void UseTrainRecommendationModelJob(this WebApplication app)
        {
            using var scope = app.Services.CreateScope();

            var recurringJobManager =
                scope.ServiceProvider.GetRequiredService<IRecurringJobManager>();

            recurringJobManager.AddOrUpdate<TrainRecommendationModelJob>(
                "train-recommendation-model",
                job => job.TrainRecommendationModel(),
                Cron.Daily(2)
            );
        }

        public static void UseCleanSystemLogJob(this WebApplication app)
        {
            using var scope = app.Services.CreateScope();

            var recurringJobManager =
                scope.ServiceProvider.GetRequiredService<IRecurringJobManager>();

            recurringJobManager.AddOrUpdate<CleanSystemLogJob>(
                "clean-system-log",
                job => job.ExecuteAsync(),
                Cron.Monthly(3)
            );
        }

        #endregion

        #region Payment Warning Jobs

        /// <summary>
        /// Đăng ký các job nhắc thanh toán và gắn cờ công nợ
        /// </summary>
        public static void UsePaymentWarningJobs(this WebApplication app)
        {
            using var scope = app.Services.CreateScope();

            var recurringJobManager =
                scope.ServiceProvider.GetRequiredService<IRecurringJobManager>();

            // 00:00 - Nhắc khách còn nợ tiền trước ngày khởi hành 7 ngày
            recurringJobManager.AddOrUpdate<PaymentWarningJob>(
                "payment-reminder-7days",
                job => job.SendPaymentReminders(),
                Cron.Daily()
            );

            // 01:00 - Gắn cờ công nợ cho BookingManager
            recurringJobManager.AddOrUpdate<PaymentWarningJob>(
                "flag-overdue-deposits",
                job => job.FlagOverdueDeposits(),
                Cron.Daily(1)
            );
        }

        #endregion

        #region Booking Status Jobs

        /// <summary>
        /// Đăng ký các job tự động cập nhật trạng thái đơn đặt tour
        /// </summary>
        public static void UseBookingStatusJobs(this WebApplication app)
        {
            using var scope = app.Services.CreateScope();

            var recurringJobManager =
                scope.ServiceProvider.GetRequiredService<IRecurringJobManager>();

            // Mỗi ngày 00:05 - Chuyển "Đã duyệt" → "Đang diễn ra"
            recurringJobManager.AddOrUpdate<BookingStatusJob>(
                "booking-status-update-to-in-progress",
                job => job.UpdateToInProgressAsync(),
                Cron.Daily(0, 5)
            );

            // Mỗi giờ - Tự động hủy đơn quá hạn đặt cọc (24h)
            recurringJobManager.AddOrUpdate<BookingStatusJob>(
                "booking-status-auto-cancel-expired-deposits",
                job => job.AutoCancelExpiredDepositsAsync(),
                Cron.Hourly(15)
            );

            // Mỗi ngày 00:30 - Tự động hủy đơn đã duyệt nhưng chưa thanh toán phần còn lại
            recurringJobManager.AddOrUpdate<BookingStatusJob>(
                "booking-status-auto-cancel-unpaid-remaining",
                job => job.AutoCancelUnpaidRemainingAsync(),
                Cron.Daily(0, 30)
            );

            // Mỗi giờ - Tự động chuyển "Đang diễn ra" → "Hoàn tất"
            recurringJobManager.AddOrUpdate<BookingStatusJob>(
                "booking-status-auto-complete",
                job => job.AutoCompleteBookingsAsync(),
                Cron.Hourly(30)
            );

            // Mỗi giờ - Tự động gỡ cờ công nợ
            recurringJobManager.AddOrUpdate<BookingStatusJob>(
                "booking-status-clear-overdue-flags",
                job => job.AutoClearOverdueFlagsAsync(),
                Cron.Hourly(45)
            );
        }

        #endregion

        #region Deprecated Jobs (Đã thay thế)

        /// <summary>
        /// [DEPRECATED] Job này đã được thay thế bởi BookingStatusJob
        /// </summary>
        [Obsolete("Đã thay thế bởi UseBookingStatusJobs()")]
        public static void UseCompleteTourBookingJob(this WebApplication app)
        {
            using var scope = app.Services.CreateScope();

            var recurringJobManager =
                scope.ServiceProvider.GetRequiredService<IRecurringJobManager>();

          
        }

        #endregion

        #region Master Registration

        /// <summary>
        /// Đăng ký tất cả các job trong ứng dụng
        /// </summary>
        public static void UseAllHangfireJobs(this WebApplication app)
        {
            // Các job hiện có
            app.UseCustomHangfireJobs();
            app.UseCustomHangfireReview();
            app.UseCleanExpriedReservationsJob();
            app.UseDepartureChangeStatusJob();
            app.UseTrainRecommendationModelJob();
            app.UseCleanSystemLogJob();

            // Các job nhắc thanh toán và gắn cờ công nợ
            app.UsePaymentWarningJobs();

            // Các job tự động cập nhật trạng thái đơn
            app.UseBookingStatusJobs();
        }

        #endregion
    }
}