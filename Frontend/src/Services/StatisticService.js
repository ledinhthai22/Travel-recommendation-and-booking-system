import axiosClient from "./axiosClient";

export const StatisticService = {
    getOverview: async (year = null, month = null) => {
        const params = {};
        if (year) params.year = year;
        if (month !== null && month !== undefined) params.month = month;
        const response = await axiosClient.get("/statistics/overview", { params });
        return response.data;
    },

    getRevenueChart: async (year, month = null) => {
        const params = { year };
        if (month !== null && month !== undefined) params.month = month;
        const response = await axiosClient.get("/statistics/revenue-chart", { params });
        return response.data;
    },

    getOrderStatus: async (year = null, month = null) => {
        const params = {};
        if (year) params.year = year;
        if (month !== null && month !== undefined) params.month = month;
        const response = await axiosClient.get("/statistics/order-status", { params });
        return response.data;
    },

    getTopTours: async (limit = 5, year = null, month = null) => {
        const params = { limit };
        if (year) params.year = year;
        if (month !== null && month !== undefined) params.month = month;
        const response = await axiosClient.get("/statistics/top-tours", { params });
        return response.data;
    },

    getAgeGroups: async (year = null, month = null) => {
        const params = {};
        if (year) params.year = year;
        if (month !== null && month !== undefined) params.month = month;
        const response = await axiosClient.get("/statistics/age-groups", { params });
        return response.data;
    },

    getNewCustomersTrend: async (year = null, month = null) => {
        const params = {};
        if (year) params.year = year;
        if (month !== null && month !== undefined) params.month = month;
        const response = await axiosClient.get("/statistics/new-customers-trend", { params });
        return response.data;
    },

    getTourEngagement: async (year = null, month = null) => {
        const params = {};
        if (year) params.year = year;
        if (month !== null && month !== undefined) params.month = month;
        const response = await axiosClient.get("/statistics/tour-engagement", { params });
        return response.data;
    },

    getRecentTransactions: async (limit = 6, year = null, month = null) => {
        const params = { limit };
        if (year) params.year = year;
        if (month !== null && month !== undefined) params.month = month;
        const response = await axiosClient.get("/statistics/recent-transactions", { params });
        return response.data;
    },

    exportReport: async (year, month = null, fileName = null) => {
        const params = { year };
        if (month !== null && month !== undefined) params.month = month;

        try {
            const response = await axiosClient.get("/statistics/export-excel", {
                params,
                responseType: "blob",
            });

            const finalFileName = fileName || (month !== null && month !== undefined
                ? `BaoCaoThongKe_Thang${String(month).padStart(2, '0')}_${year}.xlsx`
                : `BaoCaoThongKe_Nam${year}.xlsx`);

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", finalFileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            return { success: true, fileName: finalFileName };
        } catch (error) {
            if (error.response?.data instanceof Blob) {
                try {
                    const text = await error.response.data.text();
                    throw new Error(text || "Xuất báo cáo thất bại.");
                } catch (parseError) {
                    throw new Error("Không thể đọc phản hồi từ server.");
                }
            }
            throw error;
        }
    },

    exportMonthlyReport: async (year, month) => {
        return StatisticService.exportReport(year, month);
    },

    exportYearlyReport: async (year) => {
        return StatisticService.exportReport(year, null);
    },

    getDashboardData: async (year = null, month = null) => {
        const currentYear = new Date().getFullYear();
        const targetYear = year || currentYear;
        
        try {
            const [overview, revenueChart, orderStatus, topTours, ageGroups, tourEngagement, transactions, newCustomersTrend] = 
                await Promise.all([
                    StatisticService.getOverview(year, month),
                    StatisticService.getRevenueChart(targetYear, month),
                    StatisticService.getOrderStatus(year, month),
                    StatisticService.getTopTours(5, year, month),
                    StatisticService.getAgeGroups(year, month),
                    StatisticService.getTourEngagement(year, month),
                    StatisticService.getRecentTransactions(6, year, month),
                    StatisticService.getNewCustomersTrend(targetYear, month)
                ]);

            return {
                overview,
                revenueChart,
                orderStatus,
                topTours,
                ageGroups,
                tourEngagement,
                transactions,
                newCustomersTrend,
                filters: { year, month }
            };
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu dashboard:", error);
            throw error;
        }
    },

    getAvailableYears: (startYear = 2020) => {
        const currentYear = new Date().getFullYear();
        const start = Math.min(startYear, currentYear);
        const years = [];
        for (let y = start; y <= currentYear; y++) {
            years.push(y);
        }
        return years;
    },

    getAvailableMonths: (year = null) => {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;
        const maxMonth = (year === currentYear) ? currentMonth : 12;
        
        return Array.from({ length: maxMonth }, (_, i) => ({
            value: i + 1,
            label: `Tháng ${i + 1}`
        }));
    },

    getMonthOptionsWithAll: (year = null) => {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;
        const maxMonth = (year === currentYear) ? currentMonth : 12;
        
        const options = [
            { value: "", label: "Tất cả các tháng" }
        ];
        
        for (let i = 1; i <= maxMonth; i++) {
            options.push({
                value: i,
                label: `Tháng ${i}`
            });
        }
        
        return options;
    },

    formatRevenueChartData: (data) => {
        if (!data || !data.data) return [];
        return data.data.map(item => ({
            label: item.month || item.label,
            value: item.revenue || item.value || 0
        }));
    },

    formatOrderStatusData: (data) => {
        if (!data || !Array.isArray(data)) return [];
        return data.map(item => ({
            name: item.statusName || item.name,
            value: item.count || item.value || 0,
            percentage: item.percentage || 0,
            color: item.color || '#6B7280'
        }));
    },

    formatTopToursData: (data) => {
        if (!data || !Array.isArray(data)) return [];
        return data.map((item, index) => ({
            rank: index + 1,
            id: item.maTour || item.id,
            name: item.tenTour || item.name,
            bookings: item.bookedCount || item.bookings || 0,
            revenue: item.revenue || 0
        }));
    },

    formatAgeGroupsData: (data) => {
        if (!data || !Array.isArray(data)) return [];
        return data.map(item => ({
            group: item.groupName || item.group,
            count: item.count || 0,
            percentage: item.percentage || 0
        }));
    },

    formatTransactionsData: (data) => {
        if (!data || !Array.isArray(data)) return [];
        return data.map(item => ({
            id: item.maDon || item.id,
            customer: item.customerName || item.customer,
            tour: item.tourName || item.tour,
            amount: item.amount || 0,
            status: item.status,
            time: item.time ? new Date(item.time) : null
        }));
    },

    formatNewCustomersTrendData: (data) => {
        if (!data || !Array.isArray(data)) return [];
        return data.map(item => ({
            label: item.month || item.label,
            customerCount: item.customerCount || 0,
            maleCount: item.maleCount || 0,
            femaleCount: item.femaleCount || 0,
            unknownCount: item.unknownCount || 0,
            day: item.day || null
        }));
    },

    formatOverviewData: (data) => {
        if (!data) return null;
        return {
            totalBookings: data.totalBookings || 0,
            totalRevenue: data.totalRevenue || 0,
            totalPassengers: data.totalPassengers || 0,
            activeTours: data.activeTours || 0,
            bookingGrowthPercent: data.bookingGrowthPercent,
            revenueGrowthPercent: data.revenueGrowthPercent,
            passengerGrowthPercent: data.passengerGrowthPercent,
            activeToursGrowthPercent: data.activeToursGrowthPercent
        };
    },

    formatCurrency: (amount, currency = 'đ') => {
        if (amount === null || amount === undefined) return `0 ${currency}`;
        return amount.toLocaleString('vi-VN') + ' ' + currency;
    },

    formatPercent: (value) => {
        if (value === null || value === undefined) return 'N/A';
        return `${value >= 0 ? '+' : ''}${value}%`;
    },

    getChartColor: (index) => {
        const palette = ["#0EA5E9", "#8B5CF6", "#F59E0B", "#10B981", "#F43F5E", "#64748B", "#14B8A6", "#F97316"];
        return palette[index % palette.length];
    }
};

export default StatisticService;