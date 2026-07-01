import axiosClient from "./axiosClient";

const NotificationService = {

    async getMyNotifications(page = 1, pageSize = 20) {
        const { data } = await axiosClient.get("/notification/me", {
            params: { page, pageSize }
        });

        return data;
    },


    async getStaffNotifications(page = 1, pageSize = 20) {
        const { data } = await axiosClient.get("/notification/staff", {
            params: { page, pageSize }
        });

        return data;
    },


    async markAsRead(maThongBao) {
        const { data } = await axiosClient.post("/notification/mark-read", {
            maThongBao
        });

        return data;
    },


    async markAllAsRead() {
        const { data } = await axiosClient.post("/notification/mark-all-read");

        return data;
    },


    async getUnreadCount() {
        const { data } = await axiosClient.get("/notification/unread-count");

        return data;
    }
};

export default NotificationService;