namespace travel_recommendation_and_booking_system.DTOs.TourBooking
{
    public class TourBookingDetailDTO
    {
        public int MaDonDatTour { get; set; }
        public string MaDatCho { get; set; }

        public string TenNguoiDat { get; set; }
        public string SoDienThoai { get; set; }
        public string Email { get; set; }

        public TourInfoDTO Tour { get; set; }
        public ChuyenInfoDTO Chuyen { get; set; }

        public string? TenKhachSan { get; set; }
        public string? TenUuDai { get; set; }
        public string? MaCode { get; set; }

        public int SoNguoiLon { get; set; }
        public int SoTreEm { get; set; }
        public int SoEmBe { get; set; }
        public int SoPhongDon { get; set; }         // thêm

        public decimal GiaNguoiLonTaiDat { get; set; }
        public decimal GiaTreEmTaiDat { get; set; }
        public decimal GiaEmBeTaiDat { get; set; }
        public decimal PhuThuPhongDonTaiDat { get; set; }
        public decimal GiaTriGiamTaiDat { get; set; }
        public decimal TongTien { get; set; }
        public string? GhiChu { get; set; }

        public int TrangThaiThanhToan { get; set; }
        public int TrangThaiDon { get; set; }
        public DateTime NgayDat { get; set; }
        public DateTime? NgayDuyet { get; set; }
        public string? NhanVienDuyet { get; set; }

        public List<KhachHangDTO> DanhSachHanhKhach { get; set; } = new();
        public ThanhToanDTO? ThongTinThanhToan { get; set; }
    }

    public class TourInfoDTO
    {
        public int MaTour { get; set; }
        public string TenTour { get; set; }
        public string? HinhAnh { get; set; }
    }

    public class ChuyenInfoDTO
    {
        public int MaChuyen { get; set; }
        public string MaChuyenCode { get; set; }
        public string DiemKhoiHanh { get; set; }
        public string DiemDen { get; set; }
        public DateTime NgayKhoiHanh { get; set; }
        public DateTime NgayKetThuc { get; set; }
        public string? TenHuongDanVien { get; set; }
    }

    public class KhachHangDTO
    {
        public int MaKhachHang { get; set; }
        public string HoTen { get; set; }
        public string? SoDienThoai { get; set; }
        public string? Email { get; set; }
        public DateTime NgaySinh { get; set; }
        public bool GioiTinh { get; set; }
        public int LoaiKhach { get; set; }
        public bool PhongDon { get; set; }          // thêm
    }

    // DTOs/TourBooking/TourBookingDetailDTO.cs

    public class ThanhToanDTO
    {
        public int MaThanhToan { get; set; }
        public int PhuongThucThanhToan { get; set; }    // 1=VNPay, 2=Tiền mặt, 3=Chuyển khoản
        public string TenPhuongThuc { get; set; }        // label hiển thị
        public string? MaGiaoDich { get; set; }
        public string? NoiDung { get; set; }
        public DateTime NgayThanhToan { get; set; }
        public int TrangThaiThanhToan { get; set; }      // 0=Chờ, 1=Thành công, 2=Thất bại, 3=Hoàn tiền
        public string TenTrangThai { get; set; }         // label hiển thị
        public decimal TongTienThanhToan { get; set; }
    }
}