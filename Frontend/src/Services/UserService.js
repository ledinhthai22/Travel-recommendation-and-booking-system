import axiosClient from "./axiosClient";

export const getUserApi = async (
    pageNumber=1,
    pageSize=10,
    keyword='',
    status
) =>{
    const reponse =await axiosClient.get(
        "/admin/User/get-user",
        {
            params:{pageNumber,pageSize,keyword:keyword||undefined, status:status ??undefined}
        }
    );
    return reponse.data;
};

export const getUserDetailApi = async (id) => {
    const response = await axiosClient.get(`/admin/User/${id}`); 
    return response.data;
};

export const createUserApi = async (formData) => {
    const response = await axiosClient.post("/admin/User/create-user", formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

export const updateUserApi = async (id, formData) => {
    const response = await axiosClient.put(`/admin/User/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

export const lockUserApi = async (id) => {
    const response = await axiosClient.patch(`/admin/User/${id}/lock`);
    return response.data;
};

export const unlockUserApi = async (id) => {
    const response = await axiosClient.patch(`/admin/User/${id}/unlock`);
    return response.data;
};