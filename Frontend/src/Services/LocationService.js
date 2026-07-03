import axiosClient from "./axiosClient";
export const getLocatioListApi = async () => {
    const response = await axiosClient.get(
        "/admin/Location"
    );

    return response.data;
};
export const getLocationApi = async (
    pageNumber = 1,
    pageSize = 10,
    key='',
    status=null
) => {
    const response = await axiosClient.get(
        "/admin/Location/get-location",
        {
            params: { pageNumber, pageSize, Key: key|| undefined, status: status ?? undefined }
        }
    );

    return response.data;
};

export const createLocationApi = async (formData) => {
    const response = await axiosClient.post("/admin/Location/create-location", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
};

export const updateLocationApi = async (id, formData) => {
    const response = await axiosClient.put(`/admin/Location/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
};
export const deleteLocationApi = async (id) => {
    const response = await axiosClient.delete(`/admin/Location/${id}`);
    return response.data;
};
export const getHomeLocationCardsApi = async (limit = 4) => {
    const response = await axiosClient.get("/PublicLocation/cards", {
        params: { limit }
    });
    return response.data;
};

export const updateLocationStatusApi = async (
    id,
    status
) => {
    const response = await axiosClient.patch(
        `/admin/Location/${id}/status`,
        status
    );

    return response.data;
};
export const getLocationsByProvinceApi = async (
    tinhThanh
) => {
    const response = await axiosClient.get(
        "/admin/Location/dropdown-by-province",
        {
            params: { tinhThanh }
        }
    );

    return response.data;
};