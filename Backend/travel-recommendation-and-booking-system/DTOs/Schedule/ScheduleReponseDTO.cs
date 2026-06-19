using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using travel_recommendation_and_booking_system.DTOs.ScheduleDetails;

namespace travel_recommendation_and_booking_system.DTOs.Schedule
{
    public class ScheduleReponseDTO {
        public int MaLichTrinh { get; set; }
        public int MaTour { get; set; }
        public string TenLichTrinh { get; set; }
        public string DuongDanAnh { get; set; }
        public string BuaAn { get; set; }
        public int SoThuTuNgay { get; set; }
        public string HoatDongChinh { get; set; }
        public string LuuY { get; set; }
        public bool TrangThai { get; set; }
        public DateTime NgayTao { get; set; }
        public DateTime NgayCapNhat { get; set; }
        public DateTime? NgayXoa { get; set; }
        public List<ScheduleDetailsDTO> ChiTietLichTrinhs { get; set; }
    }
}
