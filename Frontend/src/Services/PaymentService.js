import axiosClient from "./axiosClient";


export const createRemainingPaymentApi = async (maDonDatTour) => {
    const response = await axiosClient.post(`/client/payment/create-remaining-payment/${maDonDatTour}`);
    return response.data;
};


export const getPaymentStatusApi = async (txnRef) => {
    const response = await axiosClient.get(`/client/payment/status/${txnRef}`);
    return response.data;
};