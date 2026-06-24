using travel_recommendation_and_booking_system.DTOs.TypeTour;

namespace travel_recommendation_and_booking_system.DTOs.Tour
{
    public class TourByLocationResponseDTO
    {
        public string TenDiaDiem { get; set; } = string.Empty;

        public string Slug { get; set; } = string.Empty;


        public List<TourCardResponseDTO> Tours { get; set; } = [];
    }
}
