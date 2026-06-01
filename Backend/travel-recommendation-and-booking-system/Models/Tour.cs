using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace WebDuLich.Models
{
    [Table("Tour")]
    public class Tour
    {
        [Key]
        public int MaTour { get; set; }

        [ForeignKey("LoaiHinhTour")]
        public int MaLoaiTour { get; set; }
        [Required]
        [StringLength(255)]
        public string TenTour { get; set; }
        public string MoTa { get; set; }
        [StringLength(255)]
        public string ThoiGianTour { get; set; }
        public int SoLuongToiDa { get; set; }
        public int LuotDat { get; set; }
        public int LuotXem { get; set; }
        [StringLength(255)]
        public string DiemKhoiHanh { get; set; }
        public bool TrangThai { get; set; }
        public DateTime NgayTao { get; set; } = DateTime.Now;
        public DateTime NgayCapNhat { get; set; } = DateTime.Now;
        public DateTime? NgayXoa { get; set; }

        public virtual CLoaiHinhTour LoaiHinhTour { get; set; }
        public virtual ICollection<HinhAnhTour> HinhAnhTours { get; set; } = new List<HinhAnhTour>();
        public virtual ICollection<LichTrinh> LichTrinhs { get; set; } = new List<LichTrinh>();
        public virtual ICollection<ChuyenKhoiHanh> ChuyenKhoiHanhs { get; set; } = new List<ChuyenKhoiHanh>();
        public virtual ICollection<Tour_KhachSan> Tour_KhachSans { get; set; } = new List<Tour_KhachSan>();
        public virtual ICollection<DanhSachYeuThich> DanhSachYeuThichs { get; set; } = new List<DanhSachYeuThich>();
        public virtual ICollection<DanhGia> DanhGias { get; set; } = new List<DanhGia>();
    }
}
