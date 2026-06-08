import axiosClient from "./axiosClient";

export const loginApi = async (data) => {
    const response = await axiosClient.post(
        "/auth/login",
        data
    );

    return response.data;
};

export const registerApi = async (data) => {
    const response = await axiosClient.post(
        "/auth/register",
        data
    );

    return response.data;
};
export const logoutApi = async (refreshToken) => {
    const res = await axiosClient.post("/auth/logout", {
        refreshToken,
    });

    return res.data;
};
export const resetPasswordApi = async (data) => {
    const res = await axiosClient.post("/auth/reset-password", {
        email: data.email,
        otp: data.otp,
        newPassword: data.newPassword,
    });

    return res.data;
};
export const forgotPasswordApi = async (email) => {
    const res = await axiosClient.post(
        "/auth/forgot-password",
        {
            email
        }
    );

    return res.data;
};      
export const verifyOtpApi = async (data) => {
    const res = await axiosClient.post(
        "/auth/verify-otp",
        {
            email: data.email,
            otp: data.otp
        }
    );

    return res.data;
};
export const getMeApi = async () => {
    const res = await axiosClient.get("/auth/me");
    return res.data;
};
