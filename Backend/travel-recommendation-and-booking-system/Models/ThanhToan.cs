using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace travel_recommendation_and_booking_system.Models
{
    [Table("ThanhToan")]
    public class ThanhToan
    {
        [Key]
        public int MaThanhToan { get; set; }
        public bool PhuongThucThanhToan { get; set; }

        [ForeignKey("DonDatTour")]
        public int MaDonDatTour { get; set; }
        public string MaGiaoDich { get; set; }
        public string NoiDung { get; set; }
        public DateTime NgayThanhToan { get; set; }
        public bool TrangThaiThanhToan { get; set; }

        public virtual DonDatTour DonDatTour { get; set; }
    }
}
