using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace WebDuLich.Models
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
        [StringLength(100)]
        public string Email { get; set; }
        public int LoaiKhach { get; set; }

        public virtual DonDatTour DonDatTour { get; set; }
    }
}
