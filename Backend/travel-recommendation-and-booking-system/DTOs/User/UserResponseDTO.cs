namespace travel_recommendation_and_booking_system.DTOs.User
{
    public class UserResponseDTO
    {
        public int MaNguoiDung { get; set; }
        public string HoTen { get; set; }
        public string Email { get; set; }
        public string? DuongDanAnh { get; set; }
        public string TenVaiTro { get; set; }
        public int TrangThai { get; set; }
        public string TenTrangThai => TrangThai switch
        {
            0 => "Đã khóa",
            1 => "Đang hoạt động"
        };
        public DateTime NgayTao { get; set; }
    }
}
