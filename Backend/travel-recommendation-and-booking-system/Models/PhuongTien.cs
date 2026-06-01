using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace WebDuLich.Models
{
    [Table("PhuongTien")]
    public class PhuongTien
    {
        [Key]
        public int MaPhuongTien { get; set; }
        [Required]
        [StringLength(255)]
        public string TenPhuongTien { get; set; }
        [StringLength(255)]
        public string Icon { get; set; }
        public bool TrangThai { get; set; }
        public DateTime NgayTao { get; set; } = DateTime.Now;
        public DateTime NgayCapNhat { get; set; } = DateTime.Now;
        public DateTime? NgayXoa { get; set; }

        public virtual ICollection<ChuyenKhoiHanh> ChuyenKhoiHanhs { get; set; } = new List<ChuyenKhoiHanh>();
    }
}
