import axiosClient from "./axiosClient";

export const StatisticService = {
    getOverview: async (year = null, month = null) => {
        const params = {};
        if (year) params.year = year;
        if (month) params.month = month;
        const response = await axiosClient.get("/statistics/overview", { params });
        return response.data;
    },

    getRevenueChart: async (year = 2026) => {
        const response = await axiosClient.get(`/statistics/revenue-chart?year=${year}`);
        return response.data;
    },

    getOrderStatus: async (year = null, month = null) => {
        const params = {};
        if (year) params.year = year;
        if (month) params.month = month;
        const response = await axiosClient.get("/statistics/order-status", { params });
        return response.data;
    },

    getTopTours: async (limit = 5, year = null, month = null) => {
        const params = { limit };
        if (year) params.year = year;
        if (month) params.month = month;
        const response = await axiosClient.get("/statistics/top-tours", { params });
        return response.data;
    },

    getAgeGroups: async () => {
        const response = await axiosClient.get("/statistics/age-groups");
        return response.data;
    },

    getNewCustomersTrend: async (year = 2026) => {
        const response = await axiosClient.get(`/statistics/new-customers-trend?year=${year}`);
        return response.data;
    },

    getTourEngagement: async (year = null, month = null) => {
        const params = {};
        if (year) params.year = year;
        if (month) params.month = month;
        const response = await axiosClient.get("/statistics/tour-engagement", { params });
        return response.data;
    },
    getRecentTransactions: async (limit = 6) => {
        const response = await axiosClient.get("/statistics/recent-transactions", { params: { limit } });
        return response.data;
    },
};

export default StatisticService;