namespace travel_recommendation_and_booking_system.Constants
{
    public class DailyItinerary
    {
        public static class LoaiHoatDongConstants
        {
            public const string TAP_TRUNG = "TAP_TRUNG";
            public const string DI_CHUYEN = "DI_CHUYEN";
            public const string THAM_QUAN = "THAM_QUAN";
            public const string AN_UONG = "AN_UONG";
            public const string NGHI_NGOI = "NGHI_NGOI";
            public const string KHAC = "KHAC";

            public static readonly string[] AllowedValues = new[]
            {
            TAP_TRUNG,
            DI_CHUYEN,
            THAM_QUAN,
            AN_UONG,
            NGHI_NGOI,
            KHAC
        };

            public static bool IsValid(string value)
            {
                return string.IsNullOrEmpty(value) || AllowedValues.Contains(value);
            }
        }
    }
}
