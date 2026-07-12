import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { Ticket, DollarSign, Users, Luggage, Calendar, TrendingUp, TrendingDown, Download } from "lucide-react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line,
} from "recharts";
import { Link } from "react-router-dom";
import StatisticService from "~/Services/StatisticService";
import SelectField from "~/components/UI/Form/SelectField";
import { toastError } from "~/utils/Toast";
import { getErrorMessage } from "~/utils/errorHelper";
import { formatCurrency } from "~/Helper/FormatCurrency";
import { connection, joinNotificationGroup } from "~/Services/signalRService";

const PIE_PALETTE = ["#0EA5E9", "#8B5CF6", "#F59E0B", "#10B981", "#F43F5E", "#64748B"];
const colorAt = (i) => PIE_PALETTE[i % PIE_PALETTE.length];
const formatVND = (value) => {
    const num = Number(value) || 0;
    const abs = Math.abs(num);

    const trim = (n) => {
        const fixed = n.toFixed(1);
        return fixed.endsWith(".0") ? fixed.slice(0, -2) : fixed;
    };

    if (abs >= 1_000_000_000) return `${trim(num / 1_000_000_000)} tỷ`;
    if (abs >= 1_000_000) return `${trim(num / 1_000_000)} tr`;
    if (abs >= 1_000) return `${trim(num / 1_000)}`;
    return num.toLocaleString("vi-VN");
};

const shortMonth = (month) => (typeof month === "string" ? month.replace("Tháng ", "T") : month);

const CustomTooltip = ({ active, payload, label, unit = "", formatter }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-lg px-4 py-2.5 text-sm z-50">
                {label && <p className="text-slate-500 mb-1 font-medium">{label}</p>}
                {payload.map((p, i) => (
                    <p key={i} style={{ color: p.color || p.fill }} className="font-semibold">
                        {formatter ? formatter(p.value) : p.value}{unit}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-lg px-4 py-2.5 text-sm z-50">
                <p className="text-slate-800 font-semibold">{data.name}</p>
                <p className="text-slate-500 mt-0.5 font-medium">
                    Tỷ lệ: <span className="text-sky-600 font-bold">{data.value}%</span>
                </p>
            </div>
        );
    }
    return null;
};

const PieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.07) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const KpiCard = React.memo(function KpiCard({ icon: Icon, color, label, value, delta, deltaType }) {
    return (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 flex flex-col gap-4">
            <div className="flex items-start justify-between">
                <div className={`w-11 h-11 rounded-xl ${color} text-white flex items-center justify-center`}>
                    <Icon size={20} />
                </div>
                <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${deltaType === "up" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
                    }`}>
                    {deltaType === "up" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {delta}
                </span>
            </div>
            <div>
                <p className="text-sm text-slate-500 mb-1">{label}</p>
                <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
                <p className="text-xs text-slate-400 mt-1">so với tháng trước</p>
            </div>
        </div>
    );
});

const StatusBadge = ({ status }) => {
    const map = {
        "Thành công": "bg-emerald-50 text-emerald-700",
        "Chờ thanh toán": "bg-amber-50 text-amber-700",
        "Thất bại": "bg-red-50 text-red-600",
        "Hoàn tiền": "bg-sky-50 text-sky-700",
    };
    return (
        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${map[status] ?? "bg-slate-50 text-slate-500"}`}>
            {status}
        </span>
    );
};

const PieLegend = ({ data }) => (
    <div className="mt-4 space-y-2.5">
        {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-slate-500">{item.name}</span>
                </div>
                <span className="text-xs font-semibold text-slate-700">{item.value}%</span>
            </div>
        ))}
    </div>
);

const renderDelta = (growth) => {
    if (growth === null || growth === undefined) return "Mới";
    return `${growth >= 0 ? "+" : ""}${growth}%`;
};

const deltaTypeOf = (growth) => (growth == null || growth >= 0 ? "up" : "down");

