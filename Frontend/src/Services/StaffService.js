import axiosClient from "./axiosClient";

export const getStaffApi = async (
    pageNumber = 1,
    pageSize = 10,
    hoTen = '',
    email = '',
    soDienThoai = '',
    trangThai = null
) => {
    const response = await axiosClient.get(
        "/admin/staff",
        {
            params: {
                pageNumber,
                pageSize,
                HoTen: hoTen || undefined,
                Email: email || undefined,
                SoDienThoai: soDienThoai || undefined,
                TrangThai: trangThai ?? undefined
            }
        }
    );

    return response.data;
};


export const getStaffByIdApi = async (id) => {
    const response = await axiosClient.get(
        `/admin/staff/${id}`
    );

    return response.data;
};


export const createStaffApi = async (
    formData
) => {
    const response = await axiosClient.post(
        "/admin/staff",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

    return response.data;
};


export const updateStaffApi = async (
    id,
    formData
) => {
    const response = await axiosClient.put(
        `/admin/staff/${id}`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

    return response.data;
};


export const deleteStaffApi = async (
    id
) => {
    const response = await axiosClient.delete(
        `/admin/staff/${id}`
    );

    return response.data;
};


export const updateStaffStatusApi = async (
    id,
    trangThai
) => {
    const response = await axiosClient.patch(
        `/admin/staff/${id}/status`,
        trangThai,
        {
            headers: {
                "Content-Type": "application/json"
            }
        }
    );

    return response.data;
};
export const resetStaffPasswordApi = async (
    id,
    newPassword
) => {
    const response = await axiosClient.patch(
        `/admin/staff/${id}/reset-password`,
        {
            newPassword
        }
    );

    return response.data;
};