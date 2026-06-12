using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace travel_recommendation_and_booking_system.Models
{
    [Table("Banner")]
    public class Banner
    {
        [Key]
        public int MaBanner { get; set; }
        [StringLength(255)]
        public string DuongDanAnh { get; set; }
        [StringLength(255)]
        public string LinkLienKet { get; set; }
        public string TieuDe {  get; set; }
        public bool TrangThai { get; set; }
        public DateTime NgayTao { get; set; } = DateTime.Now;
        public DateTime NgayCapNhat { get; set; } = DateTime.Now;
        public DateTime? NgayXoa { get; set; }
    }
}
