import { createContext, useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
    getMeApi,
    getStaffMeApi,
    refreshTokenApi,
    logoutApi
} from "~/Services/AuthService";

export const AuthContext = createContext();

export const apiClient = axios.create({
    baseURL: "YOUR_API_URL",
    withCredentials: true
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isStaff, setIsStaff] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false); 

    useEffect(() => {
        initAuth();
    }, []);

    const initAuth = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            await loadProfile();
        } catch (err) {
            console.log("Init auth error:", err);
        } finally {
            setLoading(false);
        }
    };

    const loadProfile = async () => {
        const accountType = localStorage.getItem("account_type");

        let profile;

        if (accountType === "NhanVien") {
            setIsStaff(true);
            profile = await getStaffMeApi();
        } else {
            setIsStaff(false);
            profile = await getMeApi();
        }

        setUser(profile);
        localStorage.setItem("user", JSON.stringify(profile));
        return profile
    };

    const refreshToken = async () => {
        const accessToken = localStorage.getItem("token");
        const refresh = localStorage.getItem("refreshToken");
        if (!refresh) throw new Error("No refresh token");

        const res = await refreshTokenApi(accessToken, refresh);

        localStorage.setItem("token", res.token);
        localStorage.setItem("refreshToken", res.refreshToken);

        return res.token;
    };

    const forceLogout = useCallback(async () => {
        const refresh = localStorage.getItem("refreshToken");

        try {
            if (refresh) await logoutApi(refresh);
        } catch { }

        localStorage.clear();
        setUser(null);
        setIsStaff(false);

        window.location.reload();
    }, []);

    const login = async (res, isStaffLogin = false) => {
        localStorage.setItem("token", res.token);
        localStorage.setItem("refreshToken", res.refreshToken);

        const decoded = JSON.parse(atob(res.token.split(".")[1]));

        const type =
            decoded?.account_type ||
            (isStaffLogin ? "NhanVien" : "KhachHang");

        localStorage.setItem("account_type", type);

        return await loadProfile();
    };

    useEffect(() => {
        const interceptor = apiClient.interceptors.response.use(
            res => res,
            async error => {
                const originalRequest = error.config;

                if (error.response?.status === 401 && !originalRequest._retry) {
                    if (isRefreshing) {
                        return new Promise((resolve, reject) => {
                            failedQueue.push({ resolve, reject });
                        }).then(token => {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            return apiClient(originalRequest);
                        });
                    }

                    originalRequest._retry = true;
                    isRefreshing = true;

                    try {
                        const newToken = await refreshToken();

                        apiClient.defaults.headers.common.Authorization =
                            `Bearer ${newToken}`;

                        processQueue(null, newToken);

                        return apiClient(originalRequest);
                    } catch (err) {
                        processQueue(err, null);
                        await forceLogout();
                        return Promise.reject(err);
                    } finally {
                        isRefreshing = false;
                    }
                }

                return Promise.reject(error);
            }
        );

        return () => {
            apiClient.interceptors.response.eject(interceptor);
        };
    }, [forceLogout]);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                login,
                forceLogout,
                loading,
                isAuthenticated: !!user,
                isStaff,
                apiClient,
                showLoginModal,      
                setShowLoginModal,    
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}