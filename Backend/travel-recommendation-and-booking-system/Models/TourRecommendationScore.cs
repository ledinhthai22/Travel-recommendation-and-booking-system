using System.ComponentModel.DataAnnotations.Schema;

namespace travel_recommendation_and_booking_system.Models
{
    [Table("TourRecommendationScore")]
    public class TourRecommendationScore
    {
        public int MaNguoiDung { get; set; }
        public int MaTour { get; set; }
        public float Score { get; set; }
        public DateTime NgayCapNhat { get; set; } = DateTime.Now;

        [ForeignKey(nameof(MaNguoiDung))]
        public virtual NguoiDung NguoiDung { get; set; }

        [ForeignKey(nameof(MaTour))]
        public virtual Tour Tour { get; set; }
    }
}