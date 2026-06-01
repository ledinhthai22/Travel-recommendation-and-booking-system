import React from 'react'
import { 
    TrendingUp,
    Banknote,
    Backpack,
    Ticket,
    UserPlus
} from  'lucide-react'
const monthlyBookingTrend = [
    { month: "T1", domestic: 68, international: 42 },
    { month: "T2", domestic: 82, international: 51 },
    { month: "T3", domestic: 95, international: 67 },
    { month: "T4", domestic: 78, international: 55 },
    { month: "T5", domestic: 112, international: 84 },
    { month: "T6", domestic: 105, international: 73 },
];

const topDestinations = [
    {
        name: "Vịnh Hạ Long",
        province: "Quảng Ninh",
        bookings: 1248,
        growth: "+18.5%",
        revenue: "1.24 tỷ",
        image: "https://images.unsplash.com/photo-1524230507669-5ff97982bb5e?q=80&w=400"
    },
    {
        name: "Phú Quốc",
        province: "Kiên Giang",
        bookings: 987,
        growth: "+12.3%",
        revenue: "890 triệu",
        image: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?q=80&w=400"
    },
    {
        name: "Phố cổ Hội An",
        province: "Quảng Nam",
        bookings: 854,
        growth: "+9.8%",
        revenue: "670 triệu",
        image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=400"
    },
    {
        name: "Đà Lạt",
        province: "Lâm Đồng",
        bookings: 721,
        growth: "+15.2%",
        revenue: "580 triệu",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=400"
    },
];

const recentTransactions = [
    {
        customer: "Nguyễn Văn An",
        service: "Du thuyền Di sản Hạ Long 3N2Đ",
        time: "14:20 - 12/04/2026",
        amount: "4.850.000đ",
        status: "Đã thanh toán",
        statusColor: "bg-emerald-100 text-emerald-700"
    },
    {
        customer: "Trần Thị Mai",
        service: "Tour Sapa - Fansipan 2N1Đ",
        time: "09:45 - 12/04/2026",
        amount: "2.790.000đ",
        status: "Chờ xác nhận",
        statusColor: "bg-amber-100 text-amber-700"
    },
    {
        customer: "Lê Hoàng Nam",
        service: "Phú Quốc Beach Resort 4N3Đ",
        time: "17:30 - 11/04/2026",
        amount: "6.450.000đ",
        status: "Đã thanh toán",
        statusColor: "bg-emerald-100 text-emerald-700"
    },
    {
        customer: "Phạm Thu Hà",
        service: "Tour Đà Lạt mùa hoa",
        time: "11:15 - 11/04/2026",
        amount: "3.200.000đ",
        status: "Đã huỷ",
        statusColor: "bg-red-100 text-red-700"
    },
];

