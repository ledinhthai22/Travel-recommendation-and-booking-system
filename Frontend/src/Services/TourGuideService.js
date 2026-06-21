import axiosClient from "./axiosClient";

export const getAllTourGuideApi = async () => {
    return await axiosClient.get(
        "/admin/Staff/TourGuiDe"
    );
};