using System.ComponentModel.DataAnnotations;
using travel_recommendation_and_booking_system.DTOs.ImageHotel;

namespace travel_recommendation_and_booking_system.DTOs.Hotel
{
    public class HotelDTO
    {
        public int MaKhachSan { get; set; }
        [StringLength(255)]
        public string? TenKhachSan { get; set; }
        public int? SoSao { get; set; }
        [StringLength(255)]
        public string? DiaChi { get; set; }
        [StringLength(20)]
        [RegularExpression(@"^(0[0-9]{9})$",
            ErrorMessage = "Số điện thoại không hợp lệ")]
        public string? SoDienThoai { get; set; }
        public string? MoTa { get; set; }
        public bool? TrangThai { get; set; }
        public DateTime NgayTao { get; set; } = DateTime.Now;
        public List<ImageHotelDTO>? HinhAnh { get; set; }
    }
}
