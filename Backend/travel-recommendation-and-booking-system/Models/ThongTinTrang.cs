using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace travel_recommendation_and_booking_system.Models
{
    [Table("ThongTinTrang")]
    public class ThongTinTrang
    {
        [Key]
        public int MaTTTrang { get; set; }
        public string Key { get; set; }
        public string? Noidung { get; set; }
        public bool? Trangthai { get; set; } = true;
        public DateTime? NgayCapNhat { get; set; } = DateTime.Now;
        public DateTime? NgayXoa { get; set; }
    }
}
