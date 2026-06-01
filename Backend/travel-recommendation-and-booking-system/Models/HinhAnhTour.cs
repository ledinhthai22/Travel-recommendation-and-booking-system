using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace WebDuLich.Models
{
    [Table("HinhAnhTour")]
    public class HinhAnhTour
    {
        [Key]
        public int MaAnhTour { get; set; }

        [ForeignKey("Tour")]
        public int MaTour { get; set; }
        [StringLength(255)]
        public string DuongDanAnh { get; set; }
        public bool AnhChinh { get; set; }
        public int SoThuTu { get; set; }
        public DateTime NgayTao { get; set; } = DateTime.Now;
        public DateTime NgayCapNhat { get; set; } = DateTime.Now;
        public DateTime? NgayXoa { get; set; }

        public virtual Tour Tour { get; set; }
    }
}
