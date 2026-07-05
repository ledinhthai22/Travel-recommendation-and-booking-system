using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using travel_recommendation_and_booking_system.DTOs.Notifications;
using travel_recommendation_and_booking_system.Interfaces;

namespace travel_recommendation_and_booking_system.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationService _notificationService;
        private readonly ICurrentUserService _currentUserService;

        public NotificationController(
            INotificationService notificationService,
            ICurrentUserService currentUserService)
        {
            _notificationService = notificationService;
            _currentUserService = currentUserService;
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetMyNotifications(
            int page = 1,
            int pageSize = 20)
        {
            var userId = _currentUserService.GetUserId();

            var result = await _notificationService
                .GetNotificationsForUserAsync(userId, page, pageSize);

            return Ok(result);
        }


        [HttpGet("staff")]
        public async Task<IActionResult> GetStaffNotifications(
            int page = 1,
            int pageSize = 20)
        {
            var staffId = _currentUserService.GetUserId();

            var result = await _notificationService
                .GetNotificationsForStaffAsync(staffId, page, pageSize);

            return Ok(result);
        }


        [HttpPost("mark-read")]
        public async Task<IActionResult> MarkAsRead(
            [FromBody] MarkAsReadDTO dto)
        {
            var roleId = _currentUserService.GetRoleId();
            var id = _currentUserService.GetUserId();

            if (roleId == 4) // Khách hàng
            {
                await _notificationService.MarkAsReadAsync(dto.MaThongBao, id, null);
            }
            else
            {
                await _notificationService.MarkAsReadAsync(dto.MaThongBao, null, id);
            }

            return Ok(new { success = true });
        }

        [HttpPost("mark-all-read")]
        public async Task<IActionResult> MarkAllRead()
        {
            var roleId = _currentUserService.GetRoleId();
            var id = _currentUserService.GetUserId();

            if (roleId == 4)
            {
                await _notificationService.MarkAllAsReadAsync(id, null);
            }
            else
            {
                await _notificationService.MarkAllAsReadAsync(null, id);
            }

            return Ok(new { success = true });
        }


        [HttpGet("unread-count")]
        public async Task<IActionResult> GetUnreadCount()
        {
            var roleId = _currentUserService.GetRoleId();
            var id = _currentUserService.GetUserId();

            int count;

            if (roleId == 4)
            {
                count = await _notificationService.GetUnreadCountAsync(id, null);
            }
            else
            {
                count = await _notificationService.GetUnreadCountAsync(null, id);
            }

            return Ok(new
            {
                unreadCount = count
            });
        }
    }
}