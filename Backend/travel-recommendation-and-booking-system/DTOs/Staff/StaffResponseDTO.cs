namespace travel_recommendation_and_booking_system.DTOs.Staff
{
    public class StaffResponseDTO
    {
        public int MaNhanVien { get; set; }
        public string HoTen { get; set; }
        public string Email { get; set; }
        public string SoDienThoai { get; set; }
        public string? DuongDanAnh { get; set; }
        public string DiaChi { get; set; }
        public DateTime? NgaySinh { get; set; }
        public bool GioiTinh { get; set; }
        public int? TrangThai { get; set; }
        public int MaVaiTro { get; set; }
        public string TenVaiTro { get; set; }
        public string Cccd { get; set; }
        public DateTime? NgayTao { get; set; }
        public DateTime? NgayCapNhat { get; set; }
    }
}

