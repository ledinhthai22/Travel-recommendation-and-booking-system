using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace travel_recommendation_and_booking_system.Models
{
    [Table("GiaChuyen")]
    public class GiaChuyen
    {
        [Key]
        public int MaGia { get; set; }

        [ForeignKey("ChuyenKhoiHanh")]
        public int Machuyen { get; set; }
        public int HangKhachSan { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal GiaNguoiLon { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        public decimal GiaTreEm { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        public decimal GiaEmBe { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        public decimal PhuThuPhongDon { get; set; }
        public DateTime NgayTao { get; set; } = DateTime.Now;
        public DateTime NgayCapNhat { get; set; } = DateTime.Now;
        public DateTime? NgayXoa { get; set; }

        public virtual ChuyenKhoiHanh ChuyenKhoiHanh { get; set; }
    }
}
