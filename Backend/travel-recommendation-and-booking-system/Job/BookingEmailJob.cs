using Hangfire;
using Microsoft.EntityFrameworkCore;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Models;
using travel_recommendation_and_booking_system.Services;

namespace travel_recommendation_and_booking_system.Job
{
    public class BookingEmailJob
    {
        private readonly IEmailService _emailService;
        private readonly AppDbContext _context;
        public BookingEmailJob(IEmailService emailService,AppDbContext context)
        {
            _emailService = emailService;
            _context = context;
        }

        [AutomaticRetry(Attempts = 3)]
        public async Task SendBookingConfirmation(int maDonDatTour)
        {
            var order = await _context.DonDatTours
                .Include(x => x.NguoiDung)
                .Include(x => x.ChuyenKhoiHanh).ThenInclude(x => x.Tour)
                .Include(x => x.KhachHangs)
                .FirstOrDefaultAsync(x => x.MaDonDatTour == maDonDatTour);

            if (order == null)
            {
                Console.WriteLine($"[BookingEmailJob] Không tìm thấy đơn {maDonDatTour}");
                return;
            }

            await _emailService.SendBookingConfirmationAsync(order);
        }
    }
}