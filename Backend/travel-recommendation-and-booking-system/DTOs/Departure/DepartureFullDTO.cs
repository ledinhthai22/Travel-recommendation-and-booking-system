using System.ComponentModel.DataAnnotations;

namespace travel_recommendation_and_booking_system.DTOs.Departure
{
    public class DepartureFullDTO
    {
        [Required(ErrorMessage = "Thông tin chuyến khởi hành không được để trống.")]
        public DepartureDTO ChuyenKhoiHanh { get; set; }

        [Required(ErrorMessage = "Danh sách giá không được để trống.")]
        [MinLength(1, ErrorMessage = "Mỗi chuyến khởi hành phải có ít nhất 1 thiết lập giá ")]
        public List<GiaChuyenDTO> DanhSachGia { get; set; }
    }

    public class GiaChuyenDTO
    {
        [Required(ErrorMessage = "Hạng khách sạn không được để trống.")]
        [Range(1, 5, ErrorMessage = "Hạng khách sạn chỉ được nhập từ 1 đến 5.")]
        public int HangKhachSan { get; set; }

        [Required(ErrorMessage = "Giá người lớn không được để trống.")]
        [Range(1, double.MaxValue, ErrorMessage = "Giá người lớn phải lớn hơn 0.")]
        public decimal GiaNguoiLon { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Giá trẻ em không hợp lệ.")]
        public decimal GiaTreEm { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Giá em bé không hợp lệ.")]
        public decimal GiaEmBe { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Phụ thu phòng đơn không hợp lệ.")]
        public decimal PhuThuPhongDon { get; set; }
    }

}
