namespace travel_recommendation_and_booking_system.DTOs.ScheduleDetails
{
    public class ScheduleDetailsReponseDTO
    {
        public int MaCTLT { get; set; }
        public int MaLichTrinh { get; set; }
        public int ?MaDiaDiem { get; set; }
        public string TenDiaDiem { get; set; }
        public string GioBatDau { get; set; }
        public string GioKetThuc { get; set; }
        public string ? LoaiHoatDong { get; set; }
        public string HoatDong { get; set; }
    }
}
