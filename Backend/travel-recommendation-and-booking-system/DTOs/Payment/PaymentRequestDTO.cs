// DTOs/Payment/PaymentRequestDTO.cs
namespace travel_recommendation_and_booking_system.DTOs.Payment
{
    public class PaymentRequestDTO
    {
        public int MaGiuCho { get; set; }
        public int MaChuyen { get; set; }
        public int? MaKhachSan { get; set; }
        public string MaCodeChuyen { get; set; }// ← THÊM
        public int SoNguoiLon { get; set; }
        public int SoTreEm { get; set; }
        public int SoEmBe { get; set; }
        public int? MaUuDai { get; set; }
        public string? GhiChu { get; set; }
        public List<HanhKhachDTO> DanhSachHanhKhach { get; set; } = new();
    }

    public class HanhKhachDTO
    {
        public string HoTen { get; set; } = "";
        public string? SoDienThoai { get; set; }
        public string? Email { get; set; }
        public DateTime? NgaySinh { get; set; }
        public bool GioiTinh { get; set; }
        public bool PhongDon { get; set; }
        public int LoaiKhach { get; set; }
    }
}