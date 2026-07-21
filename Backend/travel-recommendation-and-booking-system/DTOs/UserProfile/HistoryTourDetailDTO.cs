using System.Collections.Generic;

namespace travel_recommendation_and_booking_system.DTOs.UserProfile
{
    public class HistoryTourDetailDTO
    {
        public int MaTour { get; set; }
        public int MaNguoiDung { get; set; }
        public int MaDonDatTour { get; set; }
        public string MaDatCho { get; set; } = string.Empty;
        public int TrangThai { get; set; }
        public string TenTrangThai { get; set; } = string.Empty;
        public string NgayDat { get; set; } = string.Empty;
        public string TenTour { get; set; } = string.Empty;
        public string NgayKhoiHanh { get; set; } = string.Empty;
        public string NgayKetThuc { get; set; } = string.Empty;
        public string DiaDiem { get; set; } = string.Empty;
        public int SoLuongNguoiLon { get; set; }
        public int SoLuongTreEm { get; set; }
        public int SoLuongEmBe { get; set; }
        public decimal TongTien { get; set; }
        public decimal TienCoc { get; set; }
        public decimal SoTienDaThanhToan { get; set; }
        public string PhuongThucThanhToan { get; set; } = string.Empty;
        public int TrangThaiThanhToan { get; set; }
        public string TenTrangThaiThanhToan { get; set; } = string.Empty;

        // Trạng thái tài chính (thay thế TrangThaiCoc)
        public int TrangThaiTaiChinh { get; set; }
        public string TenTrangThaiTaiChinh { get; set; } = string.Empty;

        public bool DaDanhGia { get; set; }
        public List<UserKhachHangDTO> DanhSachHanhKhach { get; set; } = new();
        public List<HistoryThanhToanDTO> LichSuThanhToan { get; set; } = new();
        public string? LyDoHuy { get; set; }
        public DateTime? NgayHuy { get; set; }
        public string? GhiChu { get; set; }
        public int MaChuyen { get; set; }
        public string MaChuyenCode { get; set; } = string.Empty;
        public string DiemKhoiHanh { get; set; } = string.Empty;
        public string TenHuongDanVien { get; set; } = string.Empty;
        public string TenUuDai { get; set; } = string.Empty;
        public string MaCodeUuDai { get; set; } = string.Empty;
        public decimal PhuThuPhongDon { get; set; }
        public int SoPhongDon { get; set; }

        // Flags hỗ trợ
        public bool IsChuaThanhToan => TrangThaiTaiChinh == 0;
        public bool IsDaDatCoc => TrangThaiTaiChinh == 1;
        public bool IsDaThanhToanDu => TrangThaiTaiChinh == 2;
        public bool IsDangHoanTien => TrangThaiTaiChinh == 3;
        public bool IsDaHoanTien => TrangThaiTaiChinh == 4;
        public bool IsMatCoc => TrangThaiTaiChinh == 5;
        public bool IsDaHuy => TrangThai == 6;
        public bool IsHoanTat => TrangThai == 5;
    }

    public class UserKhachHangDTO
    {
        public int MaKhachHang { get; set; }
        public string HoTen { get; set; } = string.Empty;
        public string? SoDienThoai { get; set; }
        public string? Email { get; set; }
        public DateTime NgaySinh { get; set; }
        public bool GioiTinh { get; set; }
        public int LoaiKhach { get; set; }
        public bool PhongDon { get; set; }
    }

    public class HistoryThanhToanDTO
    {
        public int MaThanhToan { get; set; }
        public string PhuongThucThanhToan { get; set; } = string.Empty;
        public decimal TongTienThanhToan { get; set; }
        public string NgayThanhToan { get; set; } = string.Empty;
        public int TrangThaiThanhToan { get; set; }
        public string TenTrangThaiThanhToan { get; set; } = string.Empty;
        public int LoaiThanhToan { get; set; }
        public string TenLoaiThanhToan { get; set; } = string.Empty;
        public decimal? SoTienHoan { get; set; }
        public string? MaGiaoDich { get; set; }
        public string? NoiDung { get; set; }
        public DateTime? NgayHoanTien { get; set; }

        // Flags hỗ trợ
        public bool LaGiaoDichHoanTien => LoaiThanhToan == 4;
        public bool LaGiaoDichDatCoc => LoaiThanhToan == 1;
        public bool LaGiaoDichThanhToanConLai => LoaiThanhToan == 2;
        public bool LaGiaoDichThanhToanToanBo => LoaiThanhToan == 3;
        public bool ThanhCong => TrangThaiThanhToan == 1;
        public bool DangXuLy => TrangThaiThanhToan == 0;
        public bool BiHuy => TrangThaiThanhToan == 3;
    }
}