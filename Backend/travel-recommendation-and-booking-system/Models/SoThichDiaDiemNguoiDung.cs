using System.ComponentModel.DataAnnotations;

namespace travel_recommendation_and_booking_system.Models
{
    public class SoThichDiaDiemNguoiDung
    {
        [Key]
        public int MaNguoiDung { get; set; }
        public int MaDiaDiem { get; set; }
        public float DiemYeuThich { get; set; }
        public DateTime NgayCapNhat { get; set; } = DateTime.Now;
        public virtual NguoiDung NguoiDung { get; set; }
        public virtual DiaDiem DiaDiem { get; set; }
    }
}
