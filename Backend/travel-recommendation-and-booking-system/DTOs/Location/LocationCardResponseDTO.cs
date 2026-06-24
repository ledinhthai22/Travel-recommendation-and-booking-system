namespace travel_recommendation_and_booking_system.DTOs.Location
{
    public class LocationCardResponseDTO
    {
        public int MaDiaDiem { get; set; }
        public string TenDiaDiem { get; set; } = null!;
        public string Slug { get; set; } = null!;
        public string? DuongDanAnh { get; set; }
        public string? MoTa { get; set; }
        public int SoLuongTour { get; set; }
        public string TinhThanh { get; set; }
    }
}