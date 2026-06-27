namespace travel_recommendation_and_booking_system.DTOs.Departure
{
    public class DepartureSelectDTO
    {
        public int MaChuyen { get; set; }
        public string MaChuyenCode { get; set; }
        public int MaTour { get; set; }
        public string TenTour { get; set; }
        public string DiemKhoiHanh { get; set; }
        public string DiemDen { get; set; }
        public DateTime NgayKhoiHanh { get; set; }
        public DateTime NgayKetThuc { get; set; }
        public int SoChoToiDa { get; set; }
        public int SoChoDaDat { get; set; }
        public int SoChoConLai { get; set; }
        public int TrangThai { get; set; }
        public string TenHuongDanVien { get; set; }
        public string TenPhuongTien { get; set; }
        public decimal GiaNguoiLon { get; set; }
        public decimal GiaTreEm { get; set; }
        public decimal GiaEmBe { get; set; }
        public decimal PhuThuPhongDon { get; set; }
    }
}
