using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace travel_recommendation_and_booking_system.Models
{
    [Table("DonDatTour")]
    public class DonDatTour
    {
        [Key]
        public int MaDonDatTour { get; set; }

        public int MaNguoiDung { get; set; }

        public int MaChuyen { get; set; }

        public string MaDatCho { get; set; }

        public int? MaKhachSan { get; set; }

        public int? MaUuDai { get; set; }

        public int SoNguoiLon { get; set; }

        public int SoTreEm { get; set; }

        public int SoEmBe { get; set; }

        public DateTime NgayDat { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal GiaNguoiLonTaiDat { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal GiaTreEmTaiDat { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal GiaEmBeTaiDat { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal PhuThuPhongDonTaiDat { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal GiaTriGiamTaiDat { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal TongTien { get; set; }

        public bool TrangThaiThanhToan { get; set; }

        public int TrangThaiDon { get; set; }

        public int? MaNhanVienDuyet { get; set; }

        public DateTime? NgayDuyet { get; set; }

        public DateTime NgayCapNhat { get; set; }
        public virtual NhanVien NhanVien { get; set; }
        public virtual NguoiDung NguoiDung { get; set; }
        public virtual ChuyenKhoiHanh ChuyenKhoiHanh { get; set; }
        public virtual KhachSan KhachSan { get; set; }
        public virtual UuDai UuDai { get; set; }
        public virtual ICollection<KhachHang> KhachHangs { get; set; } = new List<KhachHang>();
        public virtual ICollection<ThanhToan> ThanhToans { get; set; } = new List<ThanhToan>();
    }
}
