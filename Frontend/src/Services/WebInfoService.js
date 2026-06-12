import axiosClient from "./axiosClient";

export const getWebInfoSettingsApi = async () => {
    const response = await axiosClient.get(
        "/publicWebInfo/settings"
    );

    return response.data;
};

export const getWebInfoApi = async (
    pageNumber = 1,
    pageSize = 10,
    key = '',
    trangThai = null
) => {
    const response = await axiosClient.get("/admin/webinfo", {
        params: {
            pageNumber,
            pageSize,
            Key: key|| undefined,
            trangThai: trangThai ?? undefined
        }
    });

    return response.data;
};

export const getWebInfoByIdApi = async (id) => {
    const response = await axiosClient.get(
        `/admin/webinfo/${id}`
    );

    return response.data;
};


export const updateWebInfoApi = async (
    id,
    formData
) => {
    const response = await axiosClient.put(
        `/admin/webinfo/${id}`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

    return response.data;
};


export const updateWebInfoStatusApi = async (
    id,
    trangthai
) => {
    const response = await axiosClient.patch(
        `/admin/webinfo/${id}/status`,
        trangthai,
        {
            headers: {
                "Content-Type": "application/json"
            }
        }
    );

    return response.data;
};

export const clearWebInfoContentApi = async (id) => {
    const res = await axiosClient.delete(`/admin/webinfo/${id}/content`);
    return res.data;
};
