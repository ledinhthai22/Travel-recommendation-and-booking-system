using System.ComponentModel.DataAnnotations;

namespace travel_recommendation_and_booking_system.DTOs.Location
{
    public class LocationReponseDTO
    {
        public int MaDiaDiem {  get; set; }
        public string TenDiaDiem { get; set; }
        public string DuongDanAnh { get; set; }
        public int LoaiDiaDiem { get; set; }
        public string MoTa { get; set; }
        public string TinhThanh { get; set; }
        public string QuocGia { get; set; }
        public bool KhuVuc { get; set; }
        public bool TrangThai { get; set; }
        public DateTime NgayTao { get; set; }
        public DateTime NgayCapNhat { get; set; }
        public DateTime? NgayXoa { get; set; }
    }
}
