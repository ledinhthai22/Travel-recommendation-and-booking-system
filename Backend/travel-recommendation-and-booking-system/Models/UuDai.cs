using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace travel_recommendation_and_booking_system.Models
{
    [Table("UuDai")]
    public class UuDai
    {
        [Key]
        public int MaUuDai { get; set; }
        [Required]
        [StringLength(50)]
        public string MaCode { get; set; }
        [Required]
        [StringLength(255)]
        public string TenUuDai { get; set; }
        public float PhanTramGiam { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal DieuKienApDung { get; set; }
        public DateTime NgayBatDau { get; set; }
        public DateTime NgayHetHan { get; set; }
        public int SoLuongToiDa { get; set; }
        public bool TrangThai { get; set; }
        public DateTime NgayTao { get; set; } = DateTime.Now;
        public DateTime NgayCapNhat { get; set; } = DateTime.Now;
        public DateTime? NgayXoa { get; set; }

        public virtual ICollection<DonDatTour> DonDatTours { get; set; } = new List<DonDatTour>();
    }
}
