using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace WebDuLich.Models
{
    [Table("DiaDiem")]
    public class DiaDiem
    {
        [Key]
        public int MaDiaDiem { get; set; }
        [Required]
        [StringLength(255)]
        public string TenDiaDiem { get; set; }
        [StringLength(255)]
        public string DuongDanAnh { get; set; }
        public int LoaiDiaDiem { get; set; }
        public string MoTa { get; set; }
        [StringLength(100)]
        public string TinhThanh { get; set; }
        [StringLength(100)]
        public string QuocGia { get; set; }
        public bool KhuVuc { get; set; }
        public DateTime NgayTao { get; set; } = DateTime.Now;
        public DateTime NgayCapNhat { get; set; } = DateTime.Now;
        public DateTime? NgayXoa { get; set; }
        public bool TrangThai { get; set; }

        public virtual ICollection<CTLichTrinh> CTLichTrinhs { get; set; } = new List<CTLichTrinh>();
    }
}
