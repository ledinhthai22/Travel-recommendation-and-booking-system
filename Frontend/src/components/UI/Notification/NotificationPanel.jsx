import { useState, useEffect, useRef, useCallback } from "react";
import {
    Bell, Calendar, Mail, Newspaper,
    CreditCard, Tag, MessageSquare, ShieldAlert, CheckCircle2
} from "lucide-react";
import NotificationService from "~/Services/NotificationService";
import { connection, ensureConnectionStarted } from "~/Services/signalRService";
import useAuth from "~/Hooks/useAuth";
import { show } from "~/utils/Toast";

const NotificationType = {
    Booking: 1,
    Contact: 2,
    Newsletter: 3,
    Payment: 4,
    Promotion: 5,
    Review: 6,
    System: 7
};

const NotificationPanel = () => {
    const { user, isStaff } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const panelRef = useRef(null);
    const isFirstLoad = useRef(true);

    const getNotificationStyle = (type) => {
        switch (type) {
            case NotificationType.Booking:
                return { icon: <Calendar size={16} />, bg: "bg-blue-50 text-blue-600 border-blue-100" };
            case NotificationType.Contact:
                return { icon: <Mail size={16} />, bg: "bg-purple-50 text-purple-600 border-purple-100" };
            case NotificationType.Newsletter:
                return { icon: <Newspaper size={16} />, bg: "bg-teal-50 text-teal-600 border-teal-100" };
            case NotificationType.Payment:
                return { icon: <CreditCard size={16} />, bg: "bg-emerald-50 text-emerald-600 border-emerald-100" };
            case NotificationType.Promotion:
                return { icon: <Tag size={16} />, bg: "bg-amber-50 text-amber-600 border-amber-100" };
            case NotificationType.Review:
                return { icon: <MessageSquare size={16} />, bg: "bg-pink-50 text-pink-600 border-pink-100" };
            case NotificationType.System:
                return { icon: <ShieldAlert size={16} />, bg: "bg-rose-50 text-rose-600 border-rose-100" };
            default:
                return { icon: <Bell size={16} />, bg: "bg-slate-50 text-slate-600 border-slate-100" };
        }
    };

    const mapNotification = useCallback((n) => ({
        id: n.maThongBao,
        title: n.tieuDe,
        message: n.noiDung,
        time: n.ngayTao,
        read: n.daDoc,
        type: n.loaiThongBao,
        link: n.linkChiTiet
    }), []);

    const formatNotificationTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);

        if (minutes < 1) return "Vừa xong";
        if (minutes < 60) return `${minutes} phút trước`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} giờ trước`;

        return date.toLocaleString("vi-VN", {
            day: "2-digit", month: "2-digit", year: "numeric",
            hour: "2-digit", minute: "2-digit",
        });
    };

    const loadNotifications = useCallback(async () => {
        try {
            setLoading(true);
            const res = isStaff
                ? await NotificationService.getStaffNotifications()
                : await NotificationService.getMyNotifications();

            const rawList = Array.isArray(res) ? res : (res?.items || []);
            setNotifications(rawList.map(mapNotification));
        } catch (err) {
            console.error("Lỗi load notifications:", err);
        } finally {
            setLoading(false);
        }
    }, [isStaff, mapNotification]);

    const loadUnreadCount = useCallback(async () => {
        try {
            const res = await NotificationService.getUnreadCount();
            setUnreadCount(res?.unreadCount ?? 0);
        } catch (err) {
            console.error("Lỗi load unread count:", err);
        }
    }, []);

    useEffect(() => {
        loadNotifications();
        loadUnreadCount().then(() => {
            isFirstLoad.current = false;
        });
    }, [loadNotifications, loadUnreadCount]);

    useEffect(() => {
        let mounted = true;
        const userId = isStaff ? user?.maNhanVien : user?.maNguoiDung;

        const setupSignalR = async () => {
            try {
                await ensureConnectionStarted();
                if (!mounted) return;

                if (isStaff) {
                    await connection.invoke("JoinAdminGroup");
                    await connection.invoke("JoinStaffGroup", String(userId));
                    await connection.invoke("JoinGroup", `STAFF_${userId}`);
                } else if (userId) {
                    await connection.invoke("JoinUserGroup", String(userId));
                }
            } catch (err) {
                console.error("SignalR invoke error:", err);
            }
        };

        if (user) {
            setupSignalR();
        }

        const handleReconnect = () => {
            if (mounted) setupSignalR();
        };

        connection.onreconnected(handleReconnect);

        connection.on("JoinedGroup", (groupName) => {
            console.log(`Kết nối realtime thành công tới group: ${groupName}`);
        });

        return () => {
            mounted = false;
            connection.off("JoinedGroup");

            if (connection.state === "Connected") {
                if (isStaff) {
                    if (userId) {
                        connection.invoke("LeaveStaffGroup", String(userId)).catch(console.error);
                        connection.invoke("LeaveGroup", `STAFF_${userId}`).catch(console.error);
                    }
                    connection.invoke("LeaveAdminGroup").catch(console.error);
                } else if (userId) {
                    connection.invoke("LeaveUserGroup", String(userId)).catch(console.error);
                }
            }
        };
    }, [user, isStaff]);

    useEffect(() => {
        const handleReceiveNotification = (payload) => {
            const newNoti = mapNotification(payload);

            setNotifications(prev => {
                if (prev.some(n => n.id === newNoti.id)) return prev;
                setUnreadCount(count => count + 1);
                return [newNoti, ...prev];
            });

            const style = getNotificationStyle(newNoti.type);
            show({
                icon: style.icon,
                title: newNoti.title,
                message: newNoti.message,
                borderClass: "border-sky-100",
            });
        };

        const handleBookingCreated = (payload) => {
            const newNoti = {
                id: Date.now(),
                title: "Đơn đặt tour mới",
                message: `Đơn ${payload.maDatCho} - ${payload.tongTien?.toLocaleString() || 0}đ`,
                time: new Date().toISOString(),
                read: false,
                type: NotificationType.Booking,
                link: "/Quan-ly/Don-dat-cac-chuyen-di"
            };

            setNotifications(prev => {
                if (prev.some(n => n.id === newNoti.id)) return prev;
                setUnreadCount(count => count + 1);
                return [newNoti, ...prev];
            });

            show({
                icon: <Calendar size={16} />,
                title: newNoti.title,
                message: newNoti.message,
                borderClass: "border-sky-100",
            });
        };

        connection.on("ReceiveNotification", handleReceiveNotification);
        connection.on("BookingCreated", handleBookingCreated);

        return () => {
            connection.off("ReceiveNotification", handleReceiveNotification);
            connection.off("BookingCreated", handleBookingCreated);
        };
    }, [mapNotification]);

    const handleMarkAllAsRead = async () => {
        if (unreadCount === 0) return;
        try {
            await NotificationService.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error(err);
        }
    };

    const handleMarkOneAsRead = async (noti) => {
        if (noti.read) {
            if (noti.link) window.location.href = noti.link;
            return;
        }
        try {
            await NotificationService.markAsRead(noti.id);
            setNotifications(prev =>
                prev.map(n => n.id === noti.id ? { ...n, read: true } : n)
            );
            setUnreadCount(prev => Math.max(prev - 1, 0));
            if (noti.link) window.location.href = noti.link;
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block text-left" ref={panelRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 focus:outline-none cursor-pointer
                ${isOpen ? "text-sky-600" : "text-slate-600 hover:bg-slate-50"}`}
            >
                <span className="relative inline-flex">
                    <Bell size={16} />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
                    )}
                </span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-[400px] rounded-2xl border border-slate-100 bg-white shadow-2xl ring-1 ring-black/5 z-50 overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-50 p-4 bg-slate-50/50">
                        <div>
                            <h3 className="font-semibold text-slate-800 text-base">Thông báo</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Bạn có {unreadCount} thông báo chưa đọc</p>
                        </div>
                        {unreadCount > 0 && (
                            <button onClick={handleMarkAllAsRead} className="flex items-center gap-1 text-xs font-medium text-sky-600 bg-sky-50 border border-sky-100 px-2.5 py-1.5 rounded-lg hover:bg-sky-100 transition-colors">
                                <CheckCircle2 size={13} /> Đọc tất cả
                            </button>
                        )}
                    </div>

                    <div className="max-h-[400px] overflow-y-auto divide-y divide-slate-50">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
                                <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-sky-600" />
                                <span className="text-sm font-medium">Đang tải thông báo...</span>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-center">
                                <p className="text-sm font-medium text-slate-700">Hộp thư trống!</p>
                            </div>
                        ) : (
                            notifications.map(noti => {
                                const style = getNotificationStyle(noti.type);
                                return (
                                    <div
                                        key={noti.id}
                                        onClick={() => handleMarkOneAsRead(noti)}
                                        className={`flex gap-3.5 p-4 cursor-pointer transition-all duration-200 relative ${!noti.read ? "bg-sky-50/40 hover:bg-sky-50/70" : "hover:bg-slate-50"}`}
                                    >
                                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border shadow-sm ${style.bg}`}>
                                            {style.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className={`text-sm leading-snug break-words ${!noti.read ? "font-semibold text-slate-900" : "font-normal text-slate-700"}`}>
                                                    {noti.title}
                                                </p>
                                                {!noti.read && <span className="h-2 w-2 rounded-full bg-sky-500 shrink-0 mt-1.5" />}
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed break-words">{noti.message}</p>
                                            <p className="text-[11px] font-medium text-slate-400 mt-2">{formatNotificationTime(noti.time)}</p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationPanel;