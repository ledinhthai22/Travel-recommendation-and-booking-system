import axiosClient from "./axiosClient";

export const getUserBookingsApi = async (userId) => {
    return await axiosClient.get(`/user/tour-bookings/${userId}`);
};


export const getUserBookingDetailApi = async (userId, bookingId) => {
    return await axiosClient.get(`/user/tour-bookings/${userId}/${bookingId}`);
};


export const createBookingClientApi = async (userId, bookingDto, holdId = null) => {
    return await axiosClient.post(`/user/tour-bookings/${userId}`, bookingDto, {
        params: holdId ? { holdId } : {},
    });
};


export const cancelBookingClientApi = async (userId, bookingId) => {
    return await axiosClient.put(`/user/tour-bookings/${userId}/${bookingId}/cancel`);
};


export const reserveSeatsApi = async (userId, reserveDto) => {
    return await axiosClient.post(`/user/tour-bookings/${userId}/reserve`, reserveDto);
};


export const releaseReservationApi = async (userId, holdId) => {
    return await axiosClient.delete(`/user/tour-bookings/${userId}/reserve/${holdId}`);
};


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

export const getTourBookingDetailAdminApi = async (bookingId) => {
    return await axiosClient.get(`/admin/tour-bookings/${bookingId}`);
};


export const approveBookingAdminApi = async (bookingId, employeeId) => {
    return await axiosClient.put(`/admin/tour-bookings/${bookingId}/approve`, null, {
        params: { employeeId },
    });
};


export const cancelBookingAdminApi = async (id, lyDoHuy) => {
    const response = await axiosClient.post(`/admin/tour-bookings/cancel/${id}`, null, {
        params: { lyDoHuy }
    });
    return response.data;
};
export const updatePaymentStatusAdminApi = async (bookingId, isPaid) => {
    return await axiosClient.put(`/admin/tour-bookings/${bookingId}/payment-status`, isPaid, {
        headers: { "Content-Type": "application/json" },
    });
};


export const updateBookingStatusAdminApi = async (bookingId, statusId) => {
    return await axiosClient.put(`/admin/tour-bookings/${bookingId}/status`, null, {
        params: { status: statusId },
    });
};


export const createBookingAdminApi = async (createAdminDto) => {
    return await axiosClient.post("/admin/tour-bookings", createAdminDto);
};


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


export const completeBookingAdminApi = async (maDonDatTour) => {
    const response = await axiosClient.put(
        `/admin/tour-bookings/${maDonDatTour}/complete`
    );
    return response.data;
};
export const printContractsByIdsApi = (maDonDatTours) =>
    axiosClient.post(
        '/admin/tour-bookings/print-contract',
        { maDonDatTours },
        { responseType: 'blob' }
    );

export const printContractsByChuyenApi = (maChuyen) =>
    axiosClient.get(
        `/admin/tour-bookings/print-contract/by-chuyen/${maChuyen}`,
        { responseType: 'blob' }
    );