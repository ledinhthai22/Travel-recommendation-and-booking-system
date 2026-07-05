namespace travel_recommendation_and_booking_system.DTOs.TypeTour
{
    public class TourCardResponseDTO
    {
        public int MaTour { get; set; }

        public string TenTour { get; set; } = string.Empty;
        public string? TenLoaiTour { get; set; }
        public int MaLoaiTour { get; set; }
        public string Slug { get; set; } = string.Empty;

        public string? MoTa { get; set; }

        public int Ngay { get; set; }
        public int Dem { get; set; }

        public decimal GiaTu { get; set; }

        public string? HinhAnhChinh { get; set; }

        public List<string> DiemDens { get; set; } = new();

        public int TongSoChoDaDat { get; set; }
        public int? SoDanhGia { get; set; }
        public double? DiemDanhGia { get; set; }     // Ví dụ: 4.8

        public int LuotDat { get; set; }             // Số lượt đặt
        public int? LuotXem { get; set; }            // Số lượt xem
        public bool IsFavorite { get; set; }
        public bool TrongNuoc { get; set; }          // Giữ lại nếu cần

        // Thông tin bổ sung cho UI
        public string? ThoiGianTour => $"{Ngay} ngày {Dem} đêm";
        public string? DiemDenChinh => DiemDens.FirstOrDefault();
    }
}