namespace travel_recommendation_and_booking_system.DTOs.TourBooking
{
    public class UpdatePassengerDTO
    {
        public string HoTen { get; set; } = "";
        public string? SoDienThoai { get; set; }
        public DateTime NgaySinh { get; set; }
        public bool GioiTinh { get; set; }
        public int LoaiKhach { get; set; }
        public bool PhongDon { get; set; }
    }
}
