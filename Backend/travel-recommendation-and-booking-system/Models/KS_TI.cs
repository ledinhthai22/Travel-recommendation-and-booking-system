using System.ComponentModel.DataAnnotations.Schema;

namespace travel_recommendation_and_booking_system.Models
{
    [Table("KS_TI")]
    public class KS_TI
    {
        public int MaKhachSan { get; set; }
        public int MaTienIch { get; set; }

        public virtual KhachSan KhachSan { get; set; }
        public virtual TienIch TienIch { get; set; }
    }
}