export default function Dashboard() {
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(String(currentYear));
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [overview, setOverview] = useState(null);
    const [revenueData, setRevenueData] = useState([]);
    const [orderStatusData, setOrderStatusData] = useState([]);
    const [newCustomersData, setNewCustomersData] = useState([]);
    const [topToursData, setTopToursData] = useState([]);
    const [ageGroupData, setAgeGroupData] = useState([]);
    const [recentTransactions, setRecentTransactions] = useState([]);

    const [loadingDashboard, setLoadingDashboard] = useState(true);
    const [exportMode, setExportMode] = useState("month"); // "month" | "year"
    const [isExporting, setIsExporting] = useState(false);

    const isFirstLoadRef = useRef(true);
    const debounceTimerRef = useRef(null);

    const fetchDashboardData = useCallback(async () => {
        if (isFirstLoadRef.current) setLoadingDashboard(true);
        try {
            const [
                overviewRes,
                revenueRes,
                orderStatusRes,
                topToursRes,
                ageGroupsRes,
                newCustomersRes,
                recentTransactionsRes,
            ] = await Promise.all([
                StatisticService.getOverview(Number(selectedYear), selectedMonth),
                StatisticService.getRevenueChart(Number(selectedYear)),
                StatisticService.getOrderStatus(Number(selectedYear), selectedMonth),
                StatisticService.getTopTours(5, Number(selectedYear), selectedMonth),
                StatisticService.getAgeGroups(),
                StatisticService.getNewCustomersTrend(Number(selectedYear)),
                StatisticService.getRecentTransactions(6),
            ]);

            setOverview(overviewRes);

            setRevenueData(revenueRes?.data ?? []);

            setOrderStatusData(
                (orderStatusRes || []).map((d, i) => ({
                    name: d.statusName ?? d.status ?? d.name ?? d.trangThai,
                    value: d.percentage ?? d.percent ?? d.value ?? 0,
                    color: d.color ?? colorAt(i),
                }))
            );

            setTopToursData(
                (topToursRes || []).map((d, i) => ({
                    name: d.tenTour ?? d.name ?? d.tourName,
                    booked: d.bookedCount ?? d.soLuotDat ?? d.booked ?? d.bookingCount ?? 0,
                    color: d.color ?? colorAt(i),
                }))
            );

            setAgeGroupData(
                (ageGroupsRes || []).map((d, i) => ({
                    name: d.groupName,
                    value: d.percentage,
                    color: colorAt(i),
                }))
            );

            {
                const fullYear = Array.from({ length: 12 }, (_, i) => ({
                    month: `Tháng ${i + 1}`,
                    customers: 0,
                }));
                (newCustomersRes || []).forEach((d) => {
                    const idx = fullYear.findIndex((m) => m.month === d.month);
                    if (idx !== -1) fullYear[idx].customers = d.customerCount ?? 0;
                });
                setNewCustomersData(fullYear);
            }

            setRecentTransactions(
                (recentTransactionsRes || []).map((t) => ({
                    id: `#${t.maDon}`,
                    customer: t.customerName,
                    tour: t.tourName,
                    amount: (t.amount ?? 0).toLocaleString("vi-VN") + "đ",
                    status: t.status,
                    time: t.time
                        ? new Date(t.time).toLocaleString("vi-VN", {
                            day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit",
                        })
                        : "",
                }))
            );
        } catch (error) {
            toastError(getErrorMessage(error));
        } finally {
            setLoadingDashboard(false);
            isFirstLoadRef.current = false;
        }
    }, [selectedYear, selectedMonth]);

    const fetchDashboardDataRef = useRef(fetchDashboardData);
    useEffect(() => {
        fetchDashboardDataRef.current = fetchDashboardData;
    }, [fetchDashboardData]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    useEffect(() => {
        let mounted = true;

        joinNotificationGroup("admin").catch((err) => {
            console.error("Join ADMIN_GROUP error:", err);
        });

        const handleDashboardChanged = (payload) => {
            if (!mounted) return;

            // Gom nhiều sự kiện dồn dập trong khoảng thời gian ngắn
            // thành một lần refetch duy nhất, tránh gọi API liên tục.
            clearTimeout(debounceTimerRef.current);
            debounceTimerRef.current = setTimeout(() => {
                fetchDashboardDataRef.current();
            }, 1000);
        };

        connection.on("DashboardChanged", handleDashboardChanged);

        return () => {
            mounted = false;
            clearTimeout(debounceTimerRef.current);
            connection.off("DashboardChanged", handleDashboardChanged);

        };
    }, []);

    const handleMonthChange = useCallback((val) => setSelectedMonth(Number(val)), []);
    const handleYearChange = useCallback((val) => setSelectedYear(val), []);

    const monthOptions = useMemo(() => (
        Array.from({ length: 12 }, (_, i) => ({
            value: i + 1,
            label: `Tháng ${i + 1}`,
        }))
    ), []);

    const yearOptions = useMemo(() => (
        Array.from({ length: 5 }, (_, i) => {
            const y = currentYear - i;
            return { value: String(y), label: `Năm ${y}` };
        })
    ), [currentYear]);
    const handleExport = useCallback(async () => {
        setIsExporting(true);
        try {
            await StatisticService.exportReport(
                Number(selectedYear),
                exportMode === "month" ? selectedMonth : undefined
            );
        } catch (error) {
            toastError(getErrorMessage(error));
        } finally {
            setIsExporting(false);
        }
    }, [selectedYear, selectedMonth, exportMode]);

    return (
        <div className="min-h-screen p-4 space-y-6 overflow-x-hidden relative">
            {loadingDashboard && (
                <div className="absolute inset-0 bg-white/60 z-40 flex items-start justify-center pt-24">
                    <div className="bg-white px-5 py-3 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-3">
                        <div className="w-5 h-5 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm text-slate-600 font-medium">Đang tải dữ liệu thống kê...</span>
                    </div>
                </div>
            )}

            {/* HEADER */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Tổng quan</h1>
                    <p className="text-slate-500 mt-1">Chào mừng bạn trở lại, Admin!</p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="w-50">
                        <SelectField
                            value={exportMode}
                            onChange={setExportMode}
                            options={[
                                { value: "month", label: "Xuất theo tháng" },
                                { value: "year", label: "Xuất theo năm" },
                            ]}
                            placeholder="Chế độ xuất..."
                        />
                    </div>

                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="flex items-center gap-2 bg-white hover:bg-slate-50 text-green-700 font-medium text-sm px-4 py-3 rounded-xl border border-slate-200 shadow-sm transition-all shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isExporting ? (
                            <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Download size={16} className="text-green" />
                        )}
                        <span>{isExporting ? "Đang xuất..." : "Xuất thống kê"}</span>
                    </button>

                    <div className="w-40">
                        <SelectField
                            value={selectedMonth}
                            onChange={handleMonthChange}
                            options={monthOptions}
                            IconComponent={Calendar}
                            placeholder="Chọn tháng..."
                        />
                    </div>

                    <div className="w-44">
                        <SelectField
                            value={selectedYear}
                            onChange={handleYearChange}
                            options={yearOptions}
                            IconComponent={Calendar}
                            placeholder="Chọn năm..."
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

                <KpiCard icon={Ticket} color="bg-sky-500" label="Tổng đặt tour"
                    value={(overview?.totalBookings ?? 0).toLocaleString()}
                    delta={renderDelta(overview?.bookingGrowthPercent)}
                    deltaType={deltaTypeOf(overview?.bookingGrowthPercent)} />
                <KpiCard icon={DollarSign} color="bg-emerald-500" label="Doanh thu"
                    value={formatCurrency(overview?.totalRevenue)}
                    delta={renderDelta(overview?.revenueGrowthPercent)}
                    deltaType={deltaTypeOf(overview?.revenueGrowthPercent)} />
                <KpiCard icon={Users} color="bg-purple-500" label="Số lượng hành khách"
                    value={(overview?.newCustomersThisMonth ?? 0).toLocaleString()}
                    delta={renderDelta(overview?.newCustomersGrowthPercent)}
                    deltaType={deltaTypeOf(overview?.newCustomersGrowthPercent)} />
                <KpiCard icon={Luggage} color="bg-amber-500" label="Tour đang diễn ra"
                    value={(overview?.activeTours ?? 0).toLocaleString()}
                    delta={renderDelta(overview?.activeToursGrowthPercent)}
                    deltaType={deltaTypeOf(overview?.activeToursGrowthPercent)} />
            </div>

            {/* ROW 2: Bar Chart + Pie Trạng thái */}
            <div className="grid grid-cols-12 gap-5">
                <div className="col-span-12 lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 min-w-0">
                    <div className="mb-5">
                        <h3 className="font-semibold text-slate-800 text-base">Doanh thu theo tháng</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Đơn vị: đồng · Năm {selectedYear}</p>
                    </div>
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueData} barSize={28} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                                <CartesianGrid vertical={false} stroke="#F1F5F9" />

                                <XAxis dataKey="month" axisLine={false} tickLine={false} interval={0}
                                    tickFormatter={shortMonth} tick={{ fontSize: 12, fill: "#94A3B8" }} />

                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94A3B8" }}
                                    tickFormatter={formatVND} />
                                {/* Tooltip vẫn giữ số đầy đủ (toLocaleString) để chính xác
                                    khi hover, chỉ trục Y mới cần gọn. */}
                                <Tooltip content={<CustomTooltip unit="đ" formatter={(v) => v.toLocaleString("vi-VN")} />} cursor={{ fill: "#F8FAFC" }} />
                                <Bar dataKey="revenue" fill="#0EA5E9" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="col-span-12 lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 min-w-0">
                    <div className="mb-4">
                        <h3 className="font-semibold text-slate-800 text-base">Trạng thái đơn hàng</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Phân bố theo trạng thái (%)</p>
                    </div>
                    <div className="h-[220px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={orderStatusData}
                                    cx="50%" cy="50%"
                                    outerRadius={90}
                                    dataKey="value"
                                    labelLine={false}
                                    label={PieLabel}
                                >
                                    {orderStatusData.map((entry, index) => (
                                        <Cell key={index} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<PieTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <PieLegend data={orderStatusData} />
                </div>
            </div>

            <div className="grid grid-cols-12 gap-5">
                <div className="col-span-12 lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 min-w-0">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h3 className="font-semibold text-slate-800 text-base">Khách hàng mới</h3>
                            <p className="text-xs text-slate-400 mt-0.5">Lượt đăng ký mới theo tháng · Năm {selectedYear}</p>
                        </div>
                    </div>
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={newCustomersData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                                <CartesianGrid vertical={false} stroke="#F1F5F9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} interval={0}
                                    tickFormatter={shortMonth} tick={{ fontSize: 12, fill: "#94A3B8" }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94A3B8" }} />
                                <Tooltip content={<CustomTooltip unit=" khách" />} />
                                <Line type="monotone" dataKey="customers" stroke="#8B5CF6" strokeWidth={2.5}
                                    dot={{ r: 3, fill: "#8B5CF6", strokeWidth: 0 }} activeDot={{ r: 5 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="col-span-12 lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 min-w-0">
                    <div className="mb-5">
                        <h3 className="font-semibold text-slate-800 text-base">Top tour bán chạy</h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Lượt đặt trong tháng {selectedMonth}/{selectedYear}
                        </p>
                    </div>
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topToursData} layout="vertical" barSize={18}
                                margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
                                <CartesianGrid horizontal={false} stroke="#F1F5F9" />
                                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94A3B8" }} />
                                <YAxis type="category" dataKey="name" width={136} axisLine={false} tickLine={false}
                                    tick={{ fontSize: 11, fill: "#334155" }} />
                                <Tooltip content={<CustomTooltip unit=" lượt" />} cursor={{ fill: "#F8FAFC" }} />
                                <Bar dataKey="booked" radius={[0, 6, 6, 0]}>
                                    {topToursData.map((entry, index) => (
                                        <Cell key={index} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* ROW 4: Pie Độ tuổi + Bảng giao dịch */}
            <div className="grid grid-cols-12 gap-5">
                <div className="col-span-12 lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 min-w-0">
                    <div className="mb-4">
                        <h3 className="font-semibold text-slate-800 text-base">Độ tuổi khách hàng</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Phân bố nhóm tuổi tham gia tour (%)</p>
                    </div>
                    <div className="h-[220px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={ageGroupData}
                                    cx="50%" cy="50%"
                                    outerRadius={90}
                                    dataKey="value"
                                    labelLine={false}
                                    label={PieLabel}
                                >
                                    {ageGroupData.map((entry, index) => (
                                        <Cell key={index} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<PieTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
                        {ageGroupData.map((item) => (
                            <div key={item.name} className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                                <span className="text-xs text-slate-500">{item.name}</span>
                                <span className="text-xs font-semibold text-slate-700 ml-auto">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="col-span-12 lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 min-w-0">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h3 className="font-semibold text-slate-800 text-base">Giao dịch gần đây</h3>
                            <p className="text-xs text-slate-400 mt-0.5">6 giao dịch mới nhất</p>
                        </div>
                        <Link to="/Quan-ly/Don-dat-cac-chuyen-di" className="text-sm text-sky-600 hover:text-sky-700 font-medium">
                            Xem tất cả
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    {["Mã đơn", "Khách hàng", "Tour", "Số tiền", "Trạng thái"].map((h) => (
                                        <th key={h} className={`py-3 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wide ${h === "Trạng thái" ? "text-center" : "text-left"}`}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {(recentTransactions ?? []).length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-10 text-center text-sm text-slate-400">
                                            Chưa có giao dịch nào gần đây
                                        </td>
                                    </tr>
                                ) : (
                                    (recentTransactions ?? []).slice(0, 4).map((item) => (
                                        <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                            <td className="py-3.5 px-2">
                                                <span className="font-mono text-sm font-semibold text-slate-700">{item.id}</span>
                                                <div className="text-xs text-slate-400 mt-0.5">{item.time}</div>
                                            </td>
                                            <td className="py-3.5 px-2 text-sm font-medium text-slate-700">{item.customer}</td>
                                            <td className="py-3.5 px-2 text-sm text-slate-500">{item.tour}</td>
                                            <td className="py-3.5 px-2 text-sm font-semibold text-slate-800">{item.amount}</td>
                                            <td className="py-3.5 px-2 text-center">
                                                <StatusBadge status={item.status} />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    );
}