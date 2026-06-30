using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace travel_recommendation_and_booking_system.Models
{
    [Table("NguoiDung")]
    public class NguoiDung
    {
        [Key]
        public int MaNguoiDung { get; set; }

        [ForeignKey("VaiTro")]
        public int MaVaiTro { get; set; }

        [Required]
        [StringLength(255)]
        public string HoTen { get; set; }
        public string? DuongDanAnh { get; set; }
        [Required]
        [StringLength(100)]
        public string Email { get; set; }
        [StringLength(255)]
        public string? DiaChi { get; set; }
        public bool GioiTinh { get; set; }
        [Required]
        [StringLength(64)]
        public string MatKhau { get; set; }
        [StringLength(20)]
        public string SoDienThoai { get; set; }
        public DateTime? NgaySinh { get; set; }
        public string? MaOtp { get; set; }
        public DateTime? ThoiGianHetHanOtp { get; set; }
        public DateTime NgayTao { get; set; } = DateTime.Now;
        public DateTime NgayCapNhat { get; set; } = DateTime.Now;
        public DateTime? NgayXoa { get; set; }
        public int TrangThai { get; set; }

        public virtual VaiTro VaiTro { get; set; }
        public virtual ICollection<ChuyenKhoiHanh> ChuyenKhoiHanhs { get; set; } = new List<ChuyenKhoiHanh>();
        public virtual ICollection<DonDatTour> DonDatTours { get; set; } = new List<DonDatTour>();
        public virtual ICollection<DanhGia> DanhGias { get; set; } = new List<DanhGia>();
        public ICollection<PhienDangNhap>? PhienDangNhaps { get; set; }
        public virtual ICollection<DanhSachYeuThich> DanhSachYeuThichs { get; set; } = new List<DanhSachYeuThich>();
        public virtual ICollection<SoThichNguoiDung> SoThichNguoiDungs { get; set; } = new List<SoThichNguoiDung>();
        public virtual ICollection<SoThichDiaDiemNguoiDung> SoThichDiaDiemNguoiDungs { get; set; } = new List<SoThichDiaDiemNguoiDung>();
        public virtual ICollection<TrangThaiTuongTac> TrangThaiTuongTacs { get; set; }

    }
}
