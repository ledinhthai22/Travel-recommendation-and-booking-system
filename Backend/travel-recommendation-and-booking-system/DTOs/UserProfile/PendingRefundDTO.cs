// DTOs/UserProfile/PendingRefundDTO.cs
namespace travel_recommendation_and_booking_system.DTOs.UserProfile
{
    public class PendingRefundDTO
    {
        public int MaThanhToan { get; set; }
        public int MaDonDatTour { get; set; }
        public string MaDatCho { get; set; } = string.Empty;
        public string TenTour { get; set; } = string.Empty;
        public string HoTenKhachHang { get; set; } = string.Empty;
        public string SoDienThoai { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public decimal TongTienThanhToan { get; set; }
        public decimal? SoTienHoan { get; set; }
        public string? LyDoHuy { get; set; }
        public DateTime NgayThanhToan { get; set; }
        public DateTime NgayKhoiHanh { get; set; }
        public decimal TongTien { get; set; }

        // Trạng thái tài chính
        public int TrangThaiTaiChinh { get; set; }
        public string TenTrangThaiTaiChinh { get; set; } = string.Empty;

        // Phương thức thanh toán
        public string PhuongThucThanhToan { get; set; } = string.Empty;

        // Trạng thái đơn
        public int TrangThaiDon { get; set; }
        public string TenTrangThaiDon { get; set; } = string.Empty;

        // Flag hỗ trợ
        public bool IsDangHoanTien => TrangThaiTaiChinh == 3;
        public bool IsDaHoanTien => TrangThaiTaiChinh == 4;
        public bool IsMatCoc => TrangThaiTaiChinh == 5;
        public bool IsChuaThanhToan => TrangThaiTaiChinh == 0;
        public bool IsDaDatCoc => TrangThaiTaiChinh == 1;
        public bool IsDaThanhToanDu => TrangThaiTaiChinh == 2;
        public bool IsDaHuy => TrangThaiDon == 6;
        public bool IsHoanTat => TrangThaiDon == 5;
    }
}