using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace travel_recommendation_and_booking_system.Models
{
    public class PhienDangNhap
    {
        [Key]
        public int MaPhien { get; set; }

        public int MaNguoiDung { get; set; }

        [ForeignKey("MaNguoiDung")]
        public NguoiDung NguoiDung { get; set; } = null!;

        [Required]
        public string RefreshToken { get; set; } = null!;

        public DateTime NgayHetHan { get; set; }

        public string? DiaChiIp { get; set; }
    }
}
