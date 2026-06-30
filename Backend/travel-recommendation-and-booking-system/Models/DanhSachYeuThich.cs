using System.ComponentModel.DataAnnotations.Schema;

namespace travel_recommendation_and_booking_system.Models
{
    [Table("DanhSachYeuThich")]
    public class DanhSachYeuThich
    {
        public int MaNguoiDung { get; set; }
        public int MaTour { get; set; }
        public virtual NguoiDung NguoiDung { get; set; }
        public virtual Tour Tour { get; set; }
    }
}
