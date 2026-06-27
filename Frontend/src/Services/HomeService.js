import axiosClient from "./axiosClient";

export const getTopDestinationsApi = async () =>{
    const reponse = await axiosClient.get('/Home/get-top-destinations');
    return reponse.data;
}

export const getBestToursApi = async () => {
    const response = await axiosClient.get('/Home/get-best-tours');
    return response.data;
};