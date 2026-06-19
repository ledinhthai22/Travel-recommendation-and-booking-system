using System.ComponentModel.DataAnnotations;

namespace travel_recommendation_and_booking_system.DTOs.ScheduleDetails
{
    public class ScheduleDetailsDTO {
        [Required(ErrorMessage = "lịch trình không được rỗng")]
        public int MaLichTrinh { get; set; }
        [Required(ErrorMessage = "Địa điểm không được rỗng")]
        public int MaDiaDiem { get; set; }

        [Required(ErrorMessage ="Giờ bắt đầu không được rỗng")]
        public DateTime GioBatDau { get; set; }
        [Required(ErrorMessage = "Giờ kết thúc không được rỗng")]
        public DateTime GioKetThuc { get; set; }
        [Required(ErrorMessage = "Hoạt động không được rỗng")]
        public string HoatDong { get; set; }
    }
}
