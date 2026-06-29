using travel_recommendation_and_booking_system.Models;

namespace travel_recommendation_and_booking_system.Interfaces
{
    public interface IEmailService
    {
        Task SendEmailAsync(string toEmail, string subject, string body);
        Task SendBookingConfirmationAsync(DonDatTour order);
    }
}