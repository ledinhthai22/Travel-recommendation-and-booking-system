namespace travel_recommendation_and_booking_system.Models
{
    public class VnPayConfig
    {
        public string TmnCode { get; set; } = string.Empty;
        public string HashSecret { get; set; } = string.Empty;
        public string BaseUrl { get; set; } = string.Empty;
        public string Command { get; set; } = string.Empty;
        public string CurrCode { get; set; } = string.Empty;
        public string Version { get; set; } = string.Empty;
        public string Locale { get; set; } = string.Empty;
        public string ReturnUrl { get; set; } = string.Empty;
        public string IpnUrl { get; set; } = string.Empty;
    }
}