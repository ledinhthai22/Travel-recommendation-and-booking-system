using System.ComponentModel.DataAnnotations;

namespace travel_recommendation_and_booking_system.DTOs.Departure
{
    public class DepartureDTO
    {
        public int MaChuyen { get; set; }
        [Required(ErrorMessage = "Vui lòng chọn Hướng dẫn viên.")]
        public int? MaHDV { get; set; }

        [Required(ErrorMessage = "Vui lòng chọn Tour.")]
        public int MaTour { get; set; }

        [Required(ErrorMessage = "Vui lòng chọn Phương tiện.")]
        public int MaPhuongTien { get; set; }
        public string ? TenPhuongTien { get; set; }
        public string? Icon { get; set; }
        public string? MaChuyenCode { get; set; }

        [Required(ErrorMessage = "Điểm khời hành không được để trống.")]
        public string DiemKhoiHanh { get; set; }
        [Required(ErrorMessage = "Điểm đến không được để trống.")]
        public string DiemDen { get; set; }

        [Required(ErrorMessage = "Ngày khởi hành là bắt buộc.")]
        public DateTime NgayKhoiHanh { get; set; }

        [Required(ErrorMessage = "Giờ xuất phát là bắt buộc.")]
        public DateTime GioDenNoiDi { get; set; }

        [Required(ErrorMessage = "Ngày kết thúc là bắt buộc.")]
        public DateTime NgayKetThuc { get; set; }

        [Required(ErrorMessage = "Giờ về là bắt buộc.")]
        public DateTime GioDenNoiVe { get; set; }
        public int? TrangThai { get; set; }

        [Range(1, 9999, ErrorMessage = "Số lượng chỗ phải lớn hơn 0.")]
        public int SoChoToiDa { get; set; }

        public int? SoChoDaDat { get; set; }

        public string GhiChu { get; set; }
    }
}
