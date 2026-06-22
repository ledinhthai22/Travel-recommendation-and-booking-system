using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace travel_recommendation_and_booking_system.Models
{
    [Table("KhachHang")]
    public class KhachHang
    {
        [Key]
        public int MaKhachHang { get; set; }

        [ForeignKey("DonDatTour")]
        public int MaDonDatTour { get; set; }
        [Required]
        [StringLength(255)]
        public string HoTen { get; set; }
        [StringLength(20)]
        public string SoDienThoai { get; set; }
        public DateTime NgaySinh { get; set; }
        public bool GioiTinh { get; set; }
        public string Email { get; set; }
        public int LoaiKhach { get; set; }

        public virtual DonDatTour DonDatTour { get; set; }
    }
}
