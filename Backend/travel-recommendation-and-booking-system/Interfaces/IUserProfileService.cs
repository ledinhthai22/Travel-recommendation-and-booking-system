using DTOs.Page;
using GenerativeAI.Types;
using travel_recommendation_and_booking_system.DTOs.UserProfile;

namespace travel_recommendation_and_booking_system.Interfaces
{
    public interface IUserProfileService {
        Task<UserProfileReponseDTO?> GetMyProfileAsync(int id);
        Task<bool> UpdateMyProfileAsync(int maNguoiDung, UserProfileDTO dto);
        Task<bool> ChangePasswordAsync(int userId, string oldPassword, string newPassword);
        Task<AccountOverviewDTO> GetAccountOverviewAsync(int userId);
        Task<PageDTO<HistoryTourDTO>> GetBookingHistoryAsync(int userId, string searchTerm, int page, int pageSize,int? status);
        Task<HistoryTourDetailDTO> GetBookingDetailAsync(int userid,int maDonDatTour);
        Task<bool> CancelBookingAsync(int userId, int maDonDatTour);
    }

}
