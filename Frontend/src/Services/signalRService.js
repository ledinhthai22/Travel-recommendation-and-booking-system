import * as signalR from "@microsoft/signalr";

const URL = import.meta.env.VITE_SIGNAL_URL;

export const connection = new signalR.HubConnectionBuilder()
    .withUrl(`${URL}/TravelRecommendationHub`, {
        accessTokenFactory: () => localStorage.getItem("token")
    })
    .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
    .configureLogging(signalR.LogLevel.Information)
    .build();

let startPromise = null;

export const ensureConnectionStarted = () => {
    // Đã kết nối rồi, không cần làm gì thêm
    if (connection.state === signalR.HubConnectionState.Connected) {
        return Promise.resolve();
    }

    // Đang kết nối / reconnecting (bất kể do ai gọi trước) -> chờ chung
    if (connection.state !== signalR.HubConnectionState.Disconnected) {
        if (startPromise) {
            return startPromise;
        }

        // State đang dở dang nhưng không còn giữ được promise gốc
        // (vd: do HMR reload module) -> không gọi start() lại, chỉ chờ
        // connection chuyển sang Connected hoặc Disconnected hẳn.
        return new Promise((resolve, reject) => {
            const check = setInterval(() => {
                if (connection.state === signalR.HubConnectionState.Connected) {
                    clearInterval(check);
                    resolve();
                } else if (connection.state === signalR.HubConnectionState.Disconnected) {
                    clearInterval(check);
                    reject(new Error("SignalR: connection failed while waiting"));
                }
            }, 100);
        });
    }

    // Chỉ thực sự gọi start() khi chắc chắn đang Disconnected
    startPromise = connection.start()
        .then(() => {
            console.log('SignalR: Connected successfully');
            return connection;
        })
        .catch(err => {
            console.error('SignalR: Start failed:', err);
            startPromise = null;
            throw err;
        })
        .finally(() => {
            // Giải phóng promise sau khi kết nối xong (thành công hay thất bại)
            // để lần Disconnected tiếp theo có thể start lại bình thường.
            if (connection.state === signalR.HubConnectionState.Connected) {
                startPromise = null;
            }
        });

    return startPromise;
};

export const joinNotificationGroup = async (role, userId) => {
    try {
        await ensureConnectionStarted();

        if (connection.state !== signalR.HubConnectionState.Connected) {
            console.log('SignalR: Not connected, cannot join groups');
            return;
        }

        console.log(`SignalR: Joining group for role=${role}, userId=${userId}`);

        if (role === "admin") {
            await connection.invoke("JoinAdminGroup");
            if (userId) {
                await connection.invoke("JoinStaffGroup", String(userId));
                await connection.invoke("JoinGroup", `STAFF_${userId}`);
            }
            console.log(`SignalR: Joined admin groups`);
        } else if (role === "staff") {
            if (userId) {
                await connection.invoke("JoinStaffGroup", String(userId));
                await connection.invoke("JoinGroup", `STAFF_${userId}`);
                console.log(`SignalR: Joined STAFF_${userId}`);
            }
        } else if (userId) {
            await connection.invoke("JoinUserGroup", String(userId));
            await connection.invoke("JoinGroup", `USER_${userId}`);
            console.log(`SignalR: Joined USER_${userId}`);
        }
    } catch (err) {
        console.error('SignalR: Join group error:', err);
        throw err;
    }
};

export const leaveNotificationGroup = async (role, userId) => {
    try {
        if (connection.state !== signalR.HubConnectionState.Connected) {
            return;
        }

        if (role === "admin") {
            await connection.invoke("LeaveAdminGroup").catch(console.error);
            if (userId) {
                await connection.invoke("LeaveStaffGroup", String(userId)).catch(console.error);
                await connection.invoke("LeaveGroup", `STAFF_${userId}`).catch(console.error);
            }
        } else if (role === "staff" && userId) {
            await connection.invoke("LeaveStaffGroup", String(userId)).catch(console.error);
            await connection.invoke("LeaveGroup", `STAFF_${userId}`).catch(console.error);
        } else if (userId) {
            await connection.invoke("LeaveUserGroup", String(userId)).catch(console.error);
            await connection.invoke("LeaveGroup", `USER_${userId}`).catch(console.error);
        }
    } catch (err) {
        console.error('SignalR: Leave group error:', err);
    }
};