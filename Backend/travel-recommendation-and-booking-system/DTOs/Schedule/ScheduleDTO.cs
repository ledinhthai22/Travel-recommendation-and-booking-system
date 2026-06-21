using System.ComponentModel.DataAnnotations;
using travel_recommendation_and_booking_system.DTOs.ScheduleDetails;

namespace travel_recommendation_and_booking_system.DTOs.Schedule
{
    public class ScheduleDTO
    {
        public int MaTour { get; set; }

        [Required(ErrorMessage = "Tên lịch trình không được để trống.")]
        public string TenLichTrinh { get; set; } = string.Empty;

        public IFormFile? DuongDanAnh { get; set; }

        [Required(ErrorMessage = "Thông tin bữa ăn không được để trống")]
        public string BuaAn { get; set; } = string.Empty;

        [Required(ErrorMessage = "Số thứ tự ngày không được để trống.")]
        [Range(1, 365, ErrorMessage = "Số thứ tự ngày phải từ 1 đến 365.")]
        public int SoThuTuNgay { get; set; }

        [Required(ErrorMessage = "Hoạt động chính không được để trống.")]
        [StringLength(500, ErrorMessage = "Hoạt động chính không được quá 500 ký tự.")]
        public string HoatDongChinh { get; set; } = string.Empty;

        [StringLength(500, ErrorMessage = "Lưu ý không được quá 500 ký tự.")]
        public string? LuuY { get; set; }

        public bool TrangThai { get; set; }

        [Required(ErrorMessage = "Danh sách chi tiết hoạt động không được để trống.")]
        public List<ScheduleDetailsDTO> ChiTietLichTrinh { get; set; } = new();
    }
}