namespace travel_recommendation_and_booking_system.Helpers
{

    public static class RefundHelper
    {
        public static decimal TinhTyLeHoanTien(DateTime ngayKhoiHanh, DateTime now)
        {
            var soNgayConLai = (ngayKhoiHanh - now).TotalDays;

            if (soNgayConLai >= 7) return 1.0m;
            if (soNgayConLai >= 5) return 0.7m;
            return 0m;
        }
    }
}