using Hangfire;
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
    }
}