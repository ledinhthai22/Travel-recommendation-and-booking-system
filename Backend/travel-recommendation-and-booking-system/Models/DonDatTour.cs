using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace WebDuLich.Models
{
    [Table("DonDatTour")]
    public class DonDatTour
    {
        [Key]
        public int MaDonDatTour { get; set; }

        [ForeignKey("NguoiDung")]
        public int MaNguoiDung { get; set; }

        [ForeignKey("ChuyenKhoiHanh")]
        public int MaChuyen { get; set; }
        [StringLength(255)]
        public string MaDatCho { get; set; }

        [ForeignKey("KhachSan")]
        public int? MaKhachSan { get; set; }

        [ForeignKey("UuDai")]
        public int? MaUuDai { get; set; }

        public int SoNguoiLon { get; set; }
        public int SoTreEm { get; set; }
        public int SoEmBe { get; set; }
        public DateTime NgayDat { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal TongTien { get; set; }
        public bool TrangThaiThanhToan { get; set; }
        [StringLength(50)]
        public string TrangThaiDon { get; set; }
        public DateTime NgayCapNhat { get; set; } = DateTime.Now;

        public virtual NguoiDung NguoiDung { get; set; }
        public virtual ChuyenKhoiHanh ChuyenKhoiHanh { get; set; }
        public virtual KhachSan KhachSan { get; set; }
        public virtual UuDai UuDai { get; set; }
        public virtual ICollection<KhachHang> KhachHangs { get; set; } = new List<KhachHang>();
        public virtual ICollection<ThanhToan> ThanhToans { get; set; } = new List<ThanhToan>();
    }
}
