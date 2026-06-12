namespace DTOs.User
{
    public class UserProfileDTO
    {
        public int MaNguoiDung { get; set; }
        public string HoTen { get; set; }
        public string Email { get; set; }
        public string SoDienThoai { get; set; }
        public string? DuongDanAnh { get; set; }
        public string? DiaChi { get; set; }
        public DateTime? NgaySinh { get; set; }
        public int TrangThai { get; set; }
        public int MaVaiTro { get; set; }
        public string TenVaiTro { get; set; }
    }
}
