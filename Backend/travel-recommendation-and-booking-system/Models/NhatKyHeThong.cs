using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace travel_recommendation_and_booking_system.Models
{
    [Table("NhatKyHeThong")]
    public class NhatKyHeThong
    {
        [Key]
        public int MaNhatKy { get; set; }

        [Required]
        public string LoaiTaiKhoan { get; set; } = string.Empty;
        [Required]
        public string? Email { get; set; }
        [Required]
        public int MaTaiKhoan { get; set; }

        [Required]
        public string TenHanhDong { get; set; } = string.Empty;

        [Required]
        public string TenBangTacDong { get; set; } = string.Empty;

        public int? MaDoiTuong { get; set; }

        public string? GiaTriTruoc { get; set; }

        public string? GiaTriSau { get; set; }

        public string? DiaChiIP { get; set; }

        public string? TrinhDuyet { get; set; }

        public DateTime ThoiGianTao { get; set; } = DateTime.Now;
    }
}