import axiosClient from './axiosClient';

export const subscribeNewsletterApi = async (email) => {
    const response = await axiosClient.post(
        '/Newsletter/subscribe',
        {
            email,
        }
    );

    return response.data;
};