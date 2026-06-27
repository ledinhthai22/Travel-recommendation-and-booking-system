using travel_recommendation_and_booking_system.DTOs.Departure;
using travel_recommendation_and_booking_system.DTOs.ImageTour;
using travel_recommendation_and_booking_system.DTOs.Schedule;

namespace travel_recommendation_and_booking_system.DTOs.Tour
{
    public class TourReponseDTO
    {
        public TourDTO TourInfo { get; set; }

        public List<ScheduleReponseDTO> LichTrinh { get; set; }
        public List<DepartureFullDTO> ChuyenKhoiHanhs { get; set; }
        public List<ImageTourResponseDTO> Images { get; set; }
        public List<HotelInfoDTO> KhachSans { get; set; }
    }
}
