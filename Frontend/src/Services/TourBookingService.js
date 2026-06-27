import axiosClient from "./axiosClient";

/**
 * Lấy danh sách booking của một user cụ thể
 */
export const getUserBookingsApi = async (userId) => {
    return await axiosClient.get(`/user/tour-bookings/${userId}`);
};

/**
 * Lấy chi tiết một booking cụ thể của user
 */
export const getUserBookingDetailApi = async (userId, bookingId) => {
    return await axiosClient.get(`/user/tour-bookings/${userId}/${bookingId}`);
};


export const createBookingClientApi = async (userId, bookingDto, holdId = null) => {
    return await axiosClient.post(`/user/tour-bookings/${userId}`, bookingDto, {
        params: holdId ? { holdId } : {},
    });
};

/**
 * User chủ động hủy đơn đặt tour
 */
export const cancelBookingClientApi = async (userId, bookingId) => {
    return await axiosClient.put(`/user/tour-bookings/${userId}/${bookingId}/cancel`);
};

/**
 * Giữ chỗ tạm thời (Reserve seats) trước khi thanh toán
 */
export const reserveSeatsApi = async (userId, reserveDto) => {
    return await axiosClient.post(`/user/tour-bookings/${userId}/reserve`, reserveDto);
};

/**
 * Hủy giữ chỗ tạm thời (Release reservation)
 */
export const releaseReservationApi = async (userId, holdId) => {
    return await axiosClient.delete(`/user/tour-bookings/${userId}/reserve/${holdId}`);
};


/**
 * Lấy danh sách phân trang kèm bộ lọc đơn hàng dành cho Admin
 */
export const getPagedTourBookingAdminApi = async (filters = {}) => {
    return await axiosClient.get("/admin/tour-bookings", {
        params: {
            keyword: filters.keyword || undefined,
            bookingStatus: filters.bookingStatus ?? undefined,
            paymentStatus: filters.paymentStatus ?? undefined,
            bookingDate: filters.bookingDate || undefined,
            page: filters.page || 1,
            size: filters.size || 10,
        },
    });
};

/**
 * Lấy thông tin chi tiết một đơn đặt tour dành cho Admin
 */
export const getTourBookingDetailAdminApi = async (bookingId) => {
    return await axiosClient.get(`/admin/tour-bookings/${bookingId}`);
};

/**
 * Admin duyệt đơn đặt tour
 */
export const approveBookingAdminApi = async (bookingId, employeeId) => {
    return await axiosClient.put(`/admin/tour-bookings/${bookingId}/approve`, null, {
        params: { employeeId },
    });
};

/**
 * Admin hủy đơn hàng
 */
export const cancelBookingAdminApi = async (bookingId) => {
    return await axiosClient.put(`/admin/tour-bookings/${bookingId}/cancel`);
};

/**
 * Cập nhật trạng thái thanh toán (Đã thanh toán / Chưa thanh toán)
 */
export const updatePaymentStatusAdminApi = async (bookingId, isPaid) => {
    return await axiosClient.put(`/admin/tour-bookings/${bookingId}/payment-status`, isPaid, {
        headers: { "Content-Type": "application/json" },
    });
};

/**
 * Cập nhật trạng thái xử lý của đơn đặt tour (bookingStatus)
 */
export const updateBookingStatusAdminApi = async (bookingId, statusId) => {
    return await axiosClient.put(`/admin/tour-bookings/${bookingId}/status`, null, {
        params: { status: statusId },
    });
};

/**
 * Admin tạo hộ/trực tiếp một đơn đặt tour mới
 */
export const createBookingAdminApi = async (createAdminDto) => {
    return await axiosClient.post("/admin/tour-bookings", createAdminDto);
};

/**
 * Admin chỉnh sửa/cập nhật thông tin đơn đặt tour
 */
export const updateBookingAdminApi = async (updateAdminDto) => {
    return await axiosClient.put("/admin/tour-bookings", updateAdminDto);
};


export const updatePassengerAdminApi = async (maKhachHang, data) => {
    const response = await axiosClient.put(
        `/admin/tour-bookings/passenger/${maKhachHang}`,
        data
    );
    return response.data;
};

/**
 * Đánh dấu hoàn thành tour
 */
export const completeBookingAdminApi = async (maDonDatTour) => {
    const response = await axiosClient.put(
        `/admin/tour-bookings/${maDonDatTour}/complete`
    );
    return response.data;
};