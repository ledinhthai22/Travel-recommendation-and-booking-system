import axiosClient from "./axiosClient";
export const getBannerApi= async (
    pageNumber=1,
    pageSize=10,
    key=''
)=>{
    const reponse =await axiosClient.get(
        "/admin/Banner/get-banner",
        {
            params:{pageNumber,pageSize,key:key||undefined}
        }
    );
    return reponse.data;
};

export const softDeleteBannerApi = async (id) => {
    const response = await axiosClient.delete(`/admin/Banner/${id}`);
    return response.data;
};