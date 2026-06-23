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
    search = ''
) => {
    const reponse = await axiosClient.get(
        "/customer/UserProfile/history",
        {
            params: { page, pageSize, search: search || undefined }
        }
    );
    return reponse.data;
};

export const getHistoryDetailApi = async (id) => {
    const response = await axiosClient.get(`/customer/UserProfile/history/${id}`);
    return response.data;
};

export const cancelBookingApi = async (id) => {
    const response = await axiosClient.post(`/customer/UserProfile/cancel/${id}`);
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



