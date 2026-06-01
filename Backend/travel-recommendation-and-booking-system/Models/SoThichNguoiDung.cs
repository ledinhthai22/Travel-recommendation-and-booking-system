using System.ComponentModel.DataAnnotations.Schema;

namespace WebDuLich.Models
{
    [Table("SoThichNguoiDung")]
    public class SoThichNguoiDung
    {
        public int MaNguoiDung { get; set; }
        public int MaLoaiTour { get; set; }
        public float DiemYeuThich { get; set; }

        public virtual NguoiDung NguoiDung { get; set; }
        public virtual CLoaiHinhTour LoaiHinhTour { get; set; }
    }
}
