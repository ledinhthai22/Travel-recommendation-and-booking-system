import axiosClient from "./axiosClient";

export const getBestToursApi = async (limit = 4) => {
    const response = await axiosClient.get('/Home/get-best-tours', {
        params: { limit }
    });
    return response.data;
};

export const getLatestToursApi = async (limit = 4) => {
    const response = await axiosClient.get("/Home/tours-latest", {
        params: { limit }
    });
    return response.data;
};