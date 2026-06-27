import axiosClient from './axiosClient';


export const getHotelListApi = async () => {
    const response = await axiosClient.get(
        "/admin/hotel"
    );

    return response.data;
};

export const getHotelApi = async (
    pageNumber,
    pageSize,
    tenKhachSan = '',
    diaChi = '',
    soDienThoai = '',
    soSao = null,
    trangThai = null
) => {
    const response = await axiosClient.get(
        '/admin/Hotel/Paged',
        {
            params: {
                pageNumber,
                pageSize,
                TenKhachSan: tenKhachSan || undefined,
                DiaChi: diaChi || undefined,
                SoDienThoai: soDienThoai || undefined,
                soSao : soSao || undefined,
                TrangThai: trangThai ?? undefined
            }
        }
    );

    return response.data;
};

export const getHotelByIdApi = async (id) => {
    const response = await axiosClient.get(
        `/admin/Hotel/${id}`
    );

    return response.data;
};
export const getHotelBySlugApi = async (slug) => {
    const response = await axiosClient.get(
        `/PublicHotel/${slug}`
    );

    return response.data;
};

export const createHotelApi = async (formData) => {
    const response = await axiosClient.post("/admin/Hotel", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const updateHotelApi = async (
    id,
    formData
) => {
    const response = await axiosClient.put(
        `/admin/Hotel/${id}`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
    );

    return response.data;
};

export const changeHotelStatusApi = async (
    id,
    trangThai
) => {
    const response = await axiosClient.patch(
        `/admin/Hotel/${id}/status`,
        {
            trangThai
        }
    );

    return response.data;
};

export const deleteHotelApi = async (id) => {
    const response = await axiosClient.delete(
        `/admin/Hotel/${id}`
    );

    return response.data;
};

export const setMainHotelImageApi = async (
    imageId
) => {
    const response = await axiosClient.patch(
        `/admin/Hotel/images/${imageId}/set-main`
    );

    return response.data;
};

export const deleteHotelImageApi = async (
    imageId
) => {
    const response = await axiosClient.delete(
        `/admin/Hotel/images/${imageId}`
    );

    return response.data;
};