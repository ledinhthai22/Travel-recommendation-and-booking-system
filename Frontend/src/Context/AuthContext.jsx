import { createContext, useCallback, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
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
            const status = error?.response?.status;

            if (status === 401 || status === 403) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                localStorage.removeItem("refreshToken");
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

    const logout = useCallback(async () => {
        const refreshToken =
            localStorage.getItem("refreshToken");

        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");

        setUser(null);

        try {
            if (refreshToken) {
                await logoutApi(refreshToken);
            }
        } catch (err) {
            console.log(err);
        }
    }, []);

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