import axiosClient from "./axiosClient";

const logService = {
    getLogsPage: async (page = 1, size = 10, key = '', accountType = '', accountId = null) => {
        const response = await axiosClient.get('/admin/Log', {
            params: {
                page,
                size,
                key: key || undefined,
                accountType: accountType || undefined,
                accountId: accountId || undefined
            }
        });
        return response.data;
    },

    getLogById: async (id) => {
        const response = await axiosClient.get(`/admin/Log/${id}`);
        return response.data;
    }
};

export default logService;