using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace travel_recommendation_and_booking_system.Models
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
        public string Slug { get; set; }
        public string MoTa { get; set; }
        [StringLength(100)]
        public string TinhThanh { get; set; }
        [StringLength(100)]
        public DateTime NgayTao { get; set; } = DateTime.Now;
        public DateTime NgayCapNhat { get; set; } = DateTime.Now;
        public DateTime? NgayXoa { get; set; }
        public bool TrangThai { get; set; }
        [ForeignKey("LoaiDiaDiem")]
        public virtual LoaiDiaDiem LoaiDiaDiemNavigation { get; set; }
        public virtual ICollection<CTLichTrinh> CTLichTrinhs { get; set; } = new List<CTLichTrinh>();
        public virtual ICollection<SoThichDiaDiemNguoiDung> SoThichDiaDiemNguoiDungs { get; set; } = new List<SoThichDiaDiemNguoiDung>();

    }
}
