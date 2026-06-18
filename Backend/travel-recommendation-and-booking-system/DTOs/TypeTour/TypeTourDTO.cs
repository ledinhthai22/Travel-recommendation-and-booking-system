using System.ComponentModel.DataAnnotations;

namespace travel_recommendation_and_booking_system.DTOs.TypeTour
{
    public class TypeTourDTO
    {
        [Required(ErrorMessage ="loại hình tour được trống")]
        public string TenLoaiTour { get; set; }
        public bool TrangThai { get; set; }
    }
}
