using System.ComponentModel.DataAnnotations;

namespace travel_recommendation_and_booking_system.Models
{
    public class PhienDangNhap
    {
        [Key]
        public int MaPhien { get; set; }


        public int? MaNguoiDung { get; set; }

        public int? MaNhanVien { get; set; }


        public virtual NguoiDung? NguoiDung { get; set; }

        public virtual NhanVien? NhanVien { get; set; }


        [Required]
        [StringLength(500)]
        public string RefreshToken { get; set; } = null!;


        public DateTime NgayHetHan { get; set; }


        [StringLength(50)]
        public string? DiaChiIp { get; set; }
    }
}
