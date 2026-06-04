using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace travel_recommendation_and_booking_system.Models
{
    [Table("HinhAnhSK")]
    public class HinhAnhSK
    {
        [Key]
        public int MaAnhSK { get; set; }

        [ForeignKey("KhachSan")]
        public int MaKhachSan { get; set; }
        [StringLength(255)]
        public string DuongDanAnh { get; set; }
        public bool AnhChinh { get; set; }
        public int SoThuTu { get; set; }
        public DateTime NgayTao { get; set; } = DateTime.Now;
        public DateTime NgayCapNhat { get; set; } = DateTime.Now;
        public DateTime? NgayXoa { get; set; }

        public virtual KhachSan KhachSan { get; set; }
    }
}
