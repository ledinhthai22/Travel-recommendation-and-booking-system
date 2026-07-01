namespace travel_recommendation_and_booking_system.DTOs.Notifications
{
    public class NotificationDTO
    {
        public int MaThongBao { get; set; }

        public string TieuDe { get; set; }

        public string NoiDung { get; set; }

        public int LoaiThongBao { get; set; }

        public bool DaDoc { get; set; }

        public DateTime NgayTao { get; set; }

        public string? LinkChiTiet { get; set; }
    }
    public class CreateNotificationDTO
    {
        public string TieuDe { get; set; }

        public string NoiDung { get; set; }

        public int LoaiThongBao { get; set; }

        public string? LinkChiTiet { get; set; }
    }
    public class MarkAsReadDTO
    {
        public int MaThongBao { get; set; }
    }
    public enum NotificationType
    {
        Booking = 1,
        Contact = 2,
        Newsletter = 3,
        Payment = 4,
        Promotion = 5,
        Review = 6,
        System = 7
    }
    public static class RoleIds
    {
        public const int Admin = 1;
        public const int Staff = 2;
    }
}