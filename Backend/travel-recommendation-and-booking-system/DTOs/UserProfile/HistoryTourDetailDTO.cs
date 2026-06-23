namespace travel_recommendation_and_booking_system.DTOs.UserProfile
{
    public class HistoryTourDetailDTO {
        public int MaDonDatTour { get; set; }
        public string MaDatCho { get; set; }
        public int TrangThai { get; set; }
        public string NgayDat { get; set; }
        public string TenTour { get; set; }
        public string NgayKhoiHanh { get; set; }
        public string NgayKetThuc { get; set; }
        public string DiaDiem { get; set; }
        public int SoLuongNguoiLon { get; set; }
        public int SoLuongTreEm { get; set; }
        public int SoLuongEmBe { get; set; }
        public decimal TongTien { get; set; }
        public string PhuongThucThanhToan { get; set; }
    }
}
