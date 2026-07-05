namespace travel_recommendation_and_booking_system.DTOs
{
    public class SearchDTO
    {
        public string? DiemDen { get; set; }
        public DateTime? NgayDi { get; set; }
        public DateTime? NgayVe { get; set; }
        public string? Keyword { get; set; } 
        public int? MaLoaiTour { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public int? NgayTu { get; set; }
        public int? NgayDen { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 12;
    }

    public class SearchResponse
    {
        public int MaTour { get; set; }
        public string TenTour { get; set; }
        public string Slug { get; set; }
        public decimal GiaTu { get; set; }
        public int Ngay { get; set; }
        public int Dem { get; set; }
        public string DuongDanAnh { get; set; }
        public string LoaiHinhTour { get; set; }
        public string DiemDen { get; set; }
        public int? SoDanhGia { get; set; }
        public int? LuotXem { get; set; }
        public double DiemDanhGia { get; set; }
        public int LuotDat { get; set; }
    }
}