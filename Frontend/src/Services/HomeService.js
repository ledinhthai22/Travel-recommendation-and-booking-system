import axiosClient from "./axiosClient";


export const getFeaturedToursApi = async (take = 12) => {
    const response = await axiosClient.get('/customer/home/featured', {
        params: { take }
    });
    return response.data;
};


export const getNewlyUpdatedToursApi = async (take = 12) => {
    const response = await axiosClient.get('/customer/home/new-updated', {
        params: { take }
    });
    return response.data;
};


export const getToursByDestinationApi = async (diemDen, take = 6) => {
    const response = await axiosClient.get(`/customer/home/destination/${encodeURIComponent(diemDen)}`, {
        params: { take }
    });
    return response.data;
};
export const getMostBookedToursApi = async (take = 8) => {
    const response = await axiosClient.get(
        "/customer/home/most-booked",
        { params: { take } }
    );

    return response.data;
};
