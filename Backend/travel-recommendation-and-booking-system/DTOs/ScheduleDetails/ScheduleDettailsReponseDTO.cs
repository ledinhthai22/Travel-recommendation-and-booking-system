using System.ComponentModel.DataAnnotations.Schema;

namespace travel_recommendation_and_booking_system.DTOs.ScheduleDetails
{
    public class ScheduleDettailsReponseDTO
    {
        public int MaCTLT { get; set; }
        public int MaLichTrinh { get; set; }
        public int MaDiaDiem { get; set; }
        public string TenDiaDiem { get; set; }
        public DateTime GioBatDau { get; set; }
        public DateTime GioKetThuc { get; set; }
        public string HoatDong { get; set; }
    }
}
