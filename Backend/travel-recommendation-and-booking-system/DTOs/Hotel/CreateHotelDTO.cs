namespace travel_recommendation_and_booking_system.DTOs.Hotel
{
    public class CreateHotelDTO
    {
        public string TenKhachSan { get; set; }
        public int SoSao { get; set; }
        public string DiaChi { get; set; }
        public string SoDienThoai { get; set; }
        public string MoTa { get; set; }
        public bool TrangThai { get; set; }

        public List<int>? MaTienIch { get; set; }
    }
}
