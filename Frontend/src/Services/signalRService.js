// services/signalRConnection.js
import * as signalR from "@microsoft/signalr";

const URL = import.meta.env.VITE_SIGNAL_URL;

export const connection = new signalR.HubConnectionBuilder()
    .withUrl(`${URL}/TravelRecommendationHub`, {
        accessTokenFactory: () => localStorage.getItem("token") // nếu Hub cần auth, chỉnh theo cách bạn lưu token
    })
    .withAutomaticReconnect()
    .build();

let startPromise = null;

// Đảm bảo chỉ có 1 lệnh start() chạy tại 1 thời điểm, dùng chung cho cả app
export const ensureConnectionStarted = () => {
    if (connection.state === signalR.HubConnectionState.Connected) {
        return Promise.resolve();
    }
    if (!startPromise) {
        startPromise = connection.start().catch(err => {
            startPromise = null; // cho phép retry nếu lỗi
            throw err;
        });
    }
    return startPromise;
};

// Join lại group mỗi khi (re)connect thành công — bắt buộc vì connectionId đổi sau reconnect
export const joinNotificationGroup = async (role, userId) => {
    await ensureConnectionStarted();
    if (role === "admin") {
        await connection.invoke("JoinAdminGroup");
    } else if (userId) {
        await connection.invoke("JoinUserGroup", String(userId));
    }
};