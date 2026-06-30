using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace travel_recommendation_and_booking_system.Models
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
        public int Ngay { get; set; }
        public int Dem { get; set; }
        public int LuotDat { get; set; }
        public int LuotXem { get; set; }
        public string Slug { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal GiaTu { get; set; }
        public int TrangThai { get; set; }
        //1 = MoBan
        //2 = TamNgung
        //3 = NgungKinhDoanh
        public DateTime NgayTao { get; set; } = DateTime.Now;
        public DateTime NgayCapNhat { get; set; } = DateTime.Now;
        public DateTime? NgayXoa { get; set; }
        [Required]
        //public bool TrongNuoc { get; set; }
        public virtual CLoaiHinhTour LoaiHinhTour { get; set; }
        public virtual ICollection<HinhAnhTour> HinhAnhTours { get; set; } = new List<HinhAnhTour>();
        public virtual ICollection<LichTrinh> LichTrinhs { get; set; } = new List<LichTrinh>();
        public virtual ICollection<ChuyenKhoiHanh> ChuyenKhoiHanhs { get; set; } = new List<ChuyenKhoiHanh>();
        public virtual ICollection<Tour_KhachSan> Tour_KhachSans { get; set; } = new List<Tour_KhachSan>();
        public virtual ICollection<DanhSachYeuThich> DanhSachYeuThichs { get; set; } = new List<DanhSachYeuThich>();
        public virtual ICollection<DanhGia> DanhGias { get; set; } = new List<DanhGia>();
        public virtual ICollection<TrangThaiTuongTac> TrangThaiTuongTacs { get; set; }
    }
}
