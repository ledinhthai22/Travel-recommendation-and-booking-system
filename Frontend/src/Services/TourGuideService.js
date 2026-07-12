import axiosClient from "./axiosClient";

export const getAllTourGuideApi = async (ngayKhoiHanh) => {
    return await axiosClient.get(
        "/admin/Staff/TourGuiDe",
        {
            params: {
                ngayKhoiHanh
            }
        }
    );
};