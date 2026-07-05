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

export const getToursForBookingSelectApi = async (
    keyword = '',
    status = 1
) => {
    const response = await axiosClient.get("/admin/Tour/booking-select", {
        params: {
            keyword: keyword || undefined,
            status: status ?? undefined
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

export const changeTourStatusApi = async (id, trangThai) => {
    const response = await axiosClient.patch(
        `/admin/Tour/${id}/status`,
        {
            trangThai
        }
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

export const getMyWishlistIdsApi = async () => {
    try {
        const response = await axiosClient.get(
            "/customer/WishList/wishlist-ids"
        );

        return response.data;
    } catch (error) {
        console.error("Lỗi lấy danh sách ID yêu thích:", error);
        return [];
    }
};

export const getWishlistApi = async (
    pageNumber = 1,
    pageSize = 10
) => {
    const response = await axiosClient.get(
        "/customer/WishList",
        {
            params: {
                pageNumber,
                pageSize
            }
        }
    );

    return response.data;
};

export const deleteWishlistApi = async (tourIds) => {
    const response = await axiosClient.delete(
        "/customer/WishList",
        {
            data: tourIds
        }
    );

    return response.data;
};
export const addToWishlistApi = async (tourId) => {
    const response = await axiosClient.post(
        `/customer/WishList/${tourId}`
    );

    return response.data;
};
    

export const getTourBySlugApi = async (slug) => {
    const response = await axiosClient.get(
        `/PublicTour/slug/${slug}`
    );

    return response.data;
};

export const getToursByLocationSlugApi = async (locationSlug) => {
    const response = await axiosClient.get(
        `/PublicTour/location/${locationSlug}`
    );

    return response.data;
};
export const filterTourApi = async ({
    keyword,
    maLoaiTour,
    minPrice,
    maxPrice,
    ngayTu,
    ngayDen,
    diemDen,
    pageNumber = 1,
    pageSize = 12,
}) => {
    const response = await axiosClient.get("/client/Search/filter", {
        params: {
            keyword: keyword || undefined,
            maLoaiTour: maLoaiTour || undefined,
            minPrice: minPrice || undefined,
            maxPrice: maxPrice || undefined,
            ngayTu: ngayTu ?? undefined,
            ngayDen: ngayDen ?? undefined,
            diemDen: diemDen || undefined,
            pageNumber,
            pageSize,
        },
    });

    return response.data;
};
export const getRelatedToursApi = async (maTour) => {
    const response = await axiosClient.get(
        `/PublicTour/${maTour}/related`
    );

    return response.data;
};
export const getRelatedToursByHotelApi = async (hotelId) => {
    const response = await axiosClient.get(
        `/PublicTour/${hotelId}/related-tours-hotel`
    );

    return response.data;
};