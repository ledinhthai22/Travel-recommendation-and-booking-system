using travel_recommendation_and_booking_system.DTOs;

namespace travel_recommendation_and_booking_system.Interfaces
{
    public interface IContactService
    {
        Task<bool> SendContactAsync(ContactDTO contact); // gửi liên hệ 
    }
}
