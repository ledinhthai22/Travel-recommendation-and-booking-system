using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace travel_recommendation_and_booking_system.Models
{
    public class NhanVien
    {
        [Key]
        public int MaNhanVien { get; set; }


        [Required]
        [StringLength(255)]
        public string HoTen { get; set; }
        public string? DuongDanAnh { get; set; }
        [Required]
        [StringLength(100)]
        public string Email { get; set; }
        [StringLength(255)]
        public string? DiaChi { get; set; }
        public bool GioiTinh { get; set; }
        [Required]
        [StringLength(64)]
        public string MatKhau { get; set; }
        [StringLength(20)]
        public string SoDienThoai { get; set; }
        public DateTime? NgaySinh { get; set; }
        [Required]
        [StringLength(12)]
        public string Cccd { get; set; }
        public DateTime NgayTao { get; set; } = DateTime.Now;
        public DateTime NgayCapNhat { get; set; } = DateTime.Now;
        public DateTime? NgayXoa { get; set; }
        public int TrangThai { get; set; }
        public int MaVaiTro { get; set; }

        [ForeignKey("MaVaiTro")]
        public virtual VaiTro VaiTro { get; set; }
        public ICollection<PhienDangNhap>? PhienDangNhaps { get; set; }
    }
}
