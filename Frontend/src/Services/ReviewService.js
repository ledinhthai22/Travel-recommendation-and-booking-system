import axiosClient from "./axiosClient";

export const getReviewApi = async (
    page = 1,
    pageSize = 10,
    keyword = '',
    diem = null,
    trangthai = null
) => {
    const reponse = await axiosClient.get(
        "/admin/Review/get-review",
        {
            params: { page, pageSize, keyword: keyword || undefined, diem:diem || undefined, trangthai: trangthai ?? undefined }
        }
    );
    return reponse.data;
};

//API cập nhật trạng thái của 1 bình luận
export const updateReviewStatusApi = async (id, trangThai) => {
    const response = await axiosClient.patch(`/admin/Review/${id}/status`, {
        trangThai: trangThai
    });
    return response.data;
};

//API cập nhật trạng thái N bình luận
export const batchUpdateReviewStatusApi = async (maDanhGiaList, trangThai) => {
    const response = await axiosClient.patch("/admin/Review/batch-update-status", {
        MaDanhGiaList: maDanhGiaList,
        TrangThai: trangThai
    });
    return response.data;
};

export const getApprovedReviewsApi = async () => {
    const response = await axiosClient.get("/Review/approved");
    return response.data;
};

// thêm đánh giá
export const createReviewApi = async (reviewData) => {
    const response = await axiosClient.post("/customer/Review", {
        maNguoiDung: reviewData.maNguoiDung,
        maTour: reviewData.maTour,
        diemDanhGia: reviewData.diemDanhGia,
        noiDung: reviewData.noiDung
    });
    return response.data;
};