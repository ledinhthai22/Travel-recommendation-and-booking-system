using DTOs.Page;
using travel_recommendation_and_booking_system.DTOs.Common;
using travel_recommendation_and_booking_system.DTOs.TourBooking;
using travel_recommendation_and_booking_system.DTOs.UserProfile;

namespace travel_recommendation_and_booking_system.Interfaces
{
    public interface IRefundService
    {
        #region Refund Management

        /// <summary>
        /// Lấy danh sách đơn đang chờ hoàn tiền
        /// </summary>
        Task<PageDTO<PendingRefundDTO>> GetPendingRefundsAsync(int page, int pageSize);

        /// <summary>
        /// Tính toán chính sách hoàn tiền cho đơn
        /// </summary>
        Task<RefundPolicyDTO> CalculateRefundPolicyAsync(int maDonDatTour);

        /// <summary>
        /// Xác nhận hoàn tiền cho giao dịch (Admin)
        /// </summary>
        Task<bool> ConfirmRefundAsync(int maThanhToan, int maNhanVien);

        /// <summary>
        /// Xác nhận hoàn tiền cho đơn (Admin)
        /// </summary>
        Task<bool> ConfirmRefundForOrderAsync(int maDonDatTour);

        /// <summary>
        /// Từ chối hoàn tiền (Admin)
        /// </summary>
        Task<bool> RejectRefundAsync(int maThanhToan, int maNhanVien, string lyDoTuChoi);

        /// <summary>
        /// Xử lý hoàn tiền tự động cho đơn (Admin)
        /// </summary>
        Task<bool> ProcessRefundAsync(int maDonDatTour, int maNhanVien);

        /// <summary>
        /// Hoàn cọc cho khách hàng
        /// </summary>
        Task<bool> RefundDepositAsync(int maDonDatTour, string lyDoHoan);

        #endregion

        #region Payment & Deposit Management

        /// <summary>
        /// Ghi nhận đã đặt cọc tại quầy (Admin)
        /// </summary>
        Task<bool> XacNhanDaDatCocAsync(int maDonDatTour, int maNhanVien, int phuongThucThanhToan, decimal soTienThu);

        /// <summary>
        /// Cập nhật trạng thái thanh toán (Admin)
        /// </summary>
        Task<bool> UpdatePaymentStatusAsync(int maDonDatTour, int trangThai, int maNhanVien, decimal soTienThanhToanLanNay);

        /// <summary>
        /// Cập nhật trạng thái cọc (Admin)
        /// </summary>
        Task<bool> UpdateDepositStatusAsync(int maDonDatTour, int trangThaiCoc, int maNhanVien);

        /// <summary>
        /// Cập nhật trạng thái đơn (Admin)
        /// </summary>
        Task<bool> UpdateInvoiceStatusAsync(int maDonDatTour, int trangThai);

        #endregion

        #region User Refund

        /// <summary>
        /// Xác nhận hoàn tiền cho người dùng (User)
        /// </summary>
        Task<bool> ConfirmRefundUserAsync(int maThanhToan);

        #endregion
    }
}