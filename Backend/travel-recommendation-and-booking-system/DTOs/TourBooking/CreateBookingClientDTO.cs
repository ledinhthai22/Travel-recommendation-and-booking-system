namespace travel_recommendation_and_booking_system.DTOs.TourBooking
{
    public class CreateBookingClientDTO
    {
        public int MaChuyen { get; set; }
        public int? MaUuDai { get; set; }

        public int SoNguoiLon { get; set; }
        public int SoTreEm { get; set; }
        public int SoEmBe { get; set; }
        
        public string GhiChu { get; set; }
        public List<KhachHangInputDTO> DanhSachHanhKhach { get; set; } = new();
    }

    public class KhachHangInputDTO
    {
        public string HoTen { get; set; }
        public string SoDienThoai { get; set; }
        public string Email { get; set; }
        public DateTime NgaySinh { get; set; }
        public bool GioiTinh { get; set; }
        public bool PhongDon { get; set; } = false;
        public int LoaiKhach { get; set; } // 1=NL, 2=TE, 3=EB
    }
}