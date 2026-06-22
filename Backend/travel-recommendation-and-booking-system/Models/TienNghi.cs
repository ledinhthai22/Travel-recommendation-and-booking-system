using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace travel_recommendation_and_booking_system.Models
{
    [Table("TienNghi")]
    public class TienIch
    {
        [Key]
        public int MaTienIch { get; set; }
        [Required]
        [StringLength(255)]
        public string TenTienIch { get; set; }
        public DateTime NgayTao { get; set; } = DateTime.Now;
        public DateTime NgayCapNhat { get; set; } = DateTime.Now;
        public DateTime? NgayXoa { get; set; }

        public virtual ICollection<KS_TI> KS_TNs { get; set; } = new List<KS_TI>();
    }
}
