using System.ComponentModel.DataAnnotations;

namespace travel_recommendation_and_booking_system.DTOs.UserProfile
{
    public class UserReviewDTO
    {
        public int MaDanhGia { get; set; }
        public string TenTour { get; set; }
        public string DuongDanAnh { get; set; }
        public string DiaDiem { get; set; }
        public int DiemDanhGia { get; set; }
        public string NoiDung { get; set; }
        public string NgayDanhGia { get; set; }
        public bool TrangThai { get; set; }
        public bool IsProcessed { get; set; }
        public string GhiChuKiemDuyet { get; set; }
        public string MaDatCho { get; set; }
    }
}