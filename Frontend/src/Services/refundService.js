import axiosClient from "./axiosClient";

// ==================== ADMIN REFUND SERVICES ====================

/**
 * Lấy danh sách đơn đang chờ hoàn tiền (Admin/Staff)
 * @param {number} page - Trang hiện tại (mặc định: 1)
 * @param {number} pageSize - Số lượng bản ghi trên 1 trang (mặc định: 10)
 * @returns {Promise} - Promise chứa danh sách đơn chờ hoàn tiền
 */
export const getPendingRefundsApi = async (page = 1, pageSize = 10) => {
    return await axiosClient.get("/admin/refund/pending", {
        params: { page, pageSize }
    });
};

/**
 * Tính toán chính sách hoàn tiền cho đơn (Admin/Staff)
 * @param {number} maDonDatTour - Mã đơn đặt tour
 * @returns {Promise} - Promise chứa thông tin chính sách hoàn tiền
 */
export const calculateRefundPolicyApi = async (maDonDatTour) => {
    return await axiosClient.get(`/admin/refund/calculate-policy/${maDonDatTour}`);
};

export const confirmRefundApi = async (maThanhToan) => {
    return await axiosClient.post(`/admin/refund/confirm/${maThanhToan}`);
};

export const confirmRefundForOrderApi = async (maDonDatTour) => {
    return await axiosClient.post(`/admin/refund/confirm-order/${maDonDatTour}`);
};

/**
 * Từ chối hoàn tiền (Admin/Staff)
 * @param {number} maThanhToan - Mã giao dịch thanh toán
 * @param {string} lyDoTuChoi - Lý do từ chối hoàn tiền
 * @returns {Promise} - Promise chứa kết quả từ chối
 */
export const rejectRefundApi = async (maThanhToan, lyDoTuChoi) => {
    return await axiosClient.post(`/admin/refund/reject/${maThanhToan}`, { lyDoTuChoi });
};

/**
 * Xử lý hoàn tiền tự động cho đơn (Admin/Staff)
 * @param {number} maDonDatTour - Mã đơn đặt tour
 * @returns {Promise} - Promise chứa kết quả xử lý
 */
export const processRefundApi = async (maDonDatTour) => {
    return await axiosClient.post(`/admin/refund/process/${maDonDatTour}`);
};

/**
 * Hoàn cọc cho đơn (Admin/Staff)
 * @param {number} maDonDatTour - Mã đơn đặt tour
 * @param {string} lyDoHoan - Lý do hoàn cọc
 * @returns {Promise} - Promise chứa kết quả hoàn cọc
 */
export const refundDepositApi = async (maDonDatTour, lyDoHoan) => {
    return await axiosClient.post(`/admin/refund/refund-deposit/${maDonDatTour}`, { lyDoHoan });
};

/**
 * Cập nhật trạng thái thanh toán (Admin/Staff)
 * @param {number} maDonDatTour - Mã đơn đặt tour
 * @param {number} trangThaiThanhToan - Trạng thái thanh toán
 * @param {number} maNhanVien - Mã nhân viên
 * @param {number} soTienThanhToanLanNay - Số tiền thanh toán lần này
 * @returns {Promise} - Promise chứa kết quả cập nhật
 */
export const updatePaymentStatusApi = async (maDonDatTour, trangThaiThanhToan, maNhanVien, soTienThanhToanLanNay) => {
    return await axiosClient.put(
        `/admin/refund/payment-status/${maDonDatTour}`,
        { trangThaiThanhToan, maNhanVien, soTienThanhToanLanNay }
    );
};

/**
 * Cập nhật trạng thái cọc (Admin/Staff)
 * @param {number} maDonDatTour - Mã đơn đặt tour
 * @param {number} trangThaiCoc - Trạng thái cọc
 * @param {number} maNhanVien - Mã nhân viên
 * @returns {Promise} - Promise chứa kết quả cập nhật
 */
export const updateDepositStatusApi = async (maDonDatTour, trangThaiCoc, maNhanVien) => {
    return await axiosClient.put(
        `/admin/refund/deposit-status/${maDonDatTour}`,
        { trangThaiCoc, maNhanVien }
    );
};

/**
 * Cập nhật trạng thái đơn (Admin/Staff)
 * @param {number} maDonDatTour - Mã đơn đặt tour
 * @param {number} trangThai - Trạng thái đơn
 * @returns {Promise} - Promise chứa kết quả cập nhật
 */
export const updateInvoiceStatusApi = async (maDonDatTour, trangThai) => {
    return await axiosClient.put(`/admin/refund/invoice-status/${maDonDatTour}`, trangThai);
};

/**
 * Ghi nhận đã đặt cọc tại quầy (Admin/Staff)
 * @param {number} maDonDatTour - Mã đơn đặt tour
 * @param {number} phuongThucThanhToan - Phương thức thanh toán
 * @param {number} soTienThu - Số tiền thu
 * @returns {Promise} - Promise chứa kết quả
 */
export const confirmDepositApi = async (maDonDatTour, phuongThucThanhToan, soTienThu) => {
    return await axiosClient.post(
        `/admin/refund/confirm-deposit/${maDonDatTour}`,
        { phuongThucThanhToan, soTienThu }
    );
};

// ==================== USER REFUND SERVICES ====================

/**
 * Xác nhận hoàn tiền cho người dùng (User)
 * @param {number} maThanhToan - Mã giao dịch thanh toán
 * @returns {Promise} - Promise chứa kết quả xác nhận
 */
export const confirmRefundUserApi = async (maThanhToan) => {
    // ENDPOINT MỚI: Đã chuyển từ /user/profile/confirm-refund sang /user/refund/confirm
    return await axiosClient.post(`/user/refund/confirm/${maThanhToan}`);
};