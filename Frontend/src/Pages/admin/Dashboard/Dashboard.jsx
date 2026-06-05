import React from "react";
import {
    Ticket,
    DollarSign,
    Users,
    Luggage,
    Calendar,
    UserPlus,
    BadgeCheck,
    MessageSquare,
    MapPinned
} from "lucide-react";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";
import { revenueData,revenueOptions,recentTransactions,activities,topTours} from '~/constants/Dashboard.constants';
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
);

export default function Dashboard() {
    

    return (
        <div className="min-h-screen p-2">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">
                        Tổng quan
                    </h1>

                    <p className="text-slate-500">
                        Chào mừng bạn trở lại, Admin!
                    </p>
                </div>

                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200">
                    <Calendar size={18} />

                    <select className="outline-none bg-transparent text-sm">
                        <option>Tháng 5/2026</option>
                    </select>
                </div>
            </div>

            {/* KPI */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">

                <div className="bg-white rounded-3xl border border-slate-200 p-5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-sky-500 mt-10 text-white flex items-center justify-center">
                            <Ticket size={20} />
                        </div>

                        <div>
                            <p className="text-sm text-slate-500">
                                Tổng đặt tour
                            </p>

                            <h3 className="text-3xl mt-5 font-bold">
                                99
                            </h3>
                        </div>
                    </div>

                    <p className="text-xs text-slate-400 mt-4 ml-16">
                        so với tháng trước
                    </p>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 p-5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl mt-10 bg-emerald-500 text-white flex items-center justify-center">
                            <DollarSign size={20} />
                        </div>

                        <div>
                            <p className="text-sm   text-slate-500">
                                Doanh thu
                            </p>

                            <h3 className="text-3xl mt-5 font-bold">
                                1,45 tỷ
                            </h3>
                        </div>
                    </div>

                    <p className="text-xs text-slate-400 mt-4  ml-16">
                        so với tháng trước
                    </p>
                </div>

                <div className="bg-white rounded-3xl  border border-slate-200 p-5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl mt-10 bg-purple-500 text-white flex items-center justify-center">
                            <Users size={20} />
                        </div>

                        <div>
                            <p className="text-sm  text-slate-500">
                                Khách hàng mới
                            </p>

                            <h3 className="text-3xl mt-5 font-bold">
                                85
                            </h3>
                        </div>
                    </div>

                    <p className="text-xs text-slate-400 mt-4 ml-16">
                        so với tháng trước
                    </p>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 p-5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl mt-10 bg-amber-500 text-white flex items-center justify-center">
                            <Luggage size={20} />
                        </div>

                        <div>
                            <p className="text-sm  text-slate-500">
                                Tour đang diễn ra
                            </p>

                            <h3 className="text-3xl mt-5 font-bold">
                                25
                            </h3>
                        </div>
                    </div>

                    <p className="text-xs text-slate-400 mt-4  ml-16">
                        so với tháng trước
                    </p>
                </div>
            </div>

            {/* CHART + TOP TOUR */}
            <div className="grid grid-cols-12 gap-6 mb-6">

                <div className="col-span-8 bg-white rounded-3xl border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold uppercase text-lg">
                            Doanh thu theo tháng
                        </h3>

                        <select className="border rounded-2xl border-slate-200 px-4 py-2 text-sm">
                            <option>Năm 2026</option>
                        </select>
                    </div>

                    <div className="h-[320px]">
                        <Bar
                            data={revenueData}
                            options={revenueOptions}

                        />
                    </div>
                </div>

                <div className="col-span-4 bg-white rounded-3xl border border-slate-200 p-6">
                    <h3 className="font-semibold uppercase text-lg mb-6">
                        Top tour được đi nhiều
                    </h3>

                    <div className="space-y-5">
                        {topTours.map((tour) => (
                            <div
                                key={tour.id}
                                className="flex items-center gap-3"
                            >
                                <span className="w-4 text-sm font-medium">
                                    {tour.id}
                                </span>

                                <img
                                    src={tour.image}
                                    alt={tour.name}
                                    className="w-12 h-12 rounded-xl object-cover"
                                />

                                <div className="flex-1">
                                    <h4 className="font-medium text-sm">
                                        {tour.name}
                                    </h4>

                                    <p className="text-xs text-slate-500">
                                        Đã đặt: {tour.booked}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="font-semibold text-sm">
                                        {tour.revenue}
                                    </p>

                                    <p className="text-xs text-slate-500">
                                        Doanh thu
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* BOTTOM */}
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-8 bg-white rounded-3xl border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold uppercase text-lg">
                            Giao dịch gần đây
                        </h3>

                        <button className="text-sm text-sky-600 hover:text-sky-700">
                            Xem tất cả
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="text-left py-3 text-xs font-semibold text-slate-500 uppercase">
                                        Mã đơn
                                    </th>

                                    <th className="text-left py-3 text-xs font-semibold text-slate-500 uppercase">
                                        Khách hàng
                                    </th>

                                    <th className="text-left py-3 text-xs font-semibold text-slate-500 uppercase">
                                        Tour
                                    </th>

                                    <th className=" text-left py-3 text-xs font-semibold text-slate-500 uppercase">
                                        Số tiền
                                    </th>

                                    <th className="text-center py-3 text-xs font-semibold text-slate-500 uppercase">
                                        Trạng thái
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {recentTransactions.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="border-b border-slate-100 hover:bg-slate-50"
                                    >
                                        <td className="py-4">
                                            <span className="font-medium text-slate-800">
                                                {item.id}
                                            </span>

                                            <div className="text-xs text-slate-400">
                                                {item.time}
                                            </div>
                                        </td>

                                        <td className="py-4 text-sm font-medium">
                                            {item.customer}
                                        </td>

                                        <td className="py-4 text-sm text-slate-600">
                                            {item.tour}
                                        </td>

                                        <td className="py-4  font-semibold text-slate-800">
                                            {item.amount}
                                        </td>

                                        <td className="py-4 text-center">
                                            <span
                                                className={`
                                    px-3 py-1 rounded-full text-xs font-medium
                                    ${item.status === "Đã thanh toán"
                                                        ? "bg-emerald-100 text-emerald-700"
                                                        : item.status === "Chờ thanh toán"
                                                            ? "bg-amber-100 text-amber-700"
                                                            : "bg-red-100 text-red-700"
                                                    }
                                `}
                                            >
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="col-span-4 bg-white rounded-3xl border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold uppercase text-lg">
                            Hoạt động gần đây
                        </h3>

                        <button className="text-sm text-sky-600 hover:text-sky-700">
                            Xem tất cả
                        </button>
                    </div>

                    <div className="space-y-5">
                        {activities.map((activity, index) => {
                            const Icon = activity.icon;

                            return (
                                <div
                                    key={activity.id}
                                    className="flex gap-3"
                                >
                                    {/* Timeline */}
                                    <div className="flex flex-col items-center">
                                        <div
                                            className={`w-10 h-10 rounded-xl flex items-center justify-center ${activity.color}`}
                                        >
                                            <Icon size={18} />
                                        </div>

                                        {index !== activities.length - 1 && (
                                            <div className="w-px flex-1 bg-slate-200 mt-2" />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 pb-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-semibold text-slate-800">
                                                {activity.title}
                                            </h4>

                                            <span className="text-xs text-slate-400">
                                                {activity.time}
                                            </span>
                                        </div>

                                        <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                                            {activity.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}