using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace travel_recommendation_and_booking_system.Models
{
    [Table("Tour_KhachSan")]
    public class Tour_KhachSan
    {
        [Key]
        public int MaTourKhachSan { get; set; }  // ← PK riêng, bỏ composite key

        public int MaTour { get; set; }
        public int MaKhachSan { get; set; }


        [ForeignKey("MaTour")]
        public virtual Tour Tour { get; set; }

        [ForeignKey("MaKhachSan")]
        public virtual KhachSan KhachSan { get; set; }

    }
}
