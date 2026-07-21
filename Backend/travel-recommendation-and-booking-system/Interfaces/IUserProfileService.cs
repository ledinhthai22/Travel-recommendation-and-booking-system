using DTOs.Page;
using travel_recommendation_and_booking_system.DTOs.User;
using travel_recommendation_and_booking_system.DTOs.UserProfile;

namespace travel_recommendation_and_booking_system.Interfaces
{
    public interface IUserProfileService
    {
        #region Profile Management

        /// <summary>
        /// Lấy thông tin profile của người dùng hiện tại
        /// </summary>
        Task<UserProfileReponseDTO?> GetMyProfileAsync(int maNguoiDung);

        /// <summary>
        /// Cập nhật thông tin profile
        /// </summary>
        Task<bool> UpdateMyProfileAsync(int maNguoiDung, UserProfileDTO dto);

        /// <summary>
        /// Đổi mật khẩu
        /// </summary>
        Task<bool> ChangePasswordAsync(int userId, string oldPassword, string newPassword);

        #endregion

        #region Account Overview

        /// <summary>
        /// Lấy tổng quan tài khoản (số tour, số đánh giá, tổng tiền, tour gần đây)
        /// </summary>
        Task<AccountOverviewDTO> GetAccountOverviewAsync(int userId, int? year = null);

        #endregion

        #region Booking History

        /// <summary>
        /// Lấy lịch sử đặt tour có phân trang
        /// </summary>
        Task<PageDTO<HistoryTourDTO>> GetBookingHistoryAsync(int userId, string searchTerm, int page, int pageSize, int? status);

        /// <summary>
        /// Lấy chi tiết đơn đặt tour
        /// </summary>
        Task<HistoryTourDetailDTO?> GetBookingDetailAsync(int userid, int maDonDatTour);

        #endregion

        #region Cancel Booking

        /// <summary>
        /// User hủy đơn đặt tour
        /// </summary>
        Task<bool> CancelBookingAsync(int userId, int maDonDatTour, string lyDoHuy);

        #endregion

        #region User Reviews

        /// <summary>
        /// Lấy danh sách đánh giá của user
        /// </summary>
        Task<PageDTO<UserReviewDTO>> GetUserReviewsAsync(int userId, string? searchTerm, int? rating, int page, int pageSize);

        #endregion

        #region Refund Management - ĐÃ CHUYỂN SANG IRefundService

        // ĐÃ XÓA: UserConfirmRefundAsync - Chuyển sang IRefundService.ConfirmRefundUserAsync
        // ĐÃ XÓA: AdminConfirmRefundAsync - Chuyển sang IRefundService.ConfirmRefundAsync
        // ĐÃ XÓA: GetPendingRefundsAsync - Chuyển sang IRefundService.GetPendingRefundsAsync

        #endregion
    }
}