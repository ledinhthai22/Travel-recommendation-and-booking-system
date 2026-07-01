namespace travel_recommendation_and_booking_system.DTOs.TypeTour
{
    public class TourCardResponseDTO
    {
        public int MaTour { get; set; }

        public string TenTour { get; set; }
        public string TenLoaiTour { get; set; }
        public int MaLoaiTour { get; set; }
        public string Slug { get; set; }

        public string? MoTa { get; set; }

        public int Ngay { get; set; }

        public int Dem { get; set; }

        public bool TrongNuoc { get; set; }

        public decimal GiaTu { get; set; } // thêm

        public string? HinhAnhChinh { get; set; }

        public List<string> DiemDens { get; set; } = new();
    }
}