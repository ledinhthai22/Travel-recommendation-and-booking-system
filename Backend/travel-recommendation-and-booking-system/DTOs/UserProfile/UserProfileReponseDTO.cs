namespace travel_recommendation_and_booking_system.DTOs.UserProfile
{
    public class UserProfileReponseDTO {
        public int MaNguoiDung { get; set; }
        public string HoTen { get; set; }
        public string Email { get; set; }
        public string? DuongDanAnh { get; set; }
        public string? DiaChi { get; set; }
        public DateTime? NgaySinh { get; set; }
        public string SoDienThoai { get; set; }
        public bool GioiTinh { get; set; }
    }
}
