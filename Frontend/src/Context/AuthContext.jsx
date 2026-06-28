import { createContext, useCallback, useEffect, useState } from "react";
import {
    logoutApi,
    getMeApi,
    getStaffMeApi 
} from "~/Services/AuthService";

export const AuthContext = createContext();

const decodeToken = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join('')
        );

        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
};

export default function AuthProvider({ children }) {
    const [user, setUserState] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isStaff, setIsStaff] = useState(false);

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

            const decoded = decodeToken(token);
            const accountTypeFromToken = decoded?.account_type;

            let profile = null;

            if (accountTypeFromToken === "NhanVien") {
                setIsStaff(true);
                profile = await getStaffMeApi();
            } else {
                setIsStaff(false);
                profile = await getMeApi();
            }

            setUser(profile);

            localStorage.setItem(
                "user",
                JSON.stringify(profile)
            );

            localStorage.setItem(
                "account_type",
                accountTypeFromToken || "KhachHang"
            );

        } catch (error) {
            console.error("Lỗi tự động đăng nhập:", error);
            handleForceLogout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (res, isStaffLogin = false) => {
        localStorage.setItem("token", res.token);
        localStorage.setItem("refreshToken", res.refreshToken);

        const decoded = decodeToken(res.token);

        const actualType =
            decoded?.account_type ||
            (isStaffLogin ? "NhanVien" : "KhachHang");

        localStorage.setItem("account_type", actualType);

        setIsStaff(actualType === "NhanVien");

        let profile = null;

        if (actualType === "NhanVien") {
            profile = await getStaffMeApi();
        } else {
            profile = await getMeApi();
        }

        localStorage.setItem(
            "user",
            JSON.stringify(profile)
        );

        setUser(profile);

        return profile;
    };

    const handleForceLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        localStorage.removeItem("account_type");

        setUser(null);
        setIsStaff(false);
    };

    const logout = useCallback(async () => {
        const refreshToken = localStorage.getItem("refreshToken");

        handleForceLogout();

        try {
            if (refreshToken) {
                await logoutApi(refreshToken);
            }
        } catch (err) {
            console.log(err);
        }
    }, []);

    const refreshUser = async () => {
        const updatedData = await getProfileApi();
        setUser(updatedData);
    };

    const setUser = (newUser) => {
        if (newUser) {
            localStorage.setItem("user", JSON.stringify(newUser));
        } else {
            localStorage.removeItem("user");
        }
        setUserState(newUser); // Kích hoạt render lại
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
                refreshUser,
                showLoginModal,
                setShowLoginModal,
                isStaff
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}