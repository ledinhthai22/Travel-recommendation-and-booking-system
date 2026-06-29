import axios from "axios";

const API_URL = "https://provinces.open-api.vn/api/v2";

export const getProvincesApi = async () => {
    const response = await axios.get(`${API_URL}/`);
    return response.data;
};