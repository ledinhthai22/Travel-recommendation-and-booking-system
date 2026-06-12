namespace travel_recommendation_and_booking_system.DTOs.User
{
    public class StaffResponseDTO
    {
        public int MaNhanVien { get; set; } 
        public string HoTen { get; set; }
        public string Email { get; set; }
        public string? DuongDanAnh { get; set; }
        public int ChucVu { get; set; }
        public string TenChucVu => ChucVu switch
        {
            1 => "Trưởng phòng Kinh doanh",
            2 => "Giám sát Điều hành",
            3 => "Thiết kế Tour",
            4 => "Chuyên viên CSKH",
            5 => "Kỹ thuật viên IT",
            _ => "Chưa phân bổ"
        };

        public int PhongBan { get; set; }
        public string TenPhongBan => PhongBan switch
        {
            1 => "KINH DOANH",
            2 => "ĐIỀU HÀNH",
            3 => "SẢN PHẨM",
            4 => "CSKH",
            5 => "KỸ THUẬT",
            _ => "Chưa cập nhật"
        };

        public DateTime NgayGiaNhap { get; set; }
        public int TrangThai { get; set; }
        public string TenTrangThai => TrangThai switch
        {
            2 => "Đang làm việc",
            3 => "Nghỉ phép",
            4 => "Đã nghỉ việc",
            _ => "Không xác định"
        };
    }
}