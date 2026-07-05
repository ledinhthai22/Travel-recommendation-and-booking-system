namespace travel_recommendation_and_booking_system.DTOs.Tour
{
    public class FilterTourDTO
    {
        public string? Keyword { get; set; }
        public int? MaLoaiTour { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public int? NgayTu { get; set; }   // ⬅ thay cho SoNgay, khớp khoảng
        public int? NgayDen { get; set; }  // ⬅ null nếu là "trên 1 tuần" (chỉ cần NgayTu)
        public string? DiemDen { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}