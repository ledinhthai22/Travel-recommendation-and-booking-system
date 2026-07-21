// Helpers/AuditLogHelper.cs
using System.Text.Json;
using travel_recommendation_and_booking_system.Models;

namespace travel_recommendation_and_booking_system.Helpers
{
    public static class AuditLogHelper
    {
        /// <summary>
        /// Ghi lại lịch sử thay đổi trạng thái đơn
        /// </summary>
        public static void AppendStatusHistory(this DonDatTour order, 
            int oldStatus, int newStatus, string action, string? note = null)
        {
            var historyEntry = new StatusHistoryEntry
            {
                OldStatus = oldStatus,
                NewStatus = newStatus,
                Action = action,
                Note = note ?? string.Empty,
                Timestamp = DateTime.Now,
                UserId = System.Threading.Thread.CurrentPrincipal?.Identity?.Name ?? "System"
            };

            var history = string.IsNullOrEmpty(order.LichSuTrangThai)
                ? new List<StatusHistoryEntry>()
                : JsonSerializer.Deserialize<List<StatusHistoryEntry>>(order.LichSuTrangThai) ?? new List<StatusHistoryEntry>();

            history.Add(historyEntry);

            // Giới hạn lịch sử (giữ 50 bản ghi gần nhất)
            if (history.Count > 50)
                history = history.Skip(history.Count - 50).ToList();

            order.LichSuTrangThai = JsonSerializer.Serialize(history);
        }

        /// <summary>
        /// Lấy lịch sử thay đổi trạng thái
        /// </summary>
        public static List<StatusHistoryEntry> GetStatusHistory(this DonDatTour order)
        {
            if (string.IsNullOrEmpty(order.LichSuTrangThai))
                return new List<StatusHistoryEntry>();

            return JsonSerializer.Deserialize<List<StatusHistoryEntry>>(order.LichSuTrangThai) 
                   ?? new List<StatusHistoryEntry>();
        }
    }

    public class StatusHistoryEntry
    {
        public int OldStatus { get; set; }
        public int NewStatus { get; set; }
        public string Action { get; set; } = string.Empty;
        public string Note { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public string UserId { get; set; } = string.Empty;
    }
}