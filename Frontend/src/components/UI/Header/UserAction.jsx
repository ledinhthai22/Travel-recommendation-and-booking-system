import AvatarDropdown from "./AvatarDropdown";
import useAuth from "~/Hooks/useAuth";
import NotificationPanel from "~/components/UI/Notification/NotificationPanel";

export default function UserActions({ onLoginClick, onLogout }) {
    const { user } = useAuth();

    if (!user) {
        return (
            <button
                onClick={onLoginClick}
                className="hidden md:block rounded-full bg-[#0EA5E5] px-5 py-2 text-sm font-semibold text-white hover:bg-[#0284c7] transition"
            >
                Đăng nhập
            </button>
        );
    }

    return (
        <div className="flex items-center gap-4">
            <NotificationPanel role="user" />
            <AvatarDropdown user={user} onLogout={onLogout} />
        </div>
    );
}