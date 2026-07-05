import axiosClient from "./axiosClient";

export const getUserProfileApi = async ()=>{
    const reponse = await axiosClient.get("/customer/UserProfile/me");
    return reponse.data
}

export const getOverviewApi = async ()=>{
    const reponse = await axiosClient.get("/customer/UserProfile/overview");
    return reponse.data
}

export const getHistoryApi = async (
    page = 1,
    pageSize = 5,
    search = '',
    status=null
) => {
    const reponse = await axiosClient.get(
        "/customer/UserProfile/history",
        {
            params: { page, pageSize, search: search || undefined ,status:status ||undefined}
        }
    );
    return reponse.data;
};

export const getHistoryDetailApi = async (id) => {
    const response = await axiosClient.get(`/customer/UserProfile/history/${id}`);
    return response.data;
};

// Sửa lại: backend nhận LyDoHuy qua query string, không phải body
export const cancelBookingApi = async (id, lyDoHuy) => {
    const response = await axiosClient.post(
        `/customer/UserProfile/cancel/${id}`,
        null,
        { params: { LyDoHuy: lyDoHuy } }
    );
    return response.data;
};

export const updateUserProfileApi = async (formData) => {
    const response = await axiosClient.put("/customer/UserProfile/me", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;    
};

export const changePasswordApi = async (data) => {
    const response = await axiosClient.post("/customer/UserProfile/change-password", data);
    return response.data;
};



export const getPendingRefundsApi = async (page = 1, pageSize = 10) => {
    const response = await axiosClient.get("/admin/refund/pending", {
        params: { page, pageSize }
    });
    return response.data;
};

export const confirmRefundApi = async (maThanhToan) => {
    const response = await axiosClient.post(`/admin/refund/confirm/${maThanhToan}`);
    return response.data;
};