export default function Dashboard() {
    // Tính toán động cho biểu đồ
    const allValues = monthlyBookingTrend.flatMap(item => [item.domestic, item.international]);
    const maxValue = Math.max(...allValues);
    const chartHeight = 260;

    return (
        <div className="space-y-8 p-4">
            {/* Phần Cards - Giữ nguyên hoàn toàn */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                            <Banknote />
                        </div>
                        <span className="text-emerald-600 text-xs font-bold bg-emerald-50 px-3 py-1 rounded-2xl flex items-center gap-1">
                            <TrendingUp /> +12.5%
                        </span>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">Tổng doanh thu tháng này</p>
                    <h4 className="text-3xl font-extrabold text-slate-900 mt-2">2.845 tỷ</h4>
                    <p className="text-xs text-slate-400 mt-1">Tăng so với tháng trước</p>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center text-violet-600">
                            <Backpack />
                        </div>
                        <span className="text-violet-600 text-xs font-bold bg-violet-50 px-3 py-1 rounded-2xl">Đang chạy</span>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">Tour đang hoạt động</p>
                    <h4 className="text-3xl font-extrabold text-slate-900 mt-2">87</h4>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                            <Ticket />
                        </div>
                        <span className="text-red-600 text-xs font-bold bg-red-50 px-3 py-1 rounded-2xl">Cần xử lý</span>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">Đặt chỗ chờ xác nhận</p>
                    <h4 className="text-3xl font-extrabold text-slate-900 mt-2">31</h4>
                    <p className="text-xs text-amber-600 mt-2 font-medium">5 yêu cầu hết hạn hôm nay</p>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <UserPlus />
                        </div>
                        <span className="text-emerald-600 text-xs font-bold bg-emerald-50 px-3 py-1 rounded-2xl">+18 hôm nay</span>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">Khách hàng mới</p>
                    <h4 className="text-3xl font-extrabold text-slate-900 mt-2">1.284</h4>
                    <p className="text-xs text-slate-400 mt-1">Trong tháng này</p>
                </div>
            </section>

            {/* Chart + Top Destinations */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Biểu đồ xu hướng đặt tour - ĐÃ FIX */}
                <div className="lg:col-span-8 bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h5 className="text-xl font-extrabold text-slate-900">Xu hướng đặt tour</h5>
                            <p className="text-sm text-slate-500 mt-1">So sánh Tour nội địa và Tour quốc tế (6 tháng gần nhất)</p>
                        </div>
                        <div className="flex bg-slate-100 rounded-2xl p-1 text-sm font-medium">
                            <button className="px-6 py-2 rounded-xl bg-white shadow-sm text-slate-700">Tháng</button>
                            <button className="px-6 py-2 rounded-xl text-slate-400 hover:text-slate-600 transition-colors">Quý</button>
                        </div>
                    </div>

                    <div className="relative h-80 flex items-end gap-8 px-4">
                        {/* Grid lines */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="border-t border-slate-100 w-full" />
                            ))}
                        </div>

                        {/* Bars Container */}
                        <div className="flex-1 flex items-end gap-8 h-[260px] relative">
                            {monthlyBookingTrend.map((item, i) => {
                                const domesticHeight = (item.domestic / maxValue) * chartHeight;
                                const internationalHeight = (item.international / maxValue) * chartHeight;

                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center group relative">
                                        <div className="flex items-end gap-3 h-full w-full justify-center">
                                            {/* Cột Nội địa */}
                                            <div
                                                className="w-10 bg-blue-600 rounded-t-3xl transition-all duration-500 hover:bg-blue-700 relative"
                                                style={{ height: `${domesticHeight}px` }}
                                                title={`Nội địa: ${item.domestic} lượt`}
                                            >
                                                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                    {item.domestic}
                                                </span>
                                            </div>

                                            {/* Cột Quốc tế */}
                                            <div
                                                className="w-10 bg-violet-500 rounded-t-3xl transition-all duration-500 hover:bg-violet-600 relative"
                                                style={{ height: `${internationalHeight}px` }}
                                                title={`Quốc tế: ${item.international} lượt`}
                                            >
                                                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-violet-700 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                    {item.international}
                                                </span>
                                            </div>
                                        </div>

                                        <span className="text-xs font-bold text-slate-400 mt-4">{item.month}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="flex items-center justify-center gap-10 mt-10 border-t border-slate-100 pt-6">
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-3.5 bg-blue-600 rounded"></div>
                            <span className="text-sm font-medium text-slate-700">Tour nội địa</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-3.5 bg-violet-500 rounded"></div>
                            <span className="text-sm font-medium text-slate-700">Tour quốc tế</span>
                        </div>
                    </div>
                </div>

                {/* Top Điểm đến phổ biến - Giữ nguyên */}
                <div className="lg:col-span-4 bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h5 className="text-xl font-extrabold text-slate-900">Điểm đến phổ biến</h5>
                        <a href="#" className="text-blue-600 text-sm font-bold hover:underline">Xem tất cả →</a>
                    </div>

                    <div className="space-y-4 flex-1">
                        {topDestinations.map((dest, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer group">
                                <div className="w-14 h-14 rounded-2xl overflow-hidden border border-slate-100 shrink-0">
                                    <img
                                        src={dest.image}
                                        alt={dest.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                                        {dest.name}
                                    </p>
                                    <p className="text-xs text-slate-500">{dest.province}</p>
                                    <p className="text-sm text-slate-600 mt-1">{dest.bookings} lượt đặt</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-emerald-600 bg-emerald-100 rounded-2xl">{dest.growth}</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">{dest.revenue}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Giao dịch gần đây - Giữ nguyên */}
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h5 className="text-xl font-extrabold text-slate-900">Giao dịch gần đây</h5>
                        <p className="text-sm text-slate-500 mt-1">Các thanh toán tour mới nhất trong 7 ngày qua</p>
                    </div>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 hover:bg-slate-100 rounded-2xl text-sm font-semibold text-slate-600 transition-all">
                        Xem tất cả
                        <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                        <thead>
                            <tr className="border-b border-slate-200 text-xs uppercase font-bold text-slate-400">
                                <th className="py-5 text-left pl-3">Khách hàng</th>
                                <th className="py-5 text-left">Dịch vụ</th>
                                <th className="py-5 text-left hidden lg:table-cell">Thời gian</th>
                                <th className="py-5 text-right">Số tiền</th>
                                <th className="py-5 text-center">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {recentTransactions.map((tx, i) => (
                                <tr key={i} className="hover:bg-slate-50 transition-colors">
                                    <td className="py-6 pl-3">
                                        <div className="flex items-center gap-3">
                                            <p className="font-semibold text-slate-800">{tx.customer}</p>
                                        </div>
                                    </td>
                                    <td className="py-6">
                                        <p className="text-sm text-slate-600">{tx.service}</p>
                                    </td>
                                    <td className="py-6 hidden lg:table-cell">
                                        <p className="text-sm text-slate-400 font-medium">{tx.time}</p>
                                    </td>
                                    <td className="py-6 text-right font-bold text-slate-800 whitespace-nowrap">
                                        {tx.amount}
                                    </td>
                                    <td className="py-6 text-center">
                                        <span className={`inline-block px-4 py-1 text-xs font-bold rounded-2xl ${tx.statusColor}`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}