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
    key='',
    page=1,
    size=10
) => {
    const response = await axiosClient.get(
        "/admin/Newsletter/get-newsletter",
        {
            params: {
                key:key||undefined,
                page,
                size
            }
        }
    );

    return response.data;
};
export const SoftDetailNewsletterApi = async (id)=>{
    const reponse= await axiosClient.delete(
        `/admin/Newsletter/${id}`
    )
    return reponse.data;
} 