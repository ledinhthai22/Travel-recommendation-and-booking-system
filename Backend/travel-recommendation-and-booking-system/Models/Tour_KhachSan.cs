using System.ComponentModel.DataAnnotations.Schema;

namespace travel_recommendation_and_booking_system.Models
{
    [Table("Tour_KhachSan")]
    public class Tour_KhachSan
    {
        public int MaTour { get; set; }
        public int MaKhachSan { get; set; }

        public virtual Tour Tour { get; set; }
        public virtual KhachSan KhachSan { get; set; }
    }
}
