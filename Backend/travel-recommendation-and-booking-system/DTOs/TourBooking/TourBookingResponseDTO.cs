namespace travel_recommendation_and_booking_system.DTOs.TourBooking
{
    public class TourBookingResponseDTO
    {
        public int MaDonDatTour { get; set; }
        public string MaDatCho { get; set; } = string.Empty;
        public string TenKhachHang { get; set; } = string.Empty;
        public string TenNguoiDung { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string SoDienThoai { get; set; } = string.Empty;

        // Thông tin chuyến
        public string MaCodeChuyen { get; set; } = string.Empty;
        public int MaChuyen { get; set; }
        public string DiemKhoiHanh { get; set; } = string.Empty;
        public string DiemDen { get; set; } = string.Empty;
        public DateTime NgayKhoiHanh { get; set; }

        // Thông tin tài chính
        public decimal TongTien { get; set; }
        public decimal TienCoc { get; set; }
        public decimal SoTienDaThanhToan { get; set; }
        public decimal SoTienConLai { get; set; }

        // Trạng thái tài chính
        public int TrangThaiTaiChinh { get; set; }
        public string? TenTrangThaiTaiChinh { get; set; }

        // Trạng thái đơn
        public int TrangThaiDon { get; set; }
        public string? TenTrangThaiDon { get; set; }

        // Trạng thái thanh toán
        public int TrangThaiThanhToan { get; set; }
        public string? TenTrangThaiThanhToan { get; set; }

        // Loại thanh toán
        public int? LoaiThanhToan { get; set; }
        public string? TenLoaiThanhToan { get; set; }

        // Phương thức thanh toán
        public string? PhuongThucThanhToan { get; set; }
        public string? MaGiaoDich { get; set; }
        public DateTime? NgayThanhToan { get; set; }

        // Thông tin xử lý
        public DateTime? NgayDuyet { get; set; }
        public string? NhanVienDuyet { get; set; }

        // Thông tin hủy
        public DateTime? NgayHuy { get; set; }
        public string? LyDoHuy { get; set; }

        // Cảnh báo công nợ
        public bool CoCanhBaoCongNo { get; set; }
        public DateTime? NgayGanCoCanhBao { get; set; }
        public DateTime? NgayDat { get; set; }

        // Flag hỗ trợ
        public bool IsCancelled => TrangThaiDon == 6;
        public bool IsActive => TrangThaiDon >= 1 && TrangThaiDon <= 4;
        public bool IsPending => TrangThaiDon == 1 || TrangThaiDon == 2;
        public bool IsConfirmed => TrangThaiDon == 3 || TrangThaiDon == 4;
        public bool IsCompleted => TrangThaiDon == 5;

        // Flag trạng thái tài chính
        public bool IsChuaThanhToan => TrangThaiTaiChinh == 0;
        public bool IsDaDatCoc => TrangThaiTaiChinh == 1;
        public bool IsDaThanhToanDu => TrangThaiTaiChinh == 2;
        public bool IsDangHoanTien => TrangThaiTaiChinh == 3;
        public bool IsDaHoanTien => TrangThaiTaiChinh == 4;
        public bool IsMatCoc => TrangThaiTaiChinh == 5;
    }
}