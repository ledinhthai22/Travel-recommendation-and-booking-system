// DTOs/TourBooking/ReserveSeatsDTO.cs
namespace travel_recommendation_and_booking_system.DTOs.TourBooking
{
    // Request giữ chỗ tạm
    public class ReserveSeatsDTO
    {
        public int MaChuyen { get; set; }
        public int SoNguoiLon { get; set; }
        public int SoTreEm { get; set; }
        public int SoEmBe { get; set; }
    }

    // Response trả về cho FE
    public class ReserveSeatsResultDTO
    {
        public int MaGiuCho { get; set; }
        public DateTime ThoiGianHetHan { get; set; }
        public int SoChoConLai { get; set; }
    }
}