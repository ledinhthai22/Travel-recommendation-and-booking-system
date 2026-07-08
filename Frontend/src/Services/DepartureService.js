import axiosClient from "./axiosClient";


export const createDepartureApi = async (
    data
) => {
    const response = await axiosClient.post(
        "/admin/Departure",
        data
    );

    return response.data;
};


// Sửa hàm updateDepartureApi để nhận và trả về dữ liệu mới
export const updateDepartureApi = async (maChuyen, payload) => {
    const response = await axiosClient.put(`/admin/departure/${maChuyen}`, payload);
    return response.data;

};
export const getDepartureByTourApi = async (
    maTour
) => {
    const response = await axiosClient.get(
        `/admin/Departure/tour/${maTour}`
    );

    return response.data;
};

export const deleteDepartureApi = async (
    maChuyen
) => {
    const response = await axiosClient.delete(
        `/admin/Departure/${maChuyen}`
    );

    return response.data;
};
export const getDeparturesForBookingApi = async (tourId = null, keyword = '') => {
    const response = await axiosClient.get('/admin/Departure/booking-select', {
        params: {
            tourId: tourId || undefined,
            keyword: keyword || undefined
        }
    });
    return response.data;
};