namespace travel_recommendation_and_booking_system.DTOs.TourBooking
{
    public class UpdateBookingAdminDTO
    {
        public int MaDonDatTour { get; set; }

        public int? SoNguoiLon { get; set; }
        public int? SoTreEm { get; set; }
        public int? SoEmBe { get; set; }

        public int? MaKhachSan { get; set; }
        public int? MaUuDai { get; set; }

        public int? TrangThaiDon { get; set; }

        public int? MaNhanVien { get; set; }
    }
}
