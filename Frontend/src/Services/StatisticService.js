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

    // ═══════════════════════════════════════════════════
    //  XUẤT BÁO CÁO EXCEL (.xlsx) — THEO THÁNG HOẶC CẢ NĂM
    // ═══════════════════════════════════════════════════
    exportReport: async (year, month = null) => {
        const params = { year };
        if (month) params.month = month;

        try {
            const response = await axiosClient.get("/statistics/export-excel", {
                params,
                responseType: "blob",
            });

            const fileName = month
                ? `BaoCaoThongKe_Thang${month}_${year}.xlsx`
                : `BaoCaoThongKe_Nam${year}.xlsx`;

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            // Response lỗi khi responseType=blob vẫn là Blob, phải đọc lại thành text
            if (error.response?.data instanceof Blob) {
                const text = await error.response.data.text();
                throw new Error(text || "Xuất báo cáo thất bại.");
            }
            throw error;
        }
    },
};

export default StatisticService;