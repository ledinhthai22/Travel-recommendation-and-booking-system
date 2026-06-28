using Hangfire.Common;
using Microsoft.EntityFrameworkCore;
using travel_recommendation_and_booking_system.Data;

namespace travel_recommendation_and_booking_system.Job
{
// Jobs/CleanExpiredReservationsJob.cs
public class CleanExpiredReservationsJob
{
    private readonly AppDbContext _context;

    public CleanExpiredReservationsJob(AppDbContext context)
    {
        _context = context;
    }

    public async Task ExecuteAsync()
    {
        var expired = await _context.GiuChos
            .Where(x => x.ThoiGianHetHan <= DateTime.Now)
            .ToListAsync();

        if (expired.Any())
        {
            _context.GiuChos.RemoveRange(expired);
            await _context.SaveChangesAsync();
        }
    }
}

//// Đăng ký trong Program.cs (chạy mỗi 5 phút)
//RecurringJob.AddOrUpdate<CleanExpiredReservationsJob>(
//    "clean-expired-reservations",
//    job => job.ExecuteAsync(),
//    "*/5 * * * *"
//);
}
