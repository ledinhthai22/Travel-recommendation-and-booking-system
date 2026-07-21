// DTOs/TourBooking/UserBookingListDTO.cs
namespace travel_recommendation_and_booking_system.DTOs.TourBooking
{
    public class UserBookingListDTO
    {
        public int MaDonDatTour { get; set; }
        public string MaDatCho { get; set; } = string.Empty;
        public string TenTour { get; set; } = string.Empty;
        public string? HinhAnh { get; set; }
        public DateTime NgayKhoiHanh { get; set; }
        public DateTime NgayKetThuc { get; set; }
        public string DiemKhoiHanh { get; set; } = string.Empty;
        public string DiemDen { get; set; } = string.Empty;

        // Thông tin khách
        public int SoNguoiLon { get; set; }
        public int SoTreEm { get; set; }
        public int SoEmBe { get; set; }
        public int TongKhach => SoNguoiLon + SoTreEm + SoEmBe;

        // Thông tin tài chính
        public decimal TongTien { get; set; }
        public decimal SoTienDaThanhToan { get; set; }
        public decimal SoTienConLai => TongTien - SoTienDaThanhToan;

        // Trạng thái cọc
        public int TrangThaiCoc { get; set; }
        public string? TenTrangThaiCoc { get; set; }

        // Trạng thái thanh toán
        public int TrangThaiThanhToan { get; set; }
        public string? TenTrangThaiThanhToan { get; set; }

        // Trạng thái đơn
        public int TrangThaiDon { get; set; }
        public string? TenTrangThaiDon { get; set; }

        // Thời gian
        public DateTime NgayDat { get; set; }
        public DateTime? NgayHuy { get; set; }
        public string? LyDoHuy { get; set; }

        // Đánh giá
        public bool DaDanhGia { get; set; }

        // Trạng thái hủy
        public bool CoTheHuy => TrangThaiDon >= 1 && TrangThaiDon <= 3 && NgayKhoiHanh > DateTime.Now.AddDays(3);
        public bool ChoXuLyHuy => TrangThaiDon == 6;
        public bool DaHuy => TrangThaiDon >= 7;
        public bool DangHoanTien => TrangThaiDon == 7;
        public bool DaHoanTien => TrangThaiDon == 8;
        public bool MatCoc => TrangThaiDon == 9;
        public bool KhongHoanTien => TrangThaiDon == 10;

        // Trạng thái đơn hàng
        public bool IsActive => TrangThaiDon >= 1 && TrangThaiDon <= 5;
        public bool IsCompleted => TrangThaiDon == 5;
        public bool IsPending => TrangThaiDon == 1 || TrangThaiDon == 2;
        public bool IsConfirmed => TrangThaiDon == 3 || TrangThaiDon == 4;

        // Thông tin bổ sung
        public int SoPhongDon { get; set; }
        public decimal TienCoc { get; set; }
    }
}