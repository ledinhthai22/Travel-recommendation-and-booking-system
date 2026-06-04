using System.ComponentModel.DataAnnotations.Schema;

namespace travel_recommendation_and_booking_system.Models
{
    [Table("KS_TN")]
    public class KS_TN
    {
        public int MaKhachSan { get; set; }
        public int MaTienNghi { get; set; }

        public virtual KhachSan KhachSan { get; set; }
        public virtual TienNghi TienNghi { get; set; }
    }
}
