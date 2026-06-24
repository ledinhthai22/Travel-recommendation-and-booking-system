using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace travel_recommendation_and_booking_system.Models
{
    [Table("KhachSan")]
    public class KhachSan
    {
        [Key]
        public int MaKhachSan { get; set; }
        [Required]
        [StringLength(255)]
        public string TenKhachSan { get; set; }
        public string Slug { get; set; }
        public int SoSao { get; set; }
        [StringLength(255)]
        public string DiaChi { get; set; }
        [StringLength(20)]
        public string SoDienThoai { get; set; }
        public string MoTa { get; set; }
        public bool TrangThai { get; set; }
        public DateTime NgayTao { get; set; } = DateTime.Now;
        public DateTime NgayCapNhat { get; set; } = DateTime.Now;
        public DateTime? NgayXoa { get; set; }

        public virtual ICollection<HinhAnhSK> HinhAnhSKs { get; set; } = new List<HinhAnhSK>();
        public virtual ICollection<KS_TI> KS_TNs { get; set; } = new List<KS_TI>();
        public virtual ICollection<Tour_KhachSan> Tour_KhachSans { get; set; } = new List<Tour_KhachSan>();
        public virtual ICollection<DonDatTour> DonDatTours { get; set; } = new List<DonDatTour>();
    }
}
