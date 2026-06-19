using System.ComponentModel.DataAnnotations;

namespace travel_recommendation_and_booking_system.DTOs.Departure
{
    public class DepartureDTO
    {
        [Required(ErrorMessage = "Vui lòng chọn Hướng dẫn viên.")]
        public int MaHDV { get; set; }

        [Required(ErrorMessage = "Vui lòng chọn Tour.")]
        public int MaTour { get; set; }

        [Required(ErrorMessage = "Vui lòng chọn Phương tiện.")]
        public int MaPhuongTien { get; set; }

        [Required(ErrorMessage = "Mã chuyến không được để trống.")]
        public string MaChuyenCode { get; set; }

        [Required(ErrorMessage = "Tên chuyến không được để trống.")]
        public string TenChuyen { get; set; }
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

        [Range(1, 9999, ErrorMessage = "Số lượng chỗ phải lớn hơn 0.")]
        public int SoLuongCho { get; set; }

        public string GhiChu { get; set; }
    }
}
