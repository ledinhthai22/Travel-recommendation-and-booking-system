// DTOs/TourBooking/CreateBookingAdminDTO.cs
namespace travel_recommendation_and_booking_system.DTOs.TourBooking
{
    public class CreateBookingAdminDTO
    {
        public int MaNguoiDung { get; set; }
        public int MaChuyen { get; set; }
        public int SoNguoiLon { get; set; }
        public int SoTreEm { get; set; }
        public int SoEmBe { get; set; }
        public int? MaKhachSan { get; set; }
        public int? MaUuDai { get; set; }
        public string GhiChu { get; set; } = "";
        public int? MaNhanVien { get; set; }
        public int PhuongThucThanhToan { get; set; }
        public int? TyLeCoc { get; set; }
        public List<CreatePassengerDTO> DanhSachHanhKhach { get; set; } = new();
    }

    public class CreatePassengerDTO
    {
        public string HoTen { get; set; } = "";
        public string? SoDienThoai { get; set; }
        public string? Email { get; set; }
        public DateTime NgaySinh { get; set; }
        public bool GioiTinh { get; set; }
        public int LoaiKhach { get; set; }
        public bool PhongDon { get; set; }
    }
}