namespace travel_recommendation_and_booking_system.DTOs.TourBooking
{
    public class TourBookingDetailDTO
    {
        public int MaDonDatTour { get; set; }
        public string MaDatCho { get; set; } = string.Empty;

        public string TenNguoiDat { get; set; } = string.Empty;
        public string SoDienThoai { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string DiaChi { get; set; } = string.Empty;
        public string? GhiChu { get; set; }

        // Thông tin Tour và Chuyến
        public TourInfoDTO Tour { get; set; } = new();
        public ChuyenInfoDTO Chuyen { get; set; } = new();

        // Thông tin ưu đãi
        public string? TenUuDai { get; set; }
        public string? MaCode { get; set; }

        // Thông tin hành khách
        public int SoNguoiLon { get; set; }
        public int SoTreEm { get; set; }
        public int SoEmBe { get; set; }
        public int SoPhongDon { get; set; }

        // Thông tin giá
        public decimal GiaNguoiLonTaiDat { get; set; }
        public decimal GiaTreEmTaiDat { get; set; }
        public decimal GiaEmBeTaiDat { get; set; }
        public decimal PhuThuPhongDonTaiDat { get; set; }
        public decimal GiaTriGiamTaiDat { get; set; }
        public decimal TongTien { get; set; }

        // Thông tin cọc và thanh toán
        public decimal TienCoc { get; set; }
        public decimal SoTienDaThanhToan { get; set; }
        public decimal SoTienConLai => TongTien - SoTienDaThanhToan;
        public bool CoTheThanhToanConLai => TrangThaiTaiChinh == 1 && SoTienConLai > 0;

        // Trạng thái tài chính
        public int TrangThaiTaiChinh { get; set; }
        public string? TenTrangThaiTaiChinh { get; set; }

        // Trạng thái thanh toán
        public int TrangThaiThanhToan { get; set; }
        public string? TenTrangThaiThanhToan { get; set; }

        // Trạng thái đơn
        public int TrangThaiDon { get; set; }
        public string? TenTrangThaiDon { get; set; }
        public bool CoCanhBaoCongNo { get; set; }
        public DateTime? NgayGanCoCanhBao { get; set; }

        // Thời gian
        public DateTime NgayDat { get; set; }
        public DateTime? NgayDuyet { get; set; }
        public DateTime? NgayHuy { get; set; }
        public DateTime? NgayYeuCauHuy { get; set; }

        // Thông tin hủy
        public string? LyDoHuy { get; set; }
        public string? AdminNote { get; set; }

        // Nhân viên xử lý
        public string? NhanVienDuyet { get; set; }
        public string? NhanVienXuLyHoan { get; set; }

        // Danh sách hành khách
        public List<KhachHangDTO> DanhSachHanhKhach { get; set; } = new();

        // Thông tin thanh toán
        public ThanhToanDTO? ThongTinThanhToan { get; set; }
        public List<ThanhToanDTO> LichSuThanhToan { get; set; } = new();

        // Thông tin hoàn tiền
        public RefundInfoDTO? ThongTinHoanTien { get; set; }
        public List<RefundInfoDTO> LichSuHoanTien { get; set; } = new();

        // Flag hỗ trợ
        public bool IsChuaThanhToan => TrangThaiTaiChinh == 0;
        public bool IsDaDatCoc => TrangThaiTaiChinh == 1;
        public bool IsDaThanhToanDu => TrangThaiTaiChinh == 2;
        public bool IsDangHoanTien => TrangThaiTaiChinh == 3;
        public bool IsDaHoanTien => TrangThaiTaiChinh == 4;
        public bool IsMatCoc => TrangThaiTaiChinh == 5;
        public bool IsDaHuy => TrangThaiDon == 6;
        public bool IsHoanTat => TrangThaiDon == 5;
        public bool IsDangHoatDong => TrangThaiDon >= 1 && TrangThaiDon <= 4;
    }

    public class TourInfoDTO
    {
        public int MaTour { get; set; }
        public string TenTour { get; set; } = string.Empty;
        public string? HinhAnh { get; set; }
        public string? Slug { get; set; }
    }

    public class ChuyenInfoDTO
    {
        public int MaChuyen { get; set; }
        public string MaChuyenCode { get; set; } = string.Empty;
        public string DiemKhoiHanh { get; set; } = string.Empty;
        public string DiemDen { get; set; } = string.Empty;
        public DateTime NgayKhoiHanh { get; set; }
        public DateTime NgayKetThuc { get; set; }
        public string? TenHuongDanVien { get; set; }
        public int SoChoToiDa { get; set; }
        public int SoChoDaDat { get; set; }
        public int SoChoConLai => SoChoToiDa - SoChoDaDat;
    }

    public class KhachHangDTO
    {
        public int MaKhachHang { get; set; }
        public string HoTen { get; set; } = string.Empty;
        public string? SoDienThoai { get; set; }
        public string? Email { get; set; }
        public DateTime? NgaySinh { get; set; }
        public bool GioiTinh { get; set; }
        public int LoaiKhach { get; set; }  // 1=Người lớn, 2=Trẻ em, 3=Em bé
        public string? TenLoaiKhach { get; set; }
        public bool PhongDon { get; set; }
    }

    public class ThanhToanDTO
    {
        public int MaThanhToan { get; set; }
        public int PhuongThucThanhToan { get; set; }
        public string TenPhuongThuc { get; set; } = string.Empty;
        public string? MaGiaoDich { get; set; }
        public string? VnpTransactionNo { get; set; }
        public string? NoiDung { get; set; }
        public DateTime NgayThanhToan { get; set; }
        public DateTime? NgayXacNhan { get; set; }

