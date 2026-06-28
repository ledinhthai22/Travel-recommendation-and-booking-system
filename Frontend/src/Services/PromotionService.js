import axiosClient from './axiosClient';

export const getPromotionApi = async (
    pageNumber,
    pageSize,
    maCode = '',
    tenUuDai = '',
    trangThai = null
) => {
    const response = await axiosClient.get(
        '/admin/Promotion',
        {
            params: {
                pageNumber,
                pageSize,
                MaCode: maCode || undefined,
                TenUuDai: tenUuDai || undefined,
                TrangThai: trangThai ?? undefined
            }
        }
    );

    return response.data;
};

export const getPromotionByIdApi = async (id) => {
    const response = await axiosClient.get(
        `/admin/Promotion/${id}`
    );

    return response.data;
};

export const createPromotionApi = async (data) => {
    const response = await axiosClient.post(
        '/admin/Promotion',
        data
    );

    return response.data;
};

export const updatePromotionApi = async (id, data) => {
    const response = await axiosClient.put(
        `/admin/Promotion/${id}`,
        data
    );

    return response.data;
};

export const changePromotionStatusApi = async (
    id,
    isActive
) => {
    const response = await axiosClient.patch(
        `/admin/Promotion/${id}/status`,
        {
            isActive
        }
    );

    return response.data;
};

export const deletePromotionApi = async (id) => {
    const response = await axiosClient.delete(
        `/admin/Promotion/${id}`
    );

    return response.data;
};
export const getPromotionsForBookingApi = async (status = 1) => {
    const response = await axiosClient.get('/admin/Promotion/booking-select', {
        params: { status }
    });
    return response.data;
};