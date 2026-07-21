import axiosClient from "./axiosClient";

// ==================== USER TOUR BOOKINGS ====================

/**
 * Lấy danh sách đơn đặt tour của user hiện tại
 * @returns {Promise} - Promise chứa danh sách đơn đặt tour
 */
export const getUserBookingsApi = async () => {
    const response = await axiosClient.get("/user/tour-bookings");
    return response.data;
};

/**
 * Lấy chi tiết đơn đặt tour của user
 * @param {number} bookingId - Mã đơn đặt tour
 * @returns {Promise} - Promise chứa chi tiết đơn đặt tour
 */
export const getUserBookingDetailApi = async (bookingId) => {
    const response = await axiosClient.get(`/user/tour-bookings/${bookingId}`);
    return response.data;
};

/**
 * Tạo đơn đặt tour (User)
 * @param {Object} bookingDto - Dữ liệu đặt tour
 * @param {number|null} holdId - Mã giữ chỗ (nếu có)
 * @returns {Promise} - Promise chứa kết quả tạo đơn
 */
export const createBookingClientApi = async (bookingDto, holdId = null) => {
    const params = holdId ? { holdId } : {};
    const response = await axiosClient.post("/user/tour-bookings", bookingDto, { params });
    return response.data;
};

/**
 * Hủy đơn đặt tour (User)
 * @param {number} bookingId - Mã đơn đặt tour
 * @param {string} lyDoHuy - Lý do hủy
 * @returns {Promise} - Promise chứa kết quả hủy
 */
export const cancelBookingClientApi = async (bookingId, lyDoHuy) => {
    const response = await axiosClient.post(`/user/tour-bookings/${bookingId}/cancel`, { lyDoHuy });
    return response.data;
};

/**
 * Giữ chỗ tạm thời
 * @param {Object} reserveDto - { maChuyen, soNguoiLon, soTreEm, soEmBe }
 * @returns {Promise} - Promise chứa thông tin giữ chỗ
 */
export const reserveSeatsApi = async (reserveDto) => {
    const payload = {
        maChuyen: reserveDto.maChuyen,
        soNguoiLon: reserveDto.soNguoiLon || 0,
        soTreEm: reserveDto.soTreEm || 0,
        soEmBe: reserveDto.soEmBe || 0
    };
    const response = await axiosClient.post("/user/tour-bookings/reserve", payload);
    return response.data;
};

/**
 * Hủy giữ chỗ
 * @param {number} holdId - Mã giữ chỗ
 * @returns {Promise} - Promise chứa kết quả hủy giữ chỗ
 */
export const releaseReservationApi = async (holdId) => {
    const response = await axiosClient.delete(`/user/tour-bookings/reserve/${holdId}`);
    return response.data;
};

// ==================== ADMIN TOUR BOOKINGS ====================

/**
 * Lấy danh sách đơn đặt tour có phân trang (Admin)
 * @param {Object} filters - Bộ lọc
 * @param {string} filters.keyword - Từ khóa tìm kiếm
 * @param {number} filters.bookingStatus - Trạng thái đơn
 * @param {number} filters.paymentStatus - Trạng thái thanh toán
 * @param {string} filters.bookingDate - Ngày đặt
 * @param {number} filters.page - Trang hiện tại
 * @param {number} filters.size - Số lượng bản ghi trên 1 trang
 * @returns {Promise} - Promise chứa danh sách đơn đặt tour
 */
export const getPagedTourBookingAdminApi = async (filters = {}) => {
    const params = {
        keyword: filters.keyword || undefined,
        bookingStatus: filters.bookingStatus ?? undefined,
        paymentStatus: filters.paymentStatus ?? undefined,
        page: filters.page || 1,
        size: filters.size || 10,
    };

    // Xử lý lọc theo khoảng thời gian
    if (filters.fromDate) {
        params.fromDate = filters.fromDate;
    }
    
    if (filters.toDate) {
        params.toDate = filters.toDate;
    }

    // Hoặc nếu dùng bookingDate và bookingDateTo
    if (filters.bookingDate) {
        params.bookingDate = filters.bookingDate;
    }
    
    if (filters.bookingDateTo) {
        params.bookingDateTo = filters.bookingDateTo;
    }

    // Xóa các undefined để URL sạch hơn
    Object.keys(params).forEach(key => {
        if (params[key] === undefined || params[key] === null || params[key] === '') {
            delete params[key];
        }
    });

    const response = await axiosClient.get("/admin/tour-bookings", { params });
    return response.data;
};
/**
 * Lấy chi tiết đơn đặt tour (Admin)
 * @param {number} bookingId - Mã đơn đặt tour
 * @returns {Promise} - Promise chứa chi tiết đơn đặt tour
 */
