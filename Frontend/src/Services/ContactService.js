import axiosClient from "./axiosClient";

export const sentContactApi = async (data) => {
    const response = await axiosClient.post(
        "/Contact/sen-contact",
        data
    );

    return response.data;
};