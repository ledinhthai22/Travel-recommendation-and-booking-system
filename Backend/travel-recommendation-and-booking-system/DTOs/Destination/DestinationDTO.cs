namespace travel_recommendation_and_booking_system.DTOs.Destination
{
    public class DestinationDTO
    {
        public string TenDiemDen { get; set; }
        public string QuocGia { get; set; } = "Việt Nam";
        public string DuongDanAnh { get; set; }
        public string MoTa { get; set; }
        public int SoLuongTour { get; set; }    
        public string TinhThanh { get; set; }
        public double DiemDanhGia { get; set; }
    }
}
