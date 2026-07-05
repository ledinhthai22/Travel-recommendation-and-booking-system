namespace travel_recommendation_and_booking_system.DTOs.Tour
{
    public class TourCardDTO
    {
        public int MaTour { get; set; }
        public string TenTour { get; set; }
        public string DuongDanAnh { get; set; }
        public int Ngay { get; set; }
        public int Dem { get; set; }
        public string slug { get; set; }
        public string DiemDen { get; set; }
        public decimal GiaChuyen { get; set; }
        public double DiemDanhGia { get; set; }
        public int SoLuongDanhGia { get; set; }
        public bool IsFavorite { get; set; }
        public int LuotDat {  get; set; }
        public int MaLoaiTour { get; set; }
        public string TenLoaiTour { get; set; }
        public int? SoDanhGia { get; set; }
        public int? LuotXem { get; set; }
    }
}
