// Models/GiuCho.cs
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace travel_recommendation_and_booking_system.Models
{
    [Table("GiuCho")]
    public class GiuCho
    {
        [Key]
        public int MaGiuCho { get; set; }

        public int MaChuyen { get; set; }

        public int MaNguoiDung { get; set; }

        // Số chỗ đang giữ
        public int SoChoGiu { get; set; }

        // Thời điểm hết hạn giữ chỗ (mặc định 15 phút)
        public DateTime ThoiGianHetHan { get; set; }

        public DateTime NgayTao { get; set; } = DateTime.Now;

        [ForeignKey(nameof(MaChuyen))]
        public virtual ChuyenKhoiHanh ChuyenKhoiHanh { get; set; }

        [ForeignKey(nameof(MaNguoiDung))]
        public virtual NguoiDung NguoiDung { get; set; }
    }
}