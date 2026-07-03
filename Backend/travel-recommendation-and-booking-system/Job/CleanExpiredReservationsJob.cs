using Hangfire;
using Microsoft.EntityFrameworkCore;
using travel_recommendation_and_booking_system.Data;

namespace travel_recommendation_and_booking_system.Job
{
    public class CleanExpiredReservationsJob
    {
        private readonly AppDbContext _context;

        public CleanExpiredReservationsJob(AppDbContext context)
        {
            _context = context;
        }

        [AutomaticRetry(Attempts = 3)]
        public async Task ExecuteAsync()
        {
            try
            {
                var now = DateTime.Now;

                var expiredReservations = await _context.GiuChos
                    .Where(x =>
                        x.ThoiGianHetHan.AddMinutes(10) <= now
                    )
                    .ToListAsync();

                if (expiredReservations.Any())
                {
                    var maGiuChoIds = expiredReservations
                    .Select(x => x.MaGiuCho)
                    .ToList();

                    var payloads = await _context.PaymentPayloads
                        .Where(x => maGiuChoIds.Contains(x.MaGiuCho))
                        .ToListAsync();

                    _context.PaymentPayloads.RemoveRange(payloads);
                    _context.GiuChos.RemoveRange(expiredReservations);

                    await _context.SaveChangesAsync();

                    Console.WriteLine($"[CleanExpiredReservationsJob] Đã xóa {expiredReservations.Count} giữ chỗ hết hạn.");
                }
                else
                {
                    Console.WriteLine("[CleanExpiredReservationsJob] Không có giữ chỗ nào hết hạn.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[CleanExpiredReservationsJob] Lỗi: {ex.Message}");
                throw;
            }
        }
    }
}