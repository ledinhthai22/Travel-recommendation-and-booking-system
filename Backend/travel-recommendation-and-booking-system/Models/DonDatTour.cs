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

        [Required]
        [MaxLength(50)]
        public string MaDatCho { get; set; }

        public int? MaUuDai { get; set; }
        public int? MaNhanVienDuyet { get; set; }

        public int SoNguoiLon { get; set; }
        public int SoTreEm { get; set; }
        public int SoEmBe { get; set; }
        public int SoPhongDon { get; set; }

        [MaxLength(1000)]
        public string GhiChu { get; set; } = "";

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

        public int TrangThaiDon { get; set; }
        // 1 = Chờ duyệt
        // 2 = Đã duyệt
        // 3 = Hoàn tất
        // 4 = Đã hủy

        public DateTime NgayDat { get; set; }
        public DateTime? NgayDuyet { get; set; }
        public DateTime NgayCapNhat { get; set; }

        [Timestamp]
        public byte[] RowVersion { get; set; }

        // Navigation properties
        [ForeignKey(nameof(MaNguoiDung))]
        public virtual NguoiDung? NguoiDung { get; set; }

        [ForeignKey(nameof(MaChuyen))]
        public virtual ChuyenKhoiHanh? ChuyenKhoiHanh { get; set; }

        [ForeignKey(nameof(MaNhanVienDuyet))]
        public virtual NhanVien? NhanVien { get; set; }


        [ForeignKey(nameof(MaUuDai))]
        public virtual UuDai? UuDai { get; set; }

        public virtual ICollection<KhachHang> KhachHangs { get; set; } = new List<KhachHang>();
        public virtual ICollection<ThanhToan> ThanhToans { get; set; } = new List<ThanhToan>();

        // Computed helper — không map xuống DB, dùng trong code C# và DTO
        [NotMapped]
        public ThanhToan? ThanhToanMoiNhat =>
            ThanhToans.OrderByDescending(t => t.NgayThanhToan).FirstOrDefault();
    }
}