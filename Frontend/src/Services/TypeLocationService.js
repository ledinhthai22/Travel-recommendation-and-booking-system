import axiosClient from "./axiosClient";

export const getAllTypeLocationApi = async () => {
    const response = await axiosClient.get("/admin/TypeLocation/get-all");
    return response.data;
};
export const getTypeLocationListApi = async (pageNumber = 1, pageSize = 9, key = '') => {
    const response = await axiosClient.get("/admin/TypeLocation/get-typelocation", {
        params: { pageNumber, pageSize, key: key || undefined }
    });
    return response.data;
};

export const createTypeLocationApi = async (data) => {
    const response = await axiosClient.post("/admin/TypeLocation/create-typelocation", data);
    return response.data;
};

export const updateTypeLocationApi = async (id, data) => {
    const response = await axiosClient.put(`/admin/TypeLocation/${id}`, data);
    return response.data;
};

export const deleteTypeLocationApi = async (id) => {
    const response = await axiosClient.delete(`/admin/TypeLocation/${id}`);
    return response.data;
};
