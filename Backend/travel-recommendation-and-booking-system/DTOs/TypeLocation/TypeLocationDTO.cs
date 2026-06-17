using System.ComponentModel.DataAnnotations;

namespace travel_recommendation_and_booking_system.DTOs.TypeLocation
{
    public class TypeLocationDTO {
        [Required(ErrorMessage = "loại địa điểm không được để trống")]
        public string TenLoaiDD { get; set; }
    }
}