export const getTourBookingDetailAdminApi = async (bookingId) => {
    const response = await axiosClient.get(`/admin/tour-bookings/${bookingId}`);
    return response.data;
};

/**
 * Tạo đơn đặt tour (Admin)
 * @param {Object} createAdminDto - Dữ liệu tạo đơn
 * @returns {Promise} - Promise chứa kết quả tạo đơn
 */
export const createBookingAdminApi = async (createAdminDto) => {
    const response = await axiosClient.post("/admin/tour-bookings", createAdminDto);
    return response.data;
};

/**
 * Cập nhật đơn đặt tour (Admin)
 * @param {Object} updateAdminDto - Dữ liệu cập nhật
 * @returns {Promise} - Promise chứa kết quả cập nhật
 */
export const updateBookingAdminApi = async (updateAdminDto) => {
    const response = await axiosClient.put("/admin/tour-bookings", updateAdminDto);
    return response.data;
};

/**
 * Duyệt đơn đặt tour (Admin)
 * @param {number} bookingId - Mã đơn đặt tour
 * @param {number} employeeId - Mã nhân viên duyệt
 * @returns {Promise} - Promise chứa kết quả duyệt
 */
export const approveBookingAdminApi = async (bookingId, employeeId) => {
    const response = await axiosClient.put(`/admin/tour-bookings/${bookingId}/approve`, null, {
        params: { employeeId },
    });
    return response.data;
};

/**
 * Hủy đơn đặt tour (Admin)
 * @param {number} id - Mã đơn đặt tour
 * @param {string} lyDoHuy - Lý do hủy
 * @returns {Promise} - Promise chứa kết quả hủy
 */
export const cancelBookingAdminApi = async (id, lyDoHuy) => {
    const response = await axiosClient.post(`/admin/tour-bookings/${id}/cancel`, null, {
        params: { lyDoHuy }
    });
    return response.data;
};

/**
 * Hoàn tất đơn hàng (Admin)
 * @param {number} bookingId - Mã đơn đặt tour
 * @returns {Promise} - Promise chứa kết quả hoàn tất
 */
export const completeBookingAdminApi = async (bookingId) => {
    const response = await axiosClient.put(`/admin/tour-bookings/${bookingId}/complete`);
    return response.data;
};

/**
 * Cập nhật thông tin hành khách (Admin)
 * @param {number} maKhachHang - Mã hành khách
 * @param {Object} data - Dữ liệu cập nhật
 * @returns {Promise} - Promise chứa kết quả cập nhật
 */
export const updatePassengerAdminApi = async (maKhachHang, data) => {
    const response = await axiosClient.put(`/admin/tour-bookings/passenger/${maKhachHang}`, data);
    return response.data;
};

// ==================== CONTRACT PRINTING ====================

/**
 * In hợp đồng cho danh sách đơn (Admin)
 * @param {number[]} maDonDatTours - Danh sách mã đơn đặt tour
 * @returns {Promise} - Promise chứa file PDF/ZIP
 */
export const printContractsByIdsApi = (maDonDatTours) =>
    axiosClient.post(
        '/admin/tour-bookings/print-contract',
        { maDonDatTours },
        { responseType: 'blob' }
    );

/**
 * In hợp đồng theo chuyến (Admin)
 * @param {number} maChuyen - Mã chuyến
 * @returns {Promise} - Promise chứa file PDF/ZIP
 */
export const printContractsByChuyenApi = (maChuyen) =>
    axiosClient.get(
        `/admin/tour-bookings/print-contract/by-chuyen/${maChuyen}`,
        { responseType: 'blob' }
    );

