import axios from "axios";
const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

/**
 * Request Interceptor
 * Tự động gắn JWT Token
 */
axiosClient.interceptors.request.use(
    (config) => {

        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },

    (error) => Promise.reject(error)
);

/**
 * Response Interceptor
 * Xử lý lỗi 401, 403
 */
axiosClient.interceptors.response.use(
    (response) => response,

    (error) => {

        const { response, config } = error;

        if (
            response?.status === 401 ||
            response?.status === 403
        ) {

            const noRedirectUrls = [
                "/auth/login",
                "/auth/register",
                "/auth/refresh-token",
                "/auth/reset-password",
            ];

            const isNoRedirect =
                noRedirectUrls.some(
                    (url) =>
                        config?.url?.includes(url)
                );

            if (!isNoRedirect) {

                console.warn(
                    "Phiên đăng nhập hết hạn"
                );

                localStorage.removeItem("token");
                localStorage.removeItem("user");

                window.location.href = "/";
            }
        }

        return Promise.reject(error);
    }
);

export default axiosClient;