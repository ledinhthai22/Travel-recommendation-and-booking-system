using Microsoft.AspNetCore.Mvc;
using travel_recommendation_and_booking_system.DTOs.Departure;
using travel_recommendation_and_booking_system.DTOs.Schedule;

namespace travel_recommendation_and_booking_system.DTOs.Tour
{
    public class TourFullCreateDTO
    {
        [FromForm]
        public TourDTO TourInfo { get; set; }
        [FromForm]
        public List<int> DanhSachKhachSan { get; set; }
        [FromForm]
        public List<ScheduleDTO> LichTrinh { get; set; }
        [FromForm]
        public List<DepartureFullDTO> ChuyenKhoiHanhs { get; set; }
    }
}