        // Trạng thái thanh toán
        public int TrangThaiThanhToan { get; set; }
        public string TenTrangThai { get; set; } = string.Empty;

        // Loại thanh toán
        public int LoaiThanhToan { get; set; }
        public string TenLoaiThanhToan { get; set; } = string.Empty;

        // Số tiền
        public decimal TongTienThanhToan { get; set; }
        public decimal? SoTienHoan { get; set; }

        // Hoàn tiền
        public DateTime? NgayHoanTien { get; set; }
        public string? MaNhanVienXuLyHoan { get; set; }
        public string? LyDoHoanTien { get; set; }

        // Flag hỗ trợ
        public bool LaGiaoDichHoanTien => LoaiThanhToan == 4;
        public bool LaGiaoDichDatCoc => LoaiThanhToan == 1;
        public bool LaGiaoDichThanhToanConLai => LoaiThanhToan == 2;
        public bool LaGiaoDichThanhToanToanBo => LoaiThanhToan == 3;
        public bool ThanhCong => TrangThaiThanhToan == 1;
    }

    public class RefundInfoDTO
    {
        public int MaThanhToan { get; set; }
        public int MaDonDatTour { get; set; }
        public string MaDatCho { get; set; } = string.Empty;
        public decimal SoTienHoan { get; set; }
        public string? LyDoHoanTien { get; set; }
        public int TrangThaiThanhToan { get; set; }
        public string TenTrangThai { get; set; } = string.Empty;
        public DateTime NgayThanhToan { get; set; }
        public DateTime? NgayHoanTien { get; set; }
        public string? MaNhanVienXuLyHoan { get; set; }
        public string? TenNhanVienXuLyHoan { get; set; }
        public string? MaGiaoDich { get; set; }

        // Flag hỗ trợ
        public bool DangXuLy => TrangThaiThanhToan == 0;
        public bool DaHoanThanhCong => TrangThaiThanhToan == 1;
        public bool BiHuy => TrangThaiThanhToan == 3;
    }

    public static class BookingStatus
    {
        // Trạng thái tài chính
        public const int TC_CHUA_THANH_TOAN = 0;
        public const int TC_DA_DAT_COC = 1;
        public const int TC_DA_THANH_TOAN_DU = 2;
        public const int TC_DANG_HOAN_TIEN = 3;
        public const int TC_DA_HOAN_TIEN = 4;
        public const int TC_MAT_COC = 5;

        // Trạng thái đơn
        public const int DON_CHO_THANH_TOAN = 1;
        public const int DON_CHO_DUYET = 2;
        public const int DON_DA_DUYET = 3;
        public const int DON_DANG_DIEN_RA = 4;
        public const int DON_HOAN_TAT = 5;
        public const int DON_DA_HUY = 6;

        // Trạng thái thanh toán
        public const int TT_CHO_XU_LY = 0;
        public const int TT_THANH_CONG = 1;
        public const int TT_THAT_BAI = 2;
        public const int TT_DA_HUY = 3;

        // Loại thanh toán
        public const int LOAI_DAT_COC = 1;
        public const int LOAI_THANH_TOAN_PHAN_CON_LAI = 2;
        public const int LOAI_THANH_TOAN_TOAN_BO = 3;
        public const int LOAI_HOAN_TIEN = 4;

        // Helper methods
        public static string GetOrderStatusName(int status) => status switch
        {
            DON_CHO_THANH_TOAN => "Chờ thanh toán",
            DON_CHO_DUYET => "Chờ duyệt",
            DON_DA_DUYET => "Đã duyệt",
            DON_DANG_DIEN_RA => "Đang diễn ra",
            DON_HOAN_TAT => "Hoàn tất",
            DON_DA_HUY => "Đã hủy",
            _ => "Không xác định"
        };

        public static string GetFinancialStatusName(int status) => status switch
        {
            TC_CHUA_THANH_TOAN => "Chưa thanh toán",
            TC_DA_DAT_COC => "Đã đặt cọc",
            TC_DA_THANH_TOAN_DU => "Đã thanh toán đủ",
            TC_DANG_HOAN_TIEN => "Đang hoàn tiền",
            TC_DA_HOAN_TIEN => "Đã hoàn tiền",
            TC_MAT_COC => "Mất cọc",
            _ => "Không xác định"
        };

        public static string GetPaymentStatusName(int status) => status switch
        {
            TT_CHO_XU_LY => "Chờ xử lý",
            TT_THANH_CONG => "Thành công",
            TT_THAT_BAI => "Thất bại",
            TT_DA_HUY => "Đã hủy",
            _ => "Không xác định"
        };

        public static string GetPaymentTypeName(int type) => type switch
        {
            LOAI_DAT_COC => "Đặt cọc",
            LOAI_THANH_TOAN_PHAN_CON_LAI => "Thanh toán phần còn lại",
            LOAI_THANH_TOAN_TOAN_BO => "Thanh toán toàn bộ",
            LOAI_HOAN_TIEN => "Hoàn tiền",
            _ => "Khác"
        };

        public static bool IsOrderActive(int status) => status >= DON_CHO_THANH_TOAN && status <= DON_DANG_DIEN_RA;
        public static bool IsOrderCancelled(int status) => status == DON_DA_HUY;
        public static bool IsOrderCompleted(int status) => status == DON_HOAN_TAT;
        public static bool IsPaymentSuccess(int status) => status == TT_THANH_CONG;
    }
}