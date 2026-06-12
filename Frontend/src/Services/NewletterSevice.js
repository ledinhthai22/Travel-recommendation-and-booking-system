import axiosClient from './axiosClient';

export const subscribeNewsletterApi = async (email) => {
    const response = await axiosClient.post(
        '/PublicNewsletter/subscribe',
        {
            email,
        }
    );

    return response.data;
};
export const getNewslettersApi = async (
    pageNumber = 1,
    pageSize = 10
) => {
    const response = await axiosClient.get(
        "/admin/Newsletter",
        {
            params: {
                pageNumber,
                pageSize
            }
        }
    );

    return response.data;
};