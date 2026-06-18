using System.ComponentModel.DataAnnotations;

namespace travel_recommendation_and_booking_system.DTOs.Tour
{
    public class TourDTO
    {
        [Required(ErrorMessage = "Tên tour không được để trống.")]
        public string TenTour { get; set; }

        [Required(ErrorMessage = "Vui lòng chọn loại tour.")]
        public int MaLoaiTour { get; set; }

        [Required(ErrorMessage = "Mô tả không được để trống.")]
        public string MoTa { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập thời gian tour.")]
        public string ThoiGianTour { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập số lượng khách tối đa.")]
        [Range(1, 1000, ErrorMessage = "Số lượng khách phải từ 1 đến 1000.")]
        public int SoLuongToiDa { get; set; }

        [Required(ErrorMessage = "Điểm khởi hành không được để trống.")]
        public string DiemKhoiHanh { get; set; }
        public bool TrangThai { get; set; }
    }
}
