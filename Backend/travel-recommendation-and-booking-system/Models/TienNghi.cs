using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace travel_recommendation_and_booking_system.Models
{
    [Table("TienNghi")]
    public class TienNghi
    {
        [Key]
        public int MaTienNghi { get; set; }
        [Required]
        [StringLength(255)]
        public string TenTienNghi { get; set; }
        public DateTime NgayTao { get; set; } = DateTime.Now;
        public DateTime NgayCapNhat { get; set; } = DateTime.Now;
        public DateTime? NgayXoa { get; set; }

        public virtual ICollection<KS_TN> KS_TNs { get; set; } = new List<KS_TN>();
    }
}
