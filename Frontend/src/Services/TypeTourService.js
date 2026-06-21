import axiosClient from "./axiosClient";


export const getAllTypeTourApi = async () => {
    const response = await axiosClient.get(
        "/admin/TypeTour/get-all"
    );

    return response.data;
};


export const getTypeTourApi = async (
    pageNumber = 1,
    pageSize = 8,
    key = "",
    status = null
) => {
    const response = await axiosClient.get(
        "/admin/TypeTour/get-typetour",
        {
            params: {
                pageNumber,
                pageSize,
                key: key || undefined,
                status: status ?? undefined
            }
        }
    );

    return response.data;
};


export const createTypeTourApi = async (
    formData
) => {
    const response = await axiosClient.post(
        "/admin/TypeTour/create-typetour",
        formData,
        {
            headers: {
                "Content-Type":
                    "multipart/form-data"
            }
        }
    );

    return response.data;
};


export const updateTypeTourApi = async (
    id,
    formData
) => {
    const response = await axiosClient.put(
        `/admin/TypeTour/${id}`,
        formData,
        {
            headers: {
                "Content-Type":
                    "multipart/form-data"
            }
        }
    );

    return response.data;
};


export const deleteTypeTourApi = async (
    id
) => {
    const response = await axiosClient.delete(
        `/admin/TypeTour/${id}`
    );

    return response.data;
};