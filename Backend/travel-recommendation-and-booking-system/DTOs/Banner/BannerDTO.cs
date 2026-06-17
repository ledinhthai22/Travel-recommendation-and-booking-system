using System.ComponentModel.DataAnnotations;

namespace travel_recommendation_and_booking_system.DTOs.Banner
{
    public class BannerDTO
    {
        [Required(ErrorMessage ="Vui lòng nhập tên tiêu đề")]
        public string TieuDe {  get; set; }
        public IFormFile? DuongDanAnh { get; set; }

        [Required(ErrorMessage = "Vui lòng cung cấp link liên kết Banner.")]
        public string? LinkLienKet { get; set; }
        public bool TrangThai { get; set; }

    }
}
