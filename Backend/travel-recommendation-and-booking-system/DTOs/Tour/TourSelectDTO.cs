namespace travel_recommendation_and_booking_system.DTOs.Tour
{
    public class TourSelectDTO
    {
        public int MaTour { get; set; }
        public string TenTour { get; set; }
        public string MaTourCode { get; set; }
        public string DiemDen { get; set; }
        public string DiemKhoiHanh { get; set; }
        public int TrangThai { get; set; }
        public decimal GiaTu { get; set; }
        public bool TrongNuoc { get; set; }
    }
}
