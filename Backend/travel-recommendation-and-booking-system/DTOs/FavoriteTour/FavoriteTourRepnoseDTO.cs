using System.Text.Json.Serialization;

namespace travel_recommendation_and_booking_system.DTOs.FavoriteTour
{
    public class FavoriteTourRepnoseDTO
    {
        public int Matour { get; set; }
        public string TenTour { get; set; }
        public string DuongDanAnh { get; set; }
        public string ThoiGianTour { get; set; }
        public string DiemKhoiHanh { get; set; }
        public double DiemDanhGia { get; set; }
        public int ReviewCount { get; set; }
        public decimal GiaTour { get; set; }
    }
}
