using System.ComponentModel.DataAnnotations;

namespace travel_recommendation_and_booking_system.DTOs.Vehicle
{
    public class VehicleReponseDTO
    {
        public int MaPhuongTien { get; set; }
        public string TenPhuongTien { get; set; }
        public string Icon { get; set; }
        public bool TrangThai { get; set; }
        public DateTime NgayTao { get; set; }
        public DateTime NgayCapNhat { get; set; }
        public DateTime? NgayXoa { get; set; }
    }
}
