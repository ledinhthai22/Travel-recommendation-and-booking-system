import axiosClient from "./axiosClient";

export const getAmenitiesPageApi = async (pageNumber = 1, pageSize = 10, tenTienIch = '') => {
    const response = await axiosClient.get('/admin/Amenities/paged', {
        params: {
            pageNumber,
            pageSize,
         
            "TenTienIch": tenTienIch || undefined 
        }
    });
    return response.data;
};

export const getAmenitiesApi = async () => {
    const response = await axiosClient.get("/admin/Amenities");
    return response.data;
};

export const getAmenityByIdApi = async (id) => {
    const response = await axiosClient.get(`/admin/Amenities/${id}`);
    return response.data;
};

export const createAmenityApi = async (data) => {
    const response = await axiosClient.post("/admin/Amenities", data);
    return response.data;
};

export const updateAmenityApi = async (id, data) => {
    const response = await axiosClient.put(`/admin/Amenities/${id}`, data);
    return response.data;
};

export const deleteAmenityApi = async (id) => {
    const response = await axiosClient.delete(`/admin/Amenities/${id}`);
    return response.data;
};