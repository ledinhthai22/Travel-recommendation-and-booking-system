import React, { useState } from "react";
import { Ticket, DollarSign, Users, Luggage, Calendar, TrendingUp, TrendingDown, Download } from "lucide-react"; // Import thêm Download icon
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line,
} from "recharts";

import {
    revenueData, orderStatusData, newCustomersData, topToursData,
    recentTransactions, tourEngagementData, tourEngagementStats, ageGroupData,
} from "~/constants/Dashboard.constants";
import SelectField from "~/components/UI/Form/SelectField";

// ─── Custom Tooltip cho Bar và Line Chart ───────────────────────────────────────
const CustomTooltip = ({ active, payload, label, unit = "" }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-lg px-4 py-2.5 text-sm z-50">
                {label && <p className="text-slate-500 mb-1 font-medium">{label}</p>}
                {payload.map((p, i) => (
                    <p key={i} style={{ color: p.color || p.fill }} className="font-semibold">
                        {p.value}{unit}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

// ─── Custom Tooltip dành riêng cho Pie Chart (Fix lỗi màu chữ bị đè) ───────────────
const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-lg px-4 py-2.5 text-sm z-50">
                <p className="text-slate-800 font-semibold">{data.name}</p>
                <p className="text-slate-500 mt-0.5 font-medium">Tỷ lệ: <span className="text-sky-600 font-bold">{data.value}%</span></p>
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

const KpiCard = ({ icon: Icon, color, label, value, delta, deltaType }) => (
    <div className="bg-white rounded-3xl border border-slate-200 p-5 flex flex-col gap-4">
        <div className="flex items-start justify-between">
            <div className={`w-11 h-11 rounded-xl ${color} text-white flex items-center justify-center`}>
                <Icon size={20} />
            </div>
            <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                deltaType === "up" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
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

const StatusBadge = ({ status }) => {
    const map = {
        "Đã thanh toán": "bg-emerald-50 text-emerald-700",
        "Chờ thanh toán": "bg-amber-50 text-amber-700",
        "Đã hủy": "bg-red-50 text-red-600",
    };
    return (
        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${map[status] ?? ""}`}>
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

// ─── Dashboard Main Component ──────────────────────────────────────────────
export default function Dashboard() {
    const [selectedMonth, setSelectedMonth] = useState("2026-05");
    const [selectedYear, setSelectedYear] = useState("2026");

    const monthOptions = [
        { value: "2026-05", label: "Tháng 5/2026" },
        { value: "2026-04", label: "Tháng 4/2026" },
        { value: "2026-03", label: "Tháng 3/2026" },
    ];

    const yearOptions = [
        { value: "2026", label: "Năm 2026" },
        { value: "2025", label: "Năm 2025" },
    ];

    const handleExport = () => {
        // Xử lý logic xuất file excel/pdf ở đây
        alert(`Đang xuất dữ liệu thống kê...`);
    };

    return (
        <div className="min-h-screen p-4 space-y-6">
            
            {/* HEADER */}
            <div className="flex flex-col sm:flex-items sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Tổng quan</h1>
                    <p className="text-slate-500 mt-1">Chào mừng bạn trở lại, Admin!</p>
                </div>

                {/* Khối chức năng bên phải */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button 
                        onClick={handleExport}
                        className="flex items-center gap-2 bg-white hover:bg-slate-50 text-green-700 font-medium text-sm px-4 py-3 rounded-xl border border-slate-200 shadow-sm transition-all shrink-0"
                    >
                        <Download size={16} className="text-green" />
                        <span>Xuất thống kê</span>
                    </button>
                    <div className="w-48">
                        <SelectField
                            value={selectedMonth}
                            onChange={(val) => setSelectedMonth(val)}
                            options={monthOptions}
                            IconComponent={Calendar}
                            placeholder="Chọn tháng..."
                        />
                    </div>
                </div>
            </div>

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                <KpiCard icon={Ticket} color="bg-sky-500" label="Tổng đặt tour" value="1.248" delta="+12%" deltaType="up" />
                <KpiCard icon={DollarSign} color="bg-emerald-500" label="Doanh thu" value="4,6 tỷ đ" delta="+8,3%" deltaType="up" />
                <KpiCard icon={Users} color="bg-purple-500" label="Khách hàng mới" value="312" delta="-2,1%" deltaType="down" />
                <KpiCard icon={Luggage} color="bg-amber-500" label="Tour đang diễn ra" value="37" delta="+5" deltaType="up" />
            </div>

            {/* ROW 2: Bar Chart + Pie Trạng thái */}
            <div className="grid grid-cols-12 gap-5">
                {/* Bar Chart */}
                <div className="col-span-12 lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h3 className="font-semibold text-slate-800 text-base">Doanh thu theo tháng</h3>
                            <p className="text-xs text-slate-400 mt-0.5">Đơn vị: triệu đồng</p>
                        </div>
                        <div className="w-36">
                            <SelectField
                                value={selectedYear}
                                onChange={(val) => setSelectedYear(val)}
                                options={yearOptions}
                                placeholder="Chọn năm..."
                            />
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={revenueData} barSize={28} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                            <CartesianGrid vertical={false} stroke="#F1F5F9" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94A3B8" }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94A3B8" }} tickFormatter={(v) => `${v}M`} />
                            <Tooltip content={<CustomTooltip unit=" triệu đ" />} cursor={{ fill: "#F8FAFC" }} />
                            <Bar dataKey="revenue" fill="#0EA5E9" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie Chart: Trạng thái đơn hàng */}
                <div className="col-span-12 lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6">
                    <div className="mb-4">
                        <h3 className="font-semibold text-slate-800 text-base">Trạng thái đơn hàng</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Phân bố theo trạng thái (%)</p>
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
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
                            {/* FIX: Sử dụng PieTooltip riêng để không lỗi màu */}
                            <Tooltip content={<PieTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                    <PieLegend data={orderStatusData} />
                </div>
            </div>

            {/* ROW 3: Line + Pie Hành vi + Horizontal Bar */}
            <div className="grid grid-cols-12 gap-5">
                {/* Line Chart */}
                <div className="col-span-12 lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h3 className="font-semibold text-slate-800 text-base">Khách hàng mới</h3>
                            <p className="text-xs text-slate-400 mt-0.5">Lượt đăng ký mới theo tháng</p>
                        </div>
                        <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-50 text-purple-600">
                            <TrendingUp size={12} /> +18% so với 2025
                        </span>
                    </div>
                    <ResponsiveContainer width="100%" height={240}>
                        <LineChart data={newCustomersData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                            <CartesianGrid vertical={false} stroke="#F1F5F9" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94A3B8" }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94A3B8" }} />
                            <Tooltip content={<CustomTooltip unit=" khách" />} />
                            <Line type="monotone" dataKey="customers" stroke="#8B5CF6" strokeWidth={2.5}
                                dot={{ r: 3, fill: "#8B5CF6", strokeWidth: 0 }} activeDot={{ r: 5 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie Donut: Hành vi khách hàng */}
                <div className="col-span-12 lg:col-span-3 bg-white rounded-3xl border border-slate-200 p-6">
                    <div className="mb-3">
                        <h3 className="font-semibold text-slate-800 text-base">Hành vi khách hàng</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Xem tour · Yêu thích · Đặt tour</p>
                    </div>
                    <div className="flex justify-between mb-3">
                        <div className="text-center">
                            <p className="text-base font-bold text-slate-800">{tourEngagementStats.totalViews.toLocaleString()}</p>
                            <p className="text-xs text-slate-400">Lượt xem</p>
                        </div>
                        <div className="w-px bg-slate-100" />
                        <div className="text-center">
                            <p className="text-base font-bold text-sky-600">{tourEngagementStats.totalBooked.toLocaleString()}</p>
                            <p className="text-xs text-slate-400">Lượt đặt</p>
                        </div>
                        <div className="w-px bg-slate-100" />
                        <div className="text-center">
                            <p className="text-base font-bold text-emerald-600">{tourEngagementStats.conversionRate}</p>
                            <p className="text-xs text-slate-400">Tỉ lệ đặt</p>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={150}>
                        <PieChart>
                            <Pie data={tourEngagementData} cx="50%" cy="50%"
                                innerRadius={40} outerRadius={68}
                                dataKey="value" labelLine={false} paddingAngle={3}>
                                {tourEngagementData.map((entry, index) => (
                                    <Cell key={index} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip content={<PieTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-3 space-y-2">
                        {tourEngagementData.map((item) => (
                            <div key={item.name} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="text-slate-500">{item.name}</span>
                                </div>
                                <span className="font-semibold text-slate-700">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Horizontal Bar: Top tour bán chạy */}
                <div className="col-span-12 lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6">
                    <div className="mb-5">
                        <h3 className="font-semibold text-slate-800 text-base">Top tour bán chạy</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Lượt đặt trong tháng 5/2026</p>
                    </div>
                    <ResponsiveContainer width="100%" height={240}>
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

            {/* ROW 4: Pie Độ tuổi + Bảng giao dịch */}
            <div className="grid grid-cols-12 gap-5">
                {/* Pie Chart: Độ tuổi */}
                <div className="col-span-12 lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6">
                    <div className="mb-4">
                        <h3 className="font-semibold text-slate-800 text-base">Độ tuổi khách hàng</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Phân bố nhóm tuổi tham gia tour (%)</p>
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
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

                {/* Bảng giao dịch gần đây */}
                <div className="col-span-12 lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h3 className="font-semibold text-slate-800 text-base">Giao dịch gần đây</h3>
                            <p className="text-xs text-slate-400 mt-0.5">6 giao dịch mới nhất</p>
                        </div>
                        <button className="text-sm text-sky-600 hover:text-sky-700 font-medium">
                            Xem tất cả →
                        </button>
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
                                {recentTransactions.slice(0, 4).map((item) => (
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
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    );
}