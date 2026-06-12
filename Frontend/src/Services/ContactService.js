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
    pageSize = 10,
    key='',
    status=null
) => {
    const response = await axiosClient.get(
        "/admin/Contact/get-contact",
        {
            params: { pageNumber, pageSize, Key: key|| undefined, status: status ?? undefined }
        }
    );

    return response.data;
};

export const getContactByIdApi = async (id) => {
    const response = await axiosClient.get(
        `/admin/Contact/${id}`,
    );
    return response.data;
};

export const softDeleteContactApi = async (id) => {
    const response = await axiosClient.delete(
        `/admin/Contact/${id}`,
    );
    return response.data;
};