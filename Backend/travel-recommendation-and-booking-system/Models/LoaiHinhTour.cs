using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace WebDuLich.Models
{
    [Table("LoaiHinhTour")]
    public class CLoaiHinhTour
    {
        [Key]
        public int MaLoaiTour { get; set; }
        [Required]
        [StringLength(255)]
        public string TenLoaiTour { get; set; }
        public bool TrangThai { get; set; }
        public DateTime NgayTao { get; set; } = DateTime.Now;
        public DateTime NgayCapNhat { get; set; } = DateTime.Now;
        public DateTime? NgayXoa { get; set; }

        public virtual ICollection<Tour> Tours { get; set; } = new List<Tour>();
        public virtual ICollection<SoThichNguoiDung> SoThichNguoiDungs { get; set; } = new List<SoThichNguoiDung>();
    }
}
