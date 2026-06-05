using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace travel_recommendation_and_booking_system.Models
{
    [Table("CTLichTrinh")]
    public class CTLichTrinh
    {
        [Key]
        public int MaCTLT { get; set; }

        [ForeignKey("LichTrinh")]
        public int MaLichTrinh { get; set; }

        [ForeignKey("DiaDiem")]
        public int MaDiaDiem { get; set; }
        public DateTime GioBatDau { get; set; }
        public DateTime GioKetThuc { get; set; }
        public string HoatDong { get; set; }

        public virtual LichTrinh LichTrinh { get; set; }
        public virtual DiaDiem DiaDiem { get; set; }
    }
}
