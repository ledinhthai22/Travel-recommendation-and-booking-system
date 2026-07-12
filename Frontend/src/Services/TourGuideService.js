import axiosClient from "./axiosClient";

export const getAllTourGuideApi = async (ngayKhoiHanh, ngayKetThuc, excludeMaChuyen) => {
    return await axiosClient.get(
        "/admin/Staff/TourGuiDe",
        {
            params: {
                ngayKhoiHanh,
                ngayKetThuc,
                excludeMaChuyen
            }
        }
    );
};