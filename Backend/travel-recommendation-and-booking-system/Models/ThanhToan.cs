using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace travel_recommendation_and_booking_system.Models
{
    [Table("ThanhToan")]
    public class ThanhToan
    {
        [Key]
        public int MaThanhToan { get; set; }

        [ForeignKey(nameof(DonDatTour))]
        public int MaDonDatTour { get; set; }

        public int PhuongThucThanhToan { get; set; }
        // 1 = VNPay
        // 2 = Tiền mặt
        // 3 = Chuyển khoản

        [MaxLength(100)]
        public string? MaGiaoDich { get; set; }

        [MaxLength(500)]
        public string? NoiDung { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal TongTienThanhToan { get; set; }

        public DateTime NgayThanhToan { get; set; }

        public int TrangThaiThanhToan { get; set; }
        // 0 = Chờ thanh toán
        // 1 = Thành công
        // 2 = Thất bại
        // 3 = Hoàn tiền

        public virtual DonDatTour DonDatTour { get; set; } = null!;
    }
}