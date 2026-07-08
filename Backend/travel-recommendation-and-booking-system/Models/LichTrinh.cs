using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace travel_recommendation_and_booking_system.Models
{
    [Table("LichTrinh")]
    public class LichTrinh
    {
        [Key]
        public int MaLichTrinh { get; set; }

        [ForeignKey("Tour")]
        public int MaTour { get; set; }
        [Required]
        [StringLength(255)]
        public string TenLichTrinh { get; set; }
        [StringLength(255)]
        public string DuongDanAnh { get; set; }
        [StringLength(255)]
        public string BuaAn { get; set; }
        public int SoThuTuNgay { get; set; }
        public string LuuY { get; set; }
        public bool TrangThai { get; set; }
        public DateTime NgayTao { get; set; } = DateTime.Now;
        public DateTime NgayCapNhat { get; set; } = DateTime.Now;
        public DateTime? NgayXoa { get; set; }

        public virtual Tour Tour { get; set; }
        public int? MaKhachSan { get; set; }
        [ForeignKey("MaKhachSan")]
        public virtual KhachSan? KhachSan { get; set; }

        public virtual ICollection<CTLichTrinh> CTLichTrinhs { get; set; } = new List<CTLichTrinh>();

    }
}
