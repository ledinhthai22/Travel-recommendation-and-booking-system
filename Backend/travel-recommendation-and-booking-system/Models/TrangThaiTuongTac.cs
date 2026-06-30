using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace travel_recommendation_and_booking_system.Models
{
    [Table("TrangThaiTuongTac")]
    public class TrangThaiTuongTac
    {
        [Key]
        public int MaTuongTac { get; set; }
        public int MaNguoiDung { get; set; }
        public int MaTour { get; set; }

        public bool DaXemChiTiet { get; set; } = false;
        public bool DaQuanTamLau { get; set; } = false;

        [ForeignKey("MaNguoiDung")]
        public virtual NguoiDung NguoiDung { get; set; }
        [ForeignKey("MaTour")]
        public virtual Tour Tour { get; set; }
    }
}
