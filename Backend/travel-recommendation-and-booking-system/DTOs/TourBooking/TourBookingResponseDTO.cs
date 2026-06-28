public class TourBookingResponseDTO
{
    public int MaDonDatTour { get; set; }
    public string MaDatCho { get; set; }
    public string TenKhachHang { get; set; }
    public string MaCodeChuyen { get; set; }
    public string? DiemKhoiHanh { get; set; }
    public string? DiemDen { get; set; }
    public DateTime NgayKhoiHanh { get; set; }
    public decimal TongTien { get; set; }
    public int TrangThaiThanhToan { get; set; }
    public int TrangThaiDon { get; set; }
    public DateTime? NgayDuyet { get; set; }
    public string? NhanVienDuyet { get; set; }

    // Thông tin thanh toán gần nhất thành công
    public string? PhuongThucThanhToan { get; set; }
    public string? MaGiaoDich { get; set; }
    public DateTime? NgayThanhToan { get; set; }
}