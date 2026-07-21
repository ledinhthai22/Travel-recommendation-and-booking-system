import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
import {
    Ticket, DollarSign, Users, Luggage, Calendar, TrendingUp, TrendingDown,
    Download, BarChart3, PieChart as PieChartIcon, Cake, Receipt, ArrowRight
} from "lucide-react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell,
} from "recharts";
import { Link } from "react-router-dom";
import StatisticService from "~/Services/StatisticService";
import SelectField from "~/components/UI/Form/SelectField";
import { toastError } from "~/utils/Toast";
import { getErrorMessage } from "~/utils/errorHelper";
import { formatCurrency } from "~/Helper/FormatCurrency";
import { connection, joinNotificationGroup } from "~/Services/signalRService";

// Trạng thái đơn mới (chỉ 6 trạng thái)
const ORDER_STATUS = {
    1: { text: 'Chờ thanh toán', color: '#F59E0B', bgColor: '#FEF3C7' },
    2: { text: 'Chờ duyệt', color: '#3B82F6', bgColor: '#DBEAFE' },
    3: { text: 'Đã duyệt', color: '#0EA5E9', bgColor: '#E0F2FE' },
    4: { text: 'Đang diễn ra', color: '#6366F1', bgColor: '#E0E7FF' },
    5: { text: 'Hoàn tất', color: '#10B981', bgColor: '#D1FAE5' },
    6: { text: 'Đã hủy', color: '#EF4444', bgColor: '#FEE2E2' },
};

// Trạng thái tài chính
const FINANCIAL_STATUS = {
    0: { text: 'Chưa thanh toán', color: '#94A3B8' },
    1: { text: 'Đã đặt cọc', color: '#F59E0B' },
    2: { text: 'Đã thanh toán đủ', color: '#10B981' },
    3: { text: 'Đang hoàn tiền', color: '#8B5CF6' },
    4: { text: 'Đã hoàn tiền', color: '#059669' },
    5: { text: 'Mất cọc', color: '#EF4444' },
};

// Trạng thái thanh toán
const PAYMENT_STATUS = {
    0: { text: 'Chờ xử lý', color: '#F59E0B' },
    1: { text: 'Thành công', color: '#10B981' },
    2: { text: 'Thất bại', color: '#EF4444' },
    3: { text: 'Đã hủy', color: '#94A3B8' },
};

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

// Helper lấy tên trạng thái đơn
const getOrderStatusText = (status) => {
    return ORDER_STATUS[status]?.text || 'Không xác định';
};

// Helper lấy màu trạng thái đơn
const getOrderStatusColor = (status) => {
    return ORDER_STATUS[status]?.color || '#94A3B8';
};

// Helper lấy bgColor trạng thái đơn
const getOrderStatusBgColor = (status) => {
    return ORDER_STATUS[status]?.bgColor || '#F1F5F9';
};

// Helper kiểm tra đơn đã hủy
const isOrderCancelled = (status) => status === 6;

// Helper kiểm tra đơn đang hoàn tiền
const isOrderRefunding = (status) => status === 4; // Trạng thái tài chính

// Helper kiểm tra đơn đã hoàn tiền
const isOrderRefunded = (status) => status === 5; // Trạng thái tài chính

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

