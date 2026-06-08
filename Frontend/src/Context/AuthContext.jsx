import { createContext, useEffect, useState } from "react";
import {
    logoutApi,
    getMeApi
} from "~/Services/AuthService";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCurrentUser();
    }, []);

    const loadCurrentUser = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                setLoading(false);
                return;
            }

            const profile = await getMeApi();

            setUser(profile);
            localStorage.setItem(
                "user",
                JSON.stringify(profile)
            );
        } catch (error) {
            if (
                (response?.status === 401 ||
                    response?.status === 403) &&
                !config?.url?.includes("/auth/me")
            ) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                localStorage.removeItem("refreshToken");
                window.location.href = "/";
            }

            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (res) => {
        localStorage.setItem("token", res.token);
        localStorage.setItem("refreshToken", res.refreshToken);

        const profile = await getMeApi();

        localStorage.setItem(
            "user",
            JSON.stringify(profile)
        );

        setUser(profile);

        return profile;
    };

    const logout = async () => {
        try {
            const refreshToken =
                localStorage.getItem("refreshToken");

            if (refreshToken) {
                await logoutApi(refreshToken);
            }
        } catch (err) {
            console.log(err);
        }

        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");

        setUser(null);

        window.location.href = "/";
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                login,
                logout,
                loading,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}