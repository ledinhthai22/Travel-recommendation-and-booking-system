// DTOs/TourBooking/UserBookingListDTO.cs
namespace travel_recommendation_and_booking_system.DTOs.TourBooking
{
    public class UserBookingListDTO
    {
        public int MaDonDatTour { get; set; }
        public string MaDatCho { get; set; }
        public string TenTour { get; set; }
        public string HinhAnh { get; set; }
        public DateTime NgayKhoiHanh { get; set; }
        public DateTime NgayKetThuc { get; set; }
        public string DiemKhoiHanh { get; set; }
        public string DiemDen { get; set; }
        public int SoNguoiLon { get; set; }
        public int SoTreEm { get; set; }
        public int SoEmBe { get; set; }
        public decimal TongTien { get; set; }
        public int TrangThaiThanhToan { get; set; }
        public int TrangThaiDon { get; set; }
        public DateTime NgayDat { get; set; }
    }
}