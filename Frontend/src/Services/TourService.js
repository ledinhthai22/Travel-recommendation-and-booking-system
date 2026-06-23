import axiosClient from "./axiosClient";


export const getPagedToursApi = async (
    page = 1,
    pageSize = 10,
    key = "",
    status = null
) => {
    const response = await axiosClient.get("/admin/Tour/paged", {
        params: {
            page,
            pageSize,
            key: key || undefined,
            status
        }
    });

    return response.data;
};


export const getTourDetailApi = async (id) => {
    const response = await axiosClient.get(`/admin/Tour/${id}`);
    return response.data;
};


export const createFullTourApi = async (formData) => {
    const response = await axiosClient.post(
        "/admin/Tour/create-full",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

    return response.data;
};

export const updateFullTourApi = async (id, formData) => {
    const response = await axiosClient.put(
        `/admin/Tour/${id}`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

    return response.data;
};


export const deleteTourApi = async (id) => {
    const response = await axiosClient.delete(
        `/admin/Tour/${id}`
    );

    return response.data;
};


export const setMainTourImageApi = async (imageId) => {
    const response = await axiosClient.patch(
        `/admin/Tour/images/${imageId}/set-main`
    );

    return response.data;
};


export const deleteTourImageApi = async (imageId) => {
    const response = await axiosClient.delete(
        `/admin/Tour/images/${imageId}`
    );

    return response.data;
};


//tour yêu thích

export const getWishlistApi = async (pageNumber = 1, pageSize = 10) => {
    return await axiosClient.get(`/customer/Tour/wishlist`, {
        params: {
            pageNumber,
            pageSize
        }
    });
};

export const deleteWishlistApi = async (tourIds) => {
    return await axiosClient.delete(`/customer/Tour/wishlist`, {
        data: tourIds 
    });
};