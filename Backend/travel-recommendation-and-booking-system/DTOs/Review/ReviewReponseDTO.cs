namespace travel_recommendation_and_booking_system.DTOs.Review
{
    public class ReviewReponseDTO {
        public int MaDanhGia { get; set; }
        public string TenNguoiDung { get; set; }
        public string TenTour { get; set; }
        public int DiemDanhGia { get; set; }
        public string NoiDung { get; set; }
        public bool TrangThai { get; set; }
        public bool IsProcessedByAI { get; set; }
        public string? GhiChuKiemDuyet { get; set; }
        public string DuongDanAnh {  get; set; }
        public string NgayTao { get; set; }
    }
}
