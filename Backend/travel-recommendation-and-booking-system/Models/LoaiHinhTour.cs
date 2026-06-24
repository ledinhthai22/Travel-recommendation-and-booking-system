using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace travel_recommendation_and_booking_system.Models
{
    [Table("LoaiHinhTour")]
    public class CLoaiHinhTour
    {
        [Key]
        public int MaLoaiTour { get; set; }
        [Required]
        [StringLength(255)]
        public string TenLoaiTour { get; set; }
        public string Slug { get; set; }
        public bool TrangThai { get; set; }
        public DateTime NgayTao { get; set; } = DateTime.Now;
        public DateTime NgayCapNhat { get; set; } = DateTime.Now;
        public DateTime? NgayXoa { get; set; }

        public virtual ICollection<Tour> Tours { get; set; } = new List<Tour>();
        public virtual ICollection<SoThichNguoiDung> SoThichNguoiDungs { get; set; } = new List<SoThichNguoiDung>();
    }
}
