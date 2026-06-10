import axiosClient from "./axiosClient";

export const sentContactApi = async (data) => {
    const response = await axiosClient.post(
        "/Contact/sen-contact",
        data
    );

    return response.data;
};
export const getContactsApi = async (
    pageNumber = 1,
    pageSize = 10
) => {
    const response = await axiosClient.get(
        "/Contact",
        {
            params: {
                pageNumber,
                pageSize
            }
        }
    );

    return response.data;
};