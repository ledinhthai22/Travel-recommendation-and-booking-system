namespace travel_recommendation_and_booking_system.DTOs.Promotion
{
    public class PromotionResponseDTO
    {
        public int MaUuDai { get; set; }
        public string MaCode { get; set; }
        public string TenUuDai { get; set; }
        public decimal PhanTramGiam { get; set; }
        public decimal DieuKienApDung { get; set; }
        public DateTime NgayBatDau { get; set; }
        public DateTime NgayHetHan { get; set; }
        public int SoLuongToiDa { get; set; }
        public int TrangThai { get; set; }
        public DateTime NgayTao { get; set; } = DateTime.Now;
        public DateTime NgayCapNhat { get; set; } = DateTime.Now;
    }
}
