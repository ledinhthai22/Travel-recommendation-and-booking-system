namespace travel_recommendation_and_booking_system.DTOs.UserProfile
{
    public class PendingRefundDTO
    {
        public int MaThanhToan { get; set; }
        public int MaDonDatTour { get; set; }
        public string MaDatCho { get; set; }
        public string TenTour { get; set; }
        public string HoTenKhachHang { get; set; }
        public string SoDienThoai { get; set; }
        public decimal TongTienThanhToan { get; set; }
        public decimal? SoTienHoan { get; set; }
        public string LyDoHuy { get; set; }
        public DateTime NgayThanhToan { get; set; }
    }
}