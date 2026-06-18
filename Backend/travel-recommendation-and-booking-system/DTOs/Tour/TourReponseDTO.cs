using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using travel_recommendation_and_booking_system.DTOs.ImageHotel;
using travel_recommendation_and_booking_system.DTOs.ImageTour;

namespace travel_recommendation_and_booking_system.DTOs.Tour
{
    public class TourReponseDTO {
        public int MaTour { get; set; }

        public int MaLoaiTour { get; set; }
        public string TenTour { get; set; }
        public string MoTa { get; set; }
        public string ThoiGianTour { get; set; }
        public int SoLuongToiDa { get; set; }
        public int LuotDat { get; set; }
        public int LuotXem { get; set; }
        public string DiemKhoiHanh { get; set; }
        public bool TrangThai { get; set; }
        public DateTime NgayTao { get; set; }
        public DateTime NgayCapNhat { get; set; }
        public DateTime? NgayXoa { get; set; }
        public List<ImageTourDTO> HinhAnh { get; set; }
    }
}
