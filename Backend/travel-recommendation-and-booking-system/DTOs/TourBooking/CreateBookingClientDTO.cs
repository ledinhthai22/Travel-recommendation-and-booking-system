namespace travel_recommendation_and_booking_system.DTOs.TourBooking
{
    public class CreateBookingClientDTO
    {
        public int MaChuyen { get; set; }
        public int? MaUuDai { get; set; }

        public int SoNguoiLon { get; set; }
        public int SoTreEm { get; set; }
        public int SoEmBe { get; set; }
        public int? PhuongThucThanhToan { get; set; }
        public string GhiChu { get; set; } = string.Empty;

        public List<KhachHangInputDTO> DanhSachHanhKhach { get; set; } = new();

        public string? HoTenLienHe { get; set; }
        public string? SoDienThoaiLienHe { get; set; }
        public string? EmailLienHe { get; set; }
        public string? DiaChiLienHe { get; set; }
    }

    public class KhachHangInputDTO
    {
        public string HoTen { get; set; } = string.Empty;
        public string SoDienThoai { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTime NgaySinh { get; set; }
        public bool GioiTinh { get; set; }
        public bool PhongDon { get; set; } = false;
        public int LoaiKhach { get; set; } // 1=NL, 2=TE, 3=EB
    }
}