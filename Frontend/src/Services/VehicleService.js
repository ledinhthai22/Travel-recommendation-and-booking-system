import axiosClient from "./axiosClient";

export const getAllVehicleApi = async () => {
    const response = await axiosClient.get("/admin/Vehicle");
    return response.data;
};

export const getVehiclePagingApi = async (
    pageNumber = 1,
    pageSize = 10,
    key = "",
    status = null
) => {
    const response = await axiosClient.get(
        "/admin/Vehicle/paging",
        {
            params: {
                pageNumber,
                pageSize,
                key: key || undefined,
                status
            }
        }
    );

    return response.data;
};

export const createVehicleApi = async (data) => {
    const response = await axiosClient.post(
        "/admin/Vehicle",
        data
    );

    return response.data;
};

export const updateVehicleApi = async (id, data) => {
    const response = await axiosClient.put(
        `/admin/Vehicle/${id}`,
        data
    );

    return response.data;
};

export const deleteVehicleApi = async (id) => {
    const response = await axiosClient.delete(
        `/admin/Vehicle/${id}`
    );

    return response.data;
};