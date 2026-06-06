using travel_recommendation_and_booking_system.DTOs;

namespace travel_recommendation_and_booking_system.Interfaces
{
    public interface IUserService
    {
        Task<UserProfileDTO?> GetMeAsync(int maNguoiDung); // thông tin user
    }
}
