import axiosClient from "./axiosClient";

// ==================== USER PROFILE SERVICES ====================

/**
 * Lấy thông tin profile của người dùng hiện tại
 * @returns {Promise} - Promise chứa thông tin profile
 */
export const getUserProfileApi = async () => {
    const response = await axiosClient.get("/user/profile/me");
    return response.data;
};

/**
 * Cập nhật thông tin profile
 * @param {FormData} formData - Dữ liệu form bao gồm thông tin profile và ảnh đại diện
 * @returns {Promise} - Promise chứa kết quả cập nhật
 */
export const updateUserProfileApi = async (formData) => {
    const response = await axiosClient.put("/user/profile/me", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

/**
 * Đổi mật khẩu
 * @param {Object} data - { matKhau, matKhauMoi, xacNhanMatKhau }
 * @returns {Promise} - Promise chứa kết quả đổi mật khẩu
 */
export const changePasswordApi = async (data) => {
    const response = await axiosClient.post("/user/profile/change-password", data);
    return response.data;
};

// ==================== ACCOUNT OVERVIEW ====================

/**
 * Lấy tổng quan tài khoản (số tour, số đánh giá, tổng tiền, tour gần đây)
 * @param {number|null} year - Năm cần thống kê (mặc định: null - tất cả)
 * @returns {Promise} - Promise chứa dữ liệu tổng quan
 */
export const getAccountOverviewApi = async (year = null) => {
    const response = await axiosClient.get("/user/profile/overview", {
        params: { year: year || undefined }
    });
    return response.data;
};

// ==================== BOOKING HISTORY ====================

/**
 * Lấy lịch sử đặt tour có phân trang
 * @param {number} page - Trang hiện tại (mặc định: 1)
 * @param {number} pageSize - Số lượng bản ghi trên 1 trang (mặc định: 5)
 * @param {string} search - Từ khóa tìm kiếm
 * @param {number|null} status - Trạng thái đơn (mặc định: null - tất cả)
 * @returns {Promise} - Promise chứa danh sách lịch sử đặt tour
 */
export const getBookingHistoryApi = async (page = 1, pageSize = 5, search = '', status = null) => {
    const response = await axiosClient.get("/user/profile/history", {
        params: { 
            page, 
            pageSize, 
            search: search || undefined, 
            status: status || undefined 
        }
    });
    return response.data;
};

/**
 * Lấy chi tiết đơn đặt tour
 * @param {number} id - Mã đơn đặt tour
 * @returns {Promise} - Promise chứa chi tiết đơn đặt tour
 */
export const getBookingDetailApi = async (id) => {
    const response = await axiosClient.get(`/user/profile/history/${id}`);
    return response.data;
};

// ==================== CANCEL BOOKING ====================

/**
 * User hủy đơn đặt tour
 * @param {number} id - Mã đơn đặt tour
 * @param {string} lyDoHuy - Lý do hủy
 * @returns {Promise} - Promise chứa kết quả hủy
 */
export const cancelBookingUserApi = async (id, lyDoHuy) => {
    const response = await axiosClient.post(
        `/user/profile/cancel/${id}`,
        { lyDoHuy: lyDoHuy }
    );
    return response.data;
};

// ==================== USER REVIEWS ====================

/**
 * Lấy danh sách đánh giá của người dùng
 * @param {number} page - Trang hiện tại (mặc định: 1)
 * @param {number} pageSize - Số lượng bản ghi trên 1 trang (mặc định: 5)
 * @param {string} search - Từ khóa tìm kiếm
 * @param {number|null} rating - Số sao đánh giá (1-5)
 * @returns {Promise} - Promise chứa danh sách đánh giá
 */
export const getUserReviewsApi = async (page = 1, pageSize = 5, search = '', rating = null) => {
    const response = await axiosClient.get("/user/profile/reviews", {
        params: {
            page,
            pageSize,
            search: search || undefined,
            rating: rating || undefined
        }
    });
    return response.data;
};

