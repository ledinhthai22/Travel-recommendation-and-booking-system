using System.ComponentModel.DataAnnotations;

namespace travel_recommendation_and_booking_system.DTOs.Location
{
    public class LocationDTO {
        [Required(ErrorMessage = "Tên địa điểm không được để trống")]
        public string TenDiaDiem { get; set; }
        public IFormFile? DuongDanAnh { get; set; }
        public int LoaiDiaDiem { get; set; }

        [Required(ErrorMessage = "Mô tả không được để trống")]
        public string MoTa { get; set; }

        [Required(ErrorMessage = "Tỉnh/Thành không được để trống")]
        public string TinhThanh { get; set; }

        [Required(ErrorMessage = "Quốc gia không được để trống")]
        public string QuocGia { get; set; }
        public bool KhuVuc { get; set; }
        public bool TrangThai {  get; set; }
    }
}
