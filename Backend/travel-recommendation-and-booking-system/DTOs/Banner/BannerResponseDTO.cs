using System.ComponentModel.DataAnnotations;

namespace travel_recommendation_and_booking_system.DTOs.Banner
{
    public class BannerResponseDTO
    {
        public int MaBanner { get; set; }
        public string TieuDe { get; set; }
        public string DuongDanAnh { get; set; }
        public string LinkLienKet { get; set; }
        public bool TrangThai { get; set; }
        public DateTime NgayTao { get; set; }
        public DateTime NgayCapNhat { get; set; }
        public DateTime? NgayXoa { get; set; }
    }
}
