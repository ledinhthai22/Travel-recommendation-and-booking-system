import axiosClient from "./axiosClient";

export const getUserProfileApi = async ()=>{
    const reponse = await axiosClient.get("/admin/UserProfile/me");
    return reponse.data
}
export const updateUserProfileApi = async (formData) => {
    const response = await axiosClient.put("/admin/UserProfile/me", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};