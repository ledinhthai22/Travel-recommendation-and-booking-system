// DTOs/Log/ActionLogDTO.cs
namespace travel_recommendation_and_booking_system.DTOs.Log
{
    public static class ActionLogDTO
    {
        #region Quản lý chung (General)

        public const string Tao = "Tạo";
        public const string CapNhat = "Cập nhật";
        public const string Xoa = "Xóa";
        public const string CapNhatTrangThai = "Cập nhật trạng thái";
        public const string XacNhan = "Xác nhận";
        public const string TuChoi = "Từ chối";
        public const string Huy = "Hủy";

        #endregion

        #region Xác thực & Người dùng (Authentication & User)

        public const string DangNhap = "Đăng nhập";
        public const string DangXuat = "Đăng xuất";
        public const string DangKy = "Đăng ký";
        public const string DangNhapThatBai = "Đăng nhập thất bại";
        public const string DoiMatKhau = "Đổi mật khẩu";
        public const string YeuCauOTP = "Yêu cầu OTP";
        public const string KhoaTaiKhoan = "Khóa tài khoản";
        public const string MoKhoaTaiKhoan = "Mở khóa tài khoản";
        public const string CapNhatHoSo = "Cập nhật hồ sơ";

        #endregion

        #region Đặt tour & Thanh toán (Booking & Payment)

        public const string DatTour = "Đặt tour";
        public const string CapNhatDonDatTour = "Cập nhật đơn đặt tour";
        public const string DuyetDon = "Duyệt đơn";
        public const string HuyDon = "Hủy đơn";
        public const string YeuCauHuy = "Yêu cầu hủy";
        public const string XacNhanHuy = "Xác nhận hủy";
        public const string TuChoiHuy = "Từ chối hủy";
        public const string ThanhToan = "Thanh toán";
        public const string DatCoc = "Đặt cọc";
        public const string HoanTien = "Hoàn tiền";
        public const string XacNhanHoanTien = "Xác nhận hoàn tiền";
        public const string TuChoiHoanTien = "Từ chối hoàn tiền";
        public const string CapNhatTrangThaiCoc = "Cập nhật trạng thái cọc";
        public const string CapNhatTrangThaiThanhToan = "Cập nhật trạng thái thanh toán";
        public const string HoanThanhTour = "Hoàn thành tour";

        #endregion

        #region Hành khách (Passenger)

        public const string ThemHanhKhach = "Thêm hành khách";
        public const string CapNhatHanhKhach = "Cập nhật hành khách";
        public const string XoaHanhKhach = "Xóa hành khách";

        #endregion

        #region Tương tác khách hàng (Customer Interaction)

        public const string GuiLienHe = "Gửi liên hệ";
        public const string GuiDanhGia = "Gửi đánh giá";
        public const string GuiNewsletter = "Gửi newsletter";

        #endregion

        #region Quản lý hệ thống (System Management)

        public const string ThemNhanVien = "Thêm nhân viên";
        public const string CapNhatNhanVien = "Cập nhật nhân viên";
        public const string XoaNhanVien = "Xóa nhân viên";
        public const string ThemNguoiDung = "Thêm người dùng";
        public const string CapNhatNguoiDung = "Cập nhật người dùng";
        public const string XoaNguoiDung = "Xóa người dùng";

        #endregion

        #region Quản lý tour & chuyến đi (Tour & Departure)

        public const string ThemTour = "Thêm tour";
        public const string CapNhatTour = "Cập nhật tour";
        public const string XoaTour = "Xóa tour";
        public const string ThemChuyen = "Thêm chuyến";
        public const string CapNhatChuyen = "Cập nhật chuyến";
        public const string XoaChuyen = "Xóa chuyến";
        public const string CapNhatTrangThaiChuyen = "Cập nhật trạng thái chuyến";

        #endregion

        #region Khuyến mãi (Promotion)

        public const string ThemKhuyenMai = "Thêm khuyến mãi";
        public const string CapNhatKhuyenMai = "Cập nhật khuyến mãi";
        public const string XoaKhuyenMai = "Xóa khuyến mãi";
        public const string ApDungKhuyenMai = "Áp dụng khuyến mãi";

        #endregion

        #region Dữ liệu & Thống kê (Data & Statistics)

        public const string XuatBaoCao = "Xuất báo cáo";
        public const string XemThongKe = "Xem thống kê";
        public const string XuLyDuLieu = "Xử lý dữ liệu";

        #endregion

        #region Hệ thống (System)

        public const string KhoiDongHeThong = "Khởi động hệ thống";
        public const string TatHeThong = "Tắt hệ thống";
        public const string BaoTriHeThong = "Bảo trì hệ thống";
        public const string XuLyJob = "Xử lý job tự động";

        #endregion

        #region Xuất file (Export)

        public const string XuatExcel = "Xuất Excel";
        public const string XuatPDF = "Xuất PDF";
        public const string XuatWord = "Xuất Word";
        public const string InHopDong = "In hợp đồng";

        #endregion

        #region Đối tượng (Subjects) - Dùng kết hợp với action

        public const string NguoiDung = "Người dùng";
        public const string NhanVien = "Nhân viên";
        public const string QuanTriVien = "Quản trị viên";
        public const string HeThong = "Hệ thống";

        #endregion
    }
}