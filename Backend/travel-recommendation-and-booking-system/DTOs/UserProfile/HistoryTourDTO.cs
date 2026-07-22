namespace travel_recommendation_and_booking_system.DTOs.UserProfile
{
    public class HistoryTourDTO
    {
        public int MaDonDatTour { get; set; }
        public string MaDatCho { get; set; } = string.Empty;
        public string DuongDanAnh { get; set; } = string.Empty;
        public string TenTour { get; set; } = string.Empty;
        public string NgayBatDau { get; set; } = string.Empty;
        public string NgayKetThuc { get; set; } = string.Empty;
        public string DiemDen { get; set; } = string.Empty;
        public int TrangThai { get; set; }
        public string TenTrangThai { get; set; } = string.Empty;
        public decimal TongTien { get; set; }
        public bool DaDanhGia { get; set; }
        // Trạng thái tài chính (thay thế TrangThaiCoc)
        public int TrangThaiTaiChinh { get; set; }
        public string TenTrangThaiTaiChinh { get; set; } = string.Empty;

        public int TrangThaiThanhToan { get; set; }
        public string TenTrangThaiThanhToan { get; set; } = string.Empty;
        public int SoNguoiLon { get; set; }
        public int SoTreEm { get; set; }
        public int SoEmBe { get; set; }
        public string PhuongThucThanhToan { get; set; } = string.Empty;
        public string? LyDoHuy { get; set; }
        public DateTime? NgayHuy { get; set; }
        public int MaTour { get; set; }

        // Flags hỗ trợ
        public bool IsChuaThanhToan => TrangThaiTaiChinh == 0;
        public bool IsDaDatCoc => TrangThaiTaiChinh == 1;
        public bool IsDaThanhToanDu => TrangThaiTaiChinh == 2;
        public bool IsDangHoanTien => TrangThaiTaiChinh == 3;
        public bool IsDaHoanTien => TrangThaiTaiChinh == 4;
        public bool IsMatCoc => TrangThaiTaiChinh == 5;
        public bool IsDaHuy => TrangThai == 6;
        public bool IsHoanTat => TrangThai == 5;
        public bool IsDangHoatDong => TrangThai >= 1 && TrangThai <= 4;
    }
}