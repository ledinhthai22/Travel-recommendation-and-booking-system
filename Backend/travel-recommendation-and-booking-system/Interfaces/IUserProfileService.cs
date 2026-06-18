using travel_recommendation_and_booking_system.DTOs.UserProfile;

namespace travel_recommendation_and_booking_system.Interfaces
{
    public interface IUserProfileService {
        Task<UserProfileReponseDTO?> GetMyProfileAsync(int id);
        Task<bool> UpdateMyProfileAsync(int maNguoiDung, UserProfileDTO dto);
    }

}
