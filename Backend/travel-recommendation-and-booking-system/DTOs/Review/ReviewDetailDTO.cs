namespace travel_recommendation_and_booking_system.DTOs.Review
{
    public class ReviewDetailDTO
    {
        public int MaDanhGia { get; set; }
        public int MaNguoiDung { get; set; }
        public string TenNguoiDung { get; set; }
        public string? Email { get; set; }
        public string? SoDienThoai { get; set; }
        public string? DuongDanAnh { get; set; }
        public int MaTour { get; set; }
        public string TenTour { get; set; }
        public int DiemDanhGia { get; set; }
        public string NoiDung { get; set; }
        public bool TrangThai { get; set; }
        public bool IsProcessedByAI { get; set; }
        public string? GhiChuKiemDuyet { get; set; }
        public DateTime NgayTao { get; set; }
        public DateTime? NgayCapNhat { get; set; }
    }
}