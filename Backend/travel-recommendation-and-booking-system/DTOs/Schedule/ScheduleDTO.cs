using System.ComponentModel.DataAnnotations;

namespace travel_recommendation_and_booking_system.DTOs.Schedule
{
    public class ScheduleDTO {
        [Required(ErrorMessage = "Mã tour không được để trống.")]
        public int MaTour { get; set; }

        [Required(ErrorMessage = "Tên lịch trình không được để trống.")]
        public string TenLichTrinh { get; set; }
        public IFormFile? DuongDanAnh { get; set; }
        [Required(ErrorMessage = "Bữa ăn không được để trống.")]
        public string BuaAn { get; set; }

        [Required(ErrorMessage = "Số thứ tự ngày không được để trống.")]
        [Range(1, 365, ErrorMessage = "Số thứ tự ngày phải từ 1 đến 365.")]
        public int SoThuTuNgay { get; set; }

        [Required(ErrorMessage = "Hoạt động chính không được để trống.")]
        public string HoatDongChinh { get; set; }

        public string LuuY { get; set; }

        public bool TrangThai { get; set; }
    }
}
