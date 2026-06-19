using System.ComponentModel.DataAnnotations;

namespace travel_recommendation_and_booking_system.DTOs.Departure
{
    public class DepartureFullDTO
    {
        public DepartureDTO ChuyenKhoiHanh { get; set; }
        public List<GiaChuyenDTO> DanhSachGia { get; set; }
    }

    public class GiaChuyenDTO
    {
        [Required(ErrorMessage = "Vui lòng chọn hạng khách sạn.")]
        [Range(1, 5, ErrorMessage = "Hạng khách sạn phải từ 1 đến 5 sao.")]
        public int HangKhachSan { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập giá người lớn.")]
        [Range(0, double.MaxValue, ErrorMessage = "Giá người lớn không được âm.")]
        public decimal GiaNguoiLon { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập giá trẻ em.")]
        [Range(0, double.MaxValue, ErrorMessage = "Giá trẻ em không được âm.")]
        public decimal GiaTreEm { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập giá em bé.")]
        [Range(0, double.MaxValue, ErrorMessage = "Giá em bé không được âm.")]
        public decimal GiaEmBe { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập phụ thu phòng đơn.")]
        [Range(0, double.MaxValue, ErrorMessage = "Phụ thu phòng đơn không được âm.")]
        public decimal PhuThuPhongDon { get; set; }
    }

}
