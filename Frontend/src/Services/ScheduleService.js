import axiosClient from "./axiosClient";

export const createScheduleApi = async (data) => {
    const response = await axiosClient.post(
        "/admin/Schedule",
        data,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

    return response.data;
};

export const getScheduleByTourApi = async (maTour) => {
    const response = await axiosClient.get(
        `/admin/Schedule/tour/${maTour}`
    );

    return response.data;
};

export const updateScheduleApi = async (
    maLichTrinh,
    data
) => {
    const response = await axiosClient.put(
        `/admin/Schedule/${maLichTrinh}`,
        data,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

    return response.data;
};

export const deleteScheduleApi = async (
    maLichTrinh
) => {
    const response = await axiosClient.delete(
        `/admin/Schedule/${maLichTrinh}`
    );

    return response.data;
};

// Schedule Detail

export const createScheduleDetailApi = async (
    data
) => {
    const response = await axiosClient.post(
        "/admin/Schedule/create-ScheduleDetail",
        data
    );

    return response.data;
};

export const getScheduleDetailApi = async (
    maLichTrinh
) => {
    const response = await axiosClient.get(
        `/admin/Schedule/by-Schedule/${maLichTrinh}`
    );

    return response.data;
};

export const updateScheduleDetailApi = async (
    maCTLT,
    data
) => {
    const response = await axiosClient.put(
        `/admin/Schedule/update-ScheduleDetail/${maCTLT}`,
        data
    );

    return response.data;
};

export const deleteScheduleDetailApi = async (
    maCTLT
) => {
    const response = await axiosClient.delete(
        `/admin/Schedule/delete-ScheduleDetail/${maCTLT}`
    );

    return response.data;
};