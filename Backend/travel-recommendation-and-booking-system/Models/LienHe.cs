using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace travel_recommendation_and_booking_system.Models
{
    [Table("LienHe")]
    public class LienHe
    {
        [Key]
        public int MaLienHe { get; set; }
        [Required]
        [StringLength(255)]
        public string HoTen { get; set; }
        [Required]
        [StringLength(100)]
        public string Email { get; set; }
        public string NoiDung { get; set; }
        [Required]
        public string SoDienThoai { get; set; }
        public bool TrangThai { get; set; }
        public DateTime NgayTao { get; set; } = DateTime.Now;
        public DateTime NgayCapNhat { get; set; } = DateTime.Now;
        public DateTime? NgayXoa { get; set; }
    }
}
