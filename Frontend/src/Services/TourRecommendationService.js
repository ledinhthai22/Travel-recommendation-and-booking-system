import axiosClient from "./axiosClient";

export const getJustForYouApi = async (limit = 8) => {
    const response = await axiosClient.get(
        "/customer/TourRecommendation/just-for-you",
        { params: { limit } }
    );
    return response.data;
};

export const getRecommendedToursApi = async (limit = 8) => {
    const response = await axiosClient.get(
        "/customer/TourRecommendation/for-you",
        { params: { limit } }
    );
    return response.data;
};


export const getDestinationsForYouApi = async (limit = 12) => {
    const response = await axiosClient.get(
        "/customer/TourRecommendation/destinations-for-you",
        { params: { limit } }
    );
    return response.data;
};

export const getNextTripSuggestionsApi = async (limit = 8) => {
    const response = await axiosClient.get(
        "/customer/TourRecommendation/next-trip",
        { params: { limit } }
    );
    return response.data;
};

export const trackViewTourApi = async (tourId) => {
    const response = await axiosClient.post(
        `/customer/TourRecommendation/track-view/${tourId}`
    );
    return response.data;
};

export const trackDeepInterestApi = async (tourId) => {
    const response = await axiosClient.post(
        `/customer/TourRecommendation/track-deep-interest/${tourId}`
    );
    return response.data;
};