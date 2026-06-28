using Hangfire;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Job;
using travel_recommendation_and_booking_system.Jobs;

namespace travel_recommendation_and_booking_system.Extensions
{
    public static class HangfireExtensions
    {
        public static void UseCustomHangfireJobs(this WebApplication app)
        {
            using var scope = app.Services.CreateScope();

            var recurringJobManager =
                scope.ServiceProvider.GetRequiredService<IRecurringJobManager>();

            recurringJobManager.AddOrUpdate<PromotionStatusJob>(
                "promotion-status-job",
                job => job.UpdatePromotionStatus(),
                Cron.Minutely
            );
        }

        public static void UseCustomHangfireReview(this WebApplication app)
        {
            using var scope = app.Services.CreateScope();

            RecurringJob.AddOrUpdate<IReviewService>(
                "auto-process-reviews-batch",
                service => service.ProcessReviewsBatchAsync(),
                "0 23 * * *"
                //Cron.Minutely()
            );
        }

        public static void UseCleanExpriedReservationsJob(this WebApplication app)
        {
            using var scope = app.Services.CreateScope();

            var recurringJobManager =
                scope.ServiceProvider.GetRequiredService<IRecurringJobManager>();
            RecurringJob.AddOrUpdate<CleanExpiredReservationsJob>(
                "clean-expired-reservations",
                job => job.ExecuteAsync(),
                "*/5 * * * *"
            );
        }
        public static void UseDepartureChangeStatusJoc(this WebApplication app)
        {
            using var scope = app.Services.CreateScope();

            var recurringJobManager =
                scope.ServiceProvider.GetRequiredService<IRecurringJobManager>();

            RecurringJob.AddOrUpdate<DepartureChangeStatus>(
                "Departure-Change-Status",
                job => job.UpdateStatusesAsync(),
                Cron.Daily
            );
        }
    }
}