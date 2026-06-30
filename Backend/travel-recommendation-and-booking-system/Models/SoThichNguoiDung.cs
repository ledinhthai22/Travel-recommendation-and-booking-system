using System.ComponentModel.DataAnnotations.Schema;

namespace travel_recommendation_and_booking_system.Models
{
    [Table("SoThichNguoiDung")]
    public class SoThichNguoiDung
    {
        public int MaNguoiDung { get; set; }
        public int MaLoaiTour { get; set; }
        public float DiemYeuThich { get; set; }
        public DateTime NgayCapNhat { get; set; } = DateTime.Now;

        public virtual NguoiDung NguoiDung { get; set; }
        public virtual CLoaiHinhTour LoaiHinhTour { get; set; }
    }
}
