namespace travel_recommendation_and_booking_system.DTOs.TypeTour
{
    public class TypeTourReponseDTO {
        public int MaLoaiTour { get; set; }
        public string TenLoaiTour { get; set; }
        public DateTime NgayTao { get; set; }
        public DateTime NgayCapNhat { get; set; }
        public DateTime? NgayXoa { get; set; }
        public bool TrangThai { get; set; }
    }
}
