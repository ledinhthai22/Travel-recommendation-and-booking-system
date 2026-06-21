using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace travel_recommendation_and_booking_system.Models
{
    [Table("ChuyenKhoiHanh")]
    public class ChuyenKhoiHanh
    {
        [Key]
        public int MaChuyen { get; set; }

        [ForeignKey("HuongDanVien")]
        public int? MaHDV { get; set; }

        [ForeignKey("Tour")]
        public int MaTour { get; set; }

        [ForeignKey("PhuongTien")]
        public int MaPhuongTien { get; set; }

        [Required]
        [StringLength(255)]
        public string MaChuyenCode { get; set; }
        [Required]
        [StringLength(255)]
        public string DiemKhoiHanh { get; set; }
        [StringLength(255)]
        public string DiemDen { get; set; }
        public DateTime NgayKhoiHanh { get; set; }
        public DateTime GioDenNoiDi { get; set; }
        public DateTime NgayKetThuc { get; set; }
        public DateTime GioDenNoiVe { get; set; }
        public int SoLuongCho { get; set; }
        public string GhiChu { get; set; }
        public DateTime NgayTao { get; set; } = DateTime.Now;
        public DateTime NgayCapNhat { get; set; } = DateTime.Now;
        public DateTime? NgayXoa { get; set; }
        public int TrangThai { get; set; }
        public virtual NguoiDung HuongDanVien { get; set; }
        public virtual Tour Tour { get; set; }
        public virtual PhuongTien PhuongTien { get; set; }
        public virtual ICollection<GiaChuyen> GiaChuyens { get; set; } = new List<GiaChuyen>();
        public virtual ICollection<DonDatTour> DonDatTours { get; set; } = new List<DonDatTour>();
    }
}