const KpiCard = React.memo(function KpiCard({ icon: Icon, color, softColor, label, value, delta, deltaType, contextLabel }) {
    return (
        <div className="group bg-white rounded-3xl border border-slate-200 p-5 flex flex-col gap-4 hover:shadow-md hover:border-slate-300 transition-all">
            <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-2xl ${softColor} flex items-center justify-center`}>
                    <div className={`w-9 h-9 rounded-xl ${color} text-white flex items-center justify-center shadow-sm`}>
                        <Icon size={18} />
                    </div>
                </div>
                <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${deltaType === "up" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
                    {deltaType === "up" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {delta}
                </span>
            </div>
            <div>
                <p className="text-sm text-slate-500 mb-1">{label}</p>
                <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{value}</h3>
                <p className="text-xs text-slate-400 mt-1">{contextLabel}</p>
            </div>
        </div>
    );
});

const StatusBadge = ({ status }) => {
    const map = {
        "Chờ thanh toán": "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
        "Chờ duyệt": "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
        "Đã duyệt": "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
        "Đang diễn ra": "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200",
        "Hoàn tất": "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
        "Đã hủy": "bg-red-50 text-red-600 ring-1 ring-red-200",
        "Thành công": "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
        "Chờ xử lý": "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
        "Thất bại": "bg-red-50 text-red-600 ring-1 ring-red-200",
        "Đã hủy": "bg-gray-50 text-gray-600 ring-1 ring-gray-200",
    };
    return (
        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${map[status] ?? "bg-slate-50 text-slate-500 ring-1 ring-slate-200"}`}>
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

const SectionHeader = ({ icon: Icon, iconColor, title, subtitle, action }) => (
    <div className="flex items-center justify-between mb-5 gap-3">
        <div className="flex items-center gap-3 min-w-0">
            <div className={`w-9 h-9 rounded-xl ${iconColor} flex items-center justify-center shrink-0`}>
                <Icon size={16} className="text-white" />
            </div>
            <div className="min-w-0">
                <h3 className="font-semibold text-slate-800 text-base truncate">{title}</h3>
                <p className="text-xs text-slate-400 mt-0.5 truncate">{subtitle}</p>
            </div>
        </div>
        {action}
    </div>
);

const renderDelta = (growth) => {
    if (growth === null || growth === undefined) return "Mới";
    return `${growth >= 0 ? "+" : ""}${growth}%`;
};

const deltaTypeOf = (growth) => (growth == null || growth >= 0 ? "up" : "down");

export default function Dashboard() {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    
    const [selectedYear, setSelectedYear] = useState(String(currentYear));
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [overview, setOverview] = useState(null);
    const [revenueData, setRevenueData] = useState([]);
    const [orderStatusData, setOrderStatusData] = useState([]);
    const [topToursData, setTopToursData] = useState([]);
    const [ageGroupData, setAgeGroupData] = useState([]);
    const [recentTransactions, setRecentTransactions] = useState([]);

    const [loadingDashboard, setLoadingDashboard] = useState(true);
    const [exportMode, setExportMode] = useState("month");
    const [isExporting, setIsExporting] = useState(false);

    const isFirstLoadRef = useRef(true);
    const debounceTimerRef = useRef(null);

    const periodLabel = selectedMonth ? `Tháng ${selectedMonth}/${selectedYear}` : `Năm ${selectedYear}`;

    const monthOptions = useMemo(() => {
        const isCurrentYear = Number(selectedYear) === currentYear;
        const maxMonth = isCurrentYear ? currentMonth : 12;
        
        const options = [
            { value: "", label: "Tất cả tháng" }
        ];
        
        for (let i = 1; i <= maxMonth; i++) {
            options.push({
                value: i,
                label: `Tháng ${i}`
            });
        }
        
        return options;
    }, [selectedYear, currentYear, currentMonth]);

    useEffect(() => {
        const isCurrentYear = Number(selectedYear) === currentYear;
        const maxMonth = isCurrentYear ? currentMonth : 12;
        
        if (selectedMonth !== null && selectedMonth > maxMonth) {
            setSelectedMonth(null);
        }
    }, [selectedYear, selectedMonth, currentYear, currentMonth]);

    const yearOptions = useMemo(() => {
        const years = [];
        const startYear = currentYear - 4;
        for (let y = currentYear; y >= startYear; y--) {
            years.push({ value: String(y), label: `Năm ${y}` });
        }
        return years;
    }, [currentYear]);

    const fetchDashboardData = useCallback(async () => {
        if (isFirstLoadRef.current) setLoadingDashboard(true);
        try {
            const year = Number(selectedYear);
            const month = selectedMonth;

            const [
                overviewRes,
                revenueRes,
                orderStatusRes,
                topToursRes,
                ageGroupsRes,
                recentTransactionsRes,
            ] = await Promise.all([
                StatisticService.getOverview(year, month),
                StatisticService.getRevenueChart(year, month),
                StatisticService.getOrderStatus(year, month),
                StatisticService.getTopTours(5, year, month),
                StatisticService.getAgeGroups(year, month),
                StatisticService.getRecentTransactions(6, year, month),
            ]);

            setOverview(overviewRes);

            // Xử lý dữ liệu doanh thu
            let formattedRevenue = revenueRes?.data ?? [];
            if (month && formattedRevenue.length > 0) {
                const daysInMonth = new Date(year, month, 0).getDate();
                const lookup = {};
                formattedRevenue.forEach(item => {
                    const dayMatch = item.month?.match(/\d+/);
                    if (dayMatch) {
                        lookup[parseInt(dayMatch[0])] = item.revenue || 0;
                    }
                });
                
                formattedRevenue = [];
                for (let d = 1; d <= daysInMonth; d++) {
                    formattedRevenue.push({
                        month: d,
                        revenue: lookup[d] || 0
                    });
                }
            } else if (!month) {
                const lookup = {};
                formattedRevenue.forEach(item => {
                    const monthMatch = item.month?.match(/\d+/);
                    if (monthMatch) {
                        lookup[parseInt(monthMatch[0])] = item.revenue || 0;
                    }
                });
                
                formattedRevenue = [];
                for (let m = 1; m <= 12; m++) {
                    formattedRevenue.push({
                        month: m,
                        revenue: lookup[m] || 0
                    });
                }
            }
            
            setRevenueData(formattedRevenue);

            // Map dữ liệu trạng thái đơn
            setOrderStatusData(
                (orderStatusRes || []).map((d) => {
                    const statusCode = d.statusCode || d.id || d.maTrangThai;
                    const statusName = statusCode ? getOrderStatusText(statusCode) : (d.statusName ?? d.status ?? d.name ?? d.trangThai);
                    const statusColor = statusCode ? getOrderStatusColor(statusCode) : colorAt(statusCode || 0);
                    
                    return {
                        name: statusName,
                        value: d.percentage ?? d.percent ?? d.value ?? 0,
                        color: d.color ?? statusColor,
                    };
                })
            );

            // Map dữ liệu top tours
            setTopToursData(
                (topToursRes || []).map((d, i) => ({
                    name: d.tenTour ?? d.name ?? d.tourName,
                    booked: Math.round(d.bookedCount ?? d.soLuotDat ?? d.booked ?? d.bookingCount ?? 0),
                    color: d.color ?? colorAt(i),
                }))
            );

            // Map dữ liệu độ tuổi
            setAgeGroupData(
                (ageGroupsRes || []).map((d, i) => ({
                    name: d.groupName,
                    value: d.percentage,
                    color: colorAt(i),
                }))
            );

            // Map dữ liệu giao dịch gần đây
            setRecentTransactions(
                (recentTransactionsRes || []).map((t) => {
                    const statusCode = t.statusCode || t.trangThaiDon;
                    const statusText = statusCode ? getOrderStatusText(statusCode) : (t.status ?? 'Không xác định');
                    
                    return {
                        id: `#${t.maDon}`,
                        customer: t.customerName || 'Khách vãng lai',
                        tour: t.tourName || '—',
                        amount: (t.amount ?? 0).toLocaleString("vi-VN") + "đ",
                        status: statusText,
                        time: t.time
                            ? new Date(t.time).toLocaleString("vi-VN", {
                                day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit",
                            })
                            : "",
                    };
                })
            );
        } catch (error) {
            console.error('Dashboard fetch error:', error);
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

    const handleMonthChange = useCallback((val) => {
        setSelectedMonth(val === "" ? null : Number(val));
    }, []);

    const handleYearChange = useCallback((val) => {
        setSelectedYear(val);
    }, []);

    const handleExport = useCallback(async () => {
        setIsExporting(true);
        try {
            await StatisticService.exportReport(
                Number(selectedYear),
                exportMode === "month" && selectedMonth !== null ? selectedMonth : undefined
            );
        } catch (error) {
            toastError(getErrorMessage(error));
        } finally {
            setIsExporting(false);
        }
    }, [selectedYear, selectedMonth, exportMode]);

    const formatXAxisTick = (value) => {
        if (selectedMonth) {
            return value;
        }
        return `T${value}`;
    };

    return (
        <div className="min-h-screen  p-4 md:p-6 space-y-6 overflow-x-hidden relative">
            {loadingDashboard && (
                <div className="fixed inset-0 z-40 flex items-start justify-center pt-24">
                    <div className="bg-white px-5 py-3 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-3">
                        <div className="w-5 h-5 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm text-slate-600 font-medium">Đang tải dữ liệu thống kê...</span>
                    </div>
                </div>
            )}

            {/* HEADER */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 md:p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Tổng quan</h1>
                            <p className="text-slate-500 text-sm mt-0.5">Chào mừng bạn trở lại</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                        <div className="flex items-center gap-2 flex-1 sm:flex-none">
                            <div className="w-full sm:w-60">
                                <SelectField
                                    value={selectedMonth === null ? "" : selectedMonth}
                                    onChange={handleMonthChange}
                                    options={monthOptions}
                                    IconComponent={Calendar}
                                    placeholder="Chọn tháng..."
                                />
                            </div>
                            <div className="w-full sm:w-50">
                                <SelectField
                                    value={selectedYear}
                                    onChange={handleYearChange}
                                    options={yearOptions}
                                    IconComponent={Calendar}
                                    placeholder="Chọn năm..."
                                />
                            </div>
                        </div>

                        <div className="hidden sm:block w-px h-9 bg-slate-200" />

                        <div className="flex items-center gap-2">
                            <div className="w-full sm:w-50">
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
                                className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm px-4 py-2.5 rounded-xl shadow-sm transition-all shrink-0 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                            >
                                {isExporting ? (
                                    <div className="w-4 h-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <Download size={16} />
                                )}
                                <span>{isExporting ? "Đang xuất..." : "Xuất thống kê"}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
                <KpiCard 
                    icon={Ticket} 
                    color="bg-sky-500"
                    softColor="bg-sky-50"
                    label="Tổng đặt tour"
                    value={(overview?.totalBookings ?? 0).toLocaleString()}
                    delta={renderDelta(overview?.bookingGrowthPercent)}
                    deltaType={deltaTypeOf(overview?.bookingGrowthPercent)}
                    contextLabel={selectedMonth ? "so với tháng trước" : "so với năm trước"}
                />
                <KpiCard 
                    icon={DollarSign} 
                    color="bg-emerald-500"
                    softColor="bg-emerald-50"
                    label="Doanh thu"
                    value={formatCurrency(overview?.totalRevenue)}
                    delta={renderDelta(overview?.revenueGrowthPercent)}
                    deltaType={deltaTypeOf(overview?.revenueGrowthPercent)}
                    contextLabel={selectedMonth ? "so với tháng trước" : "so với năm trước"}
                />
                <KpiCard 
                    icon={Users} 
                    color="bg-purple-500"
                    softColor="bg-purple-50"
                    label="Số lượng hành khách"
                    value={(overview?.totalPassengers ?? 0).toLocaleString()}
                    delta={renderDelta(overview?.passengerGrowthPercent)}
                    deltaType={deltaTypeOf(overview?.passengerGrowthPercent)}
                    contextLabel={selectedMonth ? "so với tháng trước" : "so với năm trước"}
                />
                <KpiCard 
                    icon={Luggage} 
                    color="bg-amber-500"
                    softColor="bg-amber-50"
                    label="Tour đang diễn ra"
                    value={(overview?.activeTours ?? 0).toLocaleString()}
                    delta={renderDelta(overview?.activeToursGrowthPercent)}
                    deltaType={deltaTypeOf(overview?.activeToursGrowthPercent)}
                    contextLabel={selectedMonth ? "so với tháng trước" : "so với năm trước"}
                />
            </div>

            {/* ROW 2: Bar Chart + Pie Trạng thái */}
            <div className="grid grid-cols-12 gap-4 md:gap-5">
                <div className="col-span-12 lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-5 md:p-6 min-w-0">
                    <SectionHeader
                        icon={BarChart3}
                        iconColor="bg-sky-500"
                        title="Doanh thu"
                        subtitle={selectedMonth ? `Tháng ${selectedMonth} · Năm ${selectedYear} (theo ngày)` : `Năm ${selectedYear} (theo tháng)`}
                    />
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueData} barSize={selectedMonth ? 8 : 28} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                                <CartesianGrid vertical={false} stroke="#F1F5F9" />
                                <XAxis 
                                    dataKey="month" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    interval={selectedMonth ? Math.floor(revenueData.length / 15) : 0}
                                    tickFormatter={formatXAxisTick}
                                    tick={{ fontSize: 12, fill: "#94A3B8" }} 
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fontSize: 12, fill: "#94A3B8" }}
                                    tickFormatter={formatVND} 
                                />
                                <Tooltip 
                                    content={<CustomTooltip unit="đ" formatter={(v) => v.toLocaleString("vi-VN")} />} 
                                    cursor={{ fill: "#F8FAFC" }} 
                                />
                                <Bar dataKey="revenue" fill="#0EA5E9" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="col-span-12 lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-5 md:p-6 min-w-0">
                    <SectionHeader
                        icon={PieChartIcon}
                        iconColor="bg-violet-500"
                        title="Trạng thái đơn hàng"
                        subtitle={periodLabel}
                    />
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

            {/* ROW 3: Top Tours (full width) + Độ tuổi khách hàng */}
            <div className="grid grid-cols-12 gap-4 md:gap-5">
                <div className="col-span-12 lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-5 md:p-6 min-w-0">
                    <SectionHeader
                        icon={Luggage}
                        iconColor="bg-amber-500"
                        title="Top tour bán chạy"
                        subtitle={periodLabel}
                    />
                    <div className="h-[300px] w-full">
                        {topToursData.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center gap-2">
                                <Luggage size={28} className="text-slate-300" />
                                <p className="text-sm text-slate-400">Chưa có dữ liệu tour trong kỳ này</p>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={topToursData} layout="vertical" barSize={20}
                                    margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
                                    <CartesianGrid horizontal={false} stroke="#F1F5F9" />
                                    <XAxis 
                                        type="number" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fontSize: 11, fill: "#94A3B8" }}
                                        allowDecimals={false}
                                        domain={[0, 'dataMax + 1']}
                                    />
                                    <YAxis 
                                        type="category" 
                                        dataKey="name" 
                                        width={180} 
                                        axisLine={false} 
                                        tickLine={false}
                                        tick={{ fontSize: 11, fill: "#334155" }} 
                                    />
                                    <Tooltip content={<CustomTooltip unit=" lượt" />} cursor={{ fill: "#F8FAFC" }} />
                                    <Bar dataKey="booked" radius={[0, 6, 6, 0]}>
                                        {topToursData.map((entry, index) => (
                                            <Cell key={index} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                <div className="col-span-12 lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-5 md:p-6 min-w-0">
                    <SectionHeader
                        icon={Cake}
                        iconColor="bg-pink-500"
                        title="Độ tuổi khách hàng"
                        subtitle={periodLabel}
                    />
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
            </div>

            {/* ROW 4: Bảng giao dịch gần đây (full width) */}
            <div className="grid grid-cols-12 gap-4 md:gap-5">
                <div className="col-span-12 bg-white rounded-3xl border border-slate-200 p-5 md:p-6 min-w-0">
                    <SectionHeader
                        icon={Receipt}
                        iconColor="bg-teal-500"
                        title="Giao dịch gần đây"
                        subtitle={periodLabel}
                        action={
                            <Link
                                to="/Quan-ly/Don-dat-cac-chuyen-di"
                                className="flex items-center gap-1 text-sm text-sky-600 hover:text-sky-700 font-medium shrink-0"
                            >
                                Xem tất cả <ArrowRight size={14} />
                            </Link>
                        }
                    />
                    <div className="overflow-x-auto -mx-1">
                        <table className="w-full min-w-[640px]">
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
                                        <td colSpan={5} className="py-12 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <Receipt size={28} className="text-slate-300" />
                                                <span className="text-sm text-slate-400">Chưa có giao dịch nào gần đây</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    (recentTransactions ?? []).slice(0, 6).map((item) => (
                                        <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
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