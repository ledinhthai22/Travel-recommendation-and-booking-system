import axiosClient from "./axiosClient";

export const searchToursApi = async ({
    keyword,
    diemDen,
    ngayDi,
    ngayVe,
    maLoaiTour,
    minPrice,
    maxPrice,
    ngayTu,
    ngayDen,
    pageNumber = 1,
    pageSize = 12
}) => {
    const response = await axiosClient.get(
        "/PublicTour/search",
        {
            params: {
                keyword,
                diemDen,
                ngayDi,
                ngayVe,
                maLoaiTour,
                minPrice,
                maxPrice,
                ngayTu,
                ngayDen,
                pageNumber,
                pageSize
            }
        }
    );

    return response.data;
};