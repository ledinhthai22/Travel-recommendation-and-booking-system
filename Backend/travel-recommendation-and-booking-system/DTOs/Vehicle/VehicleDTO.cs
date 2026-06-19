using System.ComponentModel.DataAnnotations;

namespace travel_recommendation_and_booking_system.DTOs.Vehicle
{
    public class VehicleDTO
    {
        [Required(ErrorMessage = "Tên phương tiện không được rỗng")]
        public string TenPhuongTien { get; set; }
        public string Icon { get; set; } = string.Empty;
        public bool TrangThai { get; set; }
    }
}
