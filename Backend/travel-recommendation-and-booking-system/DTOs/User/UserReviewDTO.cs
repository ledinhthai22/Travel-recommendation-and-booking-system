using System.ComponentModel.DataAnnotations;

namespace travel_recommendation_and_booking_system.DTOs.UserProfile
{
    public class UserReviewDTO
    {
        public int MaDanhGia { get; set; }
        public string MaDatCho { get; set; } = "";
        public string TenTour { get; set; } = "";
        public string DuongDanAnh { get; set; } = "";
        public string DiaDiem { get; set; } = "";
        public int DiemDanhGia { get; set; }
        public string NoiDung { get; set; } = "";
        public string NgayDanhGia { get; set; } = "";
        public string? TrangThai { get; set; }
    }
}