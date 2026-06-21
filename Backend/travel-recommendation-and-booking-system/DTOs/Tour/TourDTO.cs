using System.ComponentModel.DataAnnotations;

namespace travel_recommendation_and_booking_system.DTOs.Tour
{
    public class TourDTO
    {
        public int MaTour { get; set; }
        [Required(ErrorMessage = "Tên tour không được để trống.")]
        public string TenTour { get; set; }

        [Required(ErrorMessage = "Vui lòng chọn loại tour.")]
        [Range(1, int.MaxValue, ErrorMessage = "Mã loại tour không hợp lệ.")]
        public int MaLoaiTour { get; set; }

        [Required(ErrorMessage = "Mô tả tour không được để trống.")]
        public string MoTa { get; set; }

        [Required(ErrorMessage = "Thời gian tour không được để trống")]
        public string ThoiGianTour { get; set; }
        public bool TrongNuoc { get; set; }
        [Required(ErrorMessage = "Điểm khởi hành không được để trống.")]
        public string? DiemKhoiHanh { get; set; }
        public bool TrangThai { get; set; }
    }
}
