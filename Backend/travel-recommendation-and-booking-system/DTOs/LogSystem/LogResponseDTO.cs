namespace travel_recommendation_and_booking_system.DTOs.Log
{
    public class LogResponseDTO
    {
        public int MaNhatKy { get; set; }
        public string LoaiTaiKhoan { get; set; } = string.Empty;

        public int MaTaiKhoan { get; set; }
        public string? Email { get; set; }
        public string TenHanhDong { get; set; } = string.Empty;

        public string TenBangTacDong { get; set; } = string.Empty;

        public int? MaDoiTuong { get; set; }

        public object? GiaTriTruoc { get; set; }

        public object? GiaTriSau { get; set; }

        public string? DiaChiIP { get; set; }

        public string? TrinhDuyet { get; set; }
        public DateTime ThoiGianTao { get; set; }
    }
}
