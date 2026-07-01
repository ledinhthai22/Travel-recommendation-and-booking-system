using travel_recommendation_and_booking_system.DTOs.Notifications;

namespace travel_recommendation_and_booking_system.Interfaces
{
    public interface INotificationService
    {
        #region Create Notification

        /// <summary>
        /// Gửi thông báo cho một người dùng
        /// </summary>
        Task CreateForUserAsync(int userId, CreateNotificationDTO dto);

        /// <summary>
        /// Gửi thông báo cho một nhân viên
        /// </summary>
        Task CreateForStaffAsync(int staffId, CreateNotificationDTO dto);

        /// <summary>
        /// Gửi thông báo cho nhiều người dùng
        /// </summary>
        Task CreateForUsersAsync(List<int> userIds, CreateNotificationDTO dto);

        /// <summary>
        /// Gửi thông báo cho nhiều nhân viên
        /// </summary>
        Task CreateForStaffsAsync(List<int> staffIds, CreateNotificationDTO dto);

        #endregion

        #region Get Notification

        /// <summary>
        /// Danh sách thông báo của User
        /// </summary>
        Task<List<NotificationDTO>> GetNotificationsForUserAsync(
            int userId,
            int page = 1,
            int pageSize = 20);

        /// <summary>
        /// Danh sách thông báo của Nhân viên/Admin
        /// </summary>
        Task<List<NotificationDTO>> GetNotificationsForStaffAsync(
            int staffId,
            int page = 1,
            int pageSize = 20);

        #endregion

        #region Read Notification

        /// <summary>
        /// Đánh dấu một thông báo đã đọc
        /// </summary>
        Task MarkAsReadAsync(int notificationId, int? userId = null, int? staffId = null);

        /// <summary>
        /// Đánh dấu tất cả thông báo đã đọc
        /// </summary>
        Task MarkAllAsReadAsync(int? userId = null, int? staffId = null);

        /// <summary>
        /// Đếm số thông báo chưa đọc
        /// </summary>
        Task<int> GetUnreadCountAsync(int? userId = null, int? staffId = null);

        #endregion
    }
}