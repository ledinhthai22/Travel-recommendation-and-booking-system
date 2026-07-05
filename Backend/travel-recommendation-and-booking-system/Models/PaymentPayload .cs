// Models/PaymentPayload.cs
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

namespace travel_recommendation_and_booking_system.Models
{
    [Table("PaymentPayload")]
    public class PaymentPayload
    {
        [Key]
        public int Id { get; set; }

        public int MaGiuCho { get; set; }
        public int MaNguoiDung { get; set; }
        public int MaChuyen { get; set; }
        public int SoNguoiLon { get; set; }
        public int SoTreEm { get; set; }
        public int SoEmBe { get; set; }
        public int? MaUuDai { get; set; }
        public decimal TongTienGoc { get; set; }
        public string? GhiChu { get; set; }
        public DateTime NgayTao { get; set; } = DateTime.Now;

        public DateTime? NgayBatDauThanhToan { get; set; }
        [MaxLength(50)]
        public string? TxnRef { get; set; }

        // Lưu danh sách hành khách dạng JSON
        public string DanhSachHanhKhachJson { get; set; } = "[]";

        [NotMapped]
        public List<HanhKhachPayload> DanhSachHanhKhach
        {
            get => JsonSerializer.Deserialize<List<HanhKhachPayload>>(DanhSachHanhKhachJson) ?? new();
            set => DanhSachHanhKhachJson = JsonSerializer.Serialize(value);
        }
    }

    public class HanhKhachPayload
    {
        public string HoTen { get; set; } = "";
        public string? SoDienThoai { get; set; }
        public string? Email { get; set; }
        public DateTime? NgaySinh { get; set; }
        public bool PhongDon { get; set; }
        public bool GioiTinh { get; set; }
        public int LoaiKhach { get; set; }
    }
}