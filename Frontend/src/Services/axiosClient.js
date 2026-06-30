import axios from "axios";

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        error ? reject(error) : resolve(token);
    });
    failedQueue = [];
};

axiosClient.interceptors.response.use(
    (response) => response,

    async (error) => {
        const { response, config } = error;

        const noRefreshUrls = [
            "/auth/login",
            "/auth/register",
            "/auth/refresh-token",
            "/auth/reset-password",
        ];

        const isNoRefresh = noRefreshUrls.some((url) =>
            config?.url?.includes(url)
        );

        if (response?.status !== 401 || isNoRefresh) {
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then((newToken) => {
                config.headers.Authorization = `Bearer ${newToken}`;
                return axiosClient(config);
            });
        }

        isRefreshing = true;

        try {
            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) throw new Error("No refresh token");

            const { data } = await axios.post(
                `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
                { refreshToken },
                { withCredentials: true }
            );

            const newToken = data.token;
            const newRefreshToken = data.refreshToken;

            localStorage.setItem("token", newToken);
            if (newRefreshToken) {
                localStorage.setItem("refreshToken", newRefreshToken);
            }

            axiosClient.defaults.headers.common["Authorization"] =
                `Bearer ${newToken}`;

            processQueue(null, newToken);

            config.headers.Authorization = `Bearer ${newToken}`;
            return axiosClient(config);

        } catch (refreshError) {
            console.error("❌ Refresh thất bại:", refreshError?.response?.status, refreshError?.response?.data);
            processQueue(refreshError, null);

            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
            localStorage.removeItem("account_type");

            window.location.href = "/";
            return Promise.reject(refreshError);

        } finally {
            isRefreshing = false;
        }
    }
);

export default axiosClient;