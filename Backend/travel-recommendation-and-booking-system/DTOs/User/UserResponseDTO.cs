namespace travel_recommendation_and_booking_system.DTOs.User
{
    public class UserResponseDTO
    {
        public int MaNguoiDung { get; set; }
        public string HoTen { get; set; }
        public string Email { get; set; }
        public string? DuongDanAnh { get; set; }
        public string? DiaChi { get; set; }
        public DateTime? NgaySinh { get; set; }
        public string SoDienThoai { get; set; }
        public string TenVaiTro { get; set; }
        public bool GioiTinh { get; set; }
        public int TrangThai { get; set; }
        public string TenTrangThai => TrangThai switch
        {
            0 => "Đã khóa",
            1 => "Đang hoạt động",
            _ =>"Không xác định"
        };
        public DateTime NgayTao { get; set; }
    }
}
