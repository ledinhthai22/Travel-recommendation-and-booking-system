using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using travel_recommendation_and_booking_system.DTOs.Payment;
using travel_recommendation_and_booking_system.DTOs.TourBooking;

namespace travel_recommendation_and_booking_system.Models
{
    [Table("PaymentPayload")]
    public class PaymentPayload
    {
        [Key]
        public int MaPaymentPayload { get; set; }
        public int? MaGiuCho { get; set; }
        public int? MaDonDatTour { get; set; }
        public int MaNguoiDung { get; set; }
        public int MaChuyen { get; set; }


        public int SoNguoiLon { get; set; }
        public int SoTreEm { get; set; }
        public int SoEmBe { get; set; }

        public int? MaUuDai { get; set; }

        public decimal TongTienGoc { get; set; }
        public int TyLeThanhToan { get; set; }
        public int LoaiGiaoDich { get; set; } // 1: Đặt mới, 2: Thanh toán còn lại
 
        public string? TxnRef { get; set; }
        public DateTime? NgayBatDauThanhToan { get; set; }

        public string? GhiChu { get; set; }

        public string? HoTenLienHe { get; set; }
        public string? SoDienThoaiLienHe { get; set; }
        public string? EmailLienHe { get; set; }
        public string? DiaChiLienHe { get; set; }

        public bool DaXuLy { get; set; }

        public string? DanhSachHanhKhachJson { get; set; }

        [NotMapped]
        public List<KhachHangDTO>? DanhSachHanhKhach
        {
            get => string.IsNullOrEmpty(DanhSachHanhKhachJson)
                ? new List<KhachHangDTO>()
                : System.Text.Json.JsonSerializer.Deserialize<List<KhachHangDTO>>(DanhSachHanhKhachJson);
            set => DanhSachHanhKhachJson = value == null
                ? null
                : System.Text.Json.JsonSerializer.Serialize(value);
        }

        [ForeignKey(nameof(MaGiuCho))]
        public virtual GiuCho? GiuCho { get; set; }

        [ForeignKey(nameof(MaDonDatTour))]
        public virtual DonDatTour? DonDatTour { get; set; }

        [ForeignKey(nameof(MaNguoiDung))]
        public virtual NguoiDung? NguoiDung { get; set; }

        [ForeignKey(nameof(MaChuyen))]
        public virtual ChuyenKhoiHanh? ChuyenKhoiHanh { get; set; }
    }
}