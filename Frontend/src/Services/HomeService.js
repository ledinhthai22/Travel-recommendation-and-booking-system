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

export const getRecommendedLocationsApi = async (limit = 4) => {
    const response = await axiosClient.get("/customer/Home/get-recommended", {
        params: { limit }
    });
    return response.data;
};

export const getTourDesignJustForYouApi = async (limit = 4) => {
    const response = await axiosClient.get("/customer/Home/get-tour-design", {
        params: { limit }
    });
    return response.data;
};

export const getRecommendedToursApi = async (limit = 4) => {
    const response = await axiosClient.get("/customer/Home/get-recommended-tours", {
        params: { limit }
    });
    return response.data;
};

export const getNextTripSuggestionsApi = async (limit = 4) => {
    const response = await axiosClient.get("/customer/Home/get-next-trip-suggestions", {
        params: { limit }
    });
    return response.data;
};

export const searchToursApi = async (params) => {
    const response = await axiosClient.get('/Home/search', { params });
    return response.data;
};

export const getCategoriesApi = async () => {
    const response = await axiosClient.get("/Home/get-categories");
    return response.data;
};