import React, { useMemo } from 'react';
import DataTableLib from 'react-data-table-component';
import { TrendingUp, TrendingDown, Eye } from 'lucide-react';
import CustomDataTable from '~/components/UI/Table/CustomDataTable';
import ManagerToolbar from '~/components/UI/ToolBar/ToolBar';
const DataTable = DataTableLib.default || DataTableLib;

const TOUR_REVENUE_DATA = [
    { id: 1, tourName: "Vịnh Hạ Long 3N2Đ", tourCode: "HL-202604", bookings: 184, revenue: 1820000000, revenueFormatted: "1.82 tỷ", growth: 24.5, avgPrice: "9.890.000đ", status: "Hot" },
    { id: 2, tourName: "Phú Quốc Beach Resort 4N3Đ", tourCode: "PQ-202605", bookings: 156, revenue: 1450000000, revenueFormatted: "1.45 tỷ", growth: 18.2, avgPrice: "9.295.000đ", status: "Hot" },
    { id: 3, tourName: "Đà Lạt mùa hoa 3N2Đ", tourCode: "DL-202604", bookings: 98, revenue: 890000000, revenueFormatted: "890 triệu", growth: 12.8, avgPrice: "9.082.000đ", status: "Tốt" },
    { id: 4, tourName: "Fansipan Sapa 2N1Đ", tourCode: "SP-202604", bookings: 87, revenue: 680000000, revenueFormatted: "680 triệu", growth: -3.4, avgPrice: "7.816.000đ", status: "Trung bình" },
    { id: 5, tourName: "Tràng An - Ninh Bình 2N1Đ", tourCode: "TA-202604", bookings: 64, revenue: 520000000, revenueFormatted: "520 triệu", growth: 31.2, avgPrice: "8.125.000đ", status: "Tăng mạnh" },
];


export default function RevenueByTour() {

    const totalRevenue = useMemo(() => TOUR_REVENUE_DATA.reduce((sum, t) => sum + t.revenue, 0), []);
    const totalBookings = useMemo(() => TOUR_REVENUE_DATA.reduce((sum, t) => sum + t.bookings, 0), []);

    const columns = [
        {
            name: 'Thông tin Tour',
            selector: row => row.tourName,
            sortable: true,
            grow: 2,
            cell: row => (
                <div className="flex flex-col py-2">
                    <span className="font-bold text-slate-800">{row.tourName}</span>
                    <span className="text-xs font-mono text-slate-400">{row.tourCode}</span>
                </div>
            ),
        },
        {
            name: 'Tỷ trọng doanh thu',
            selector: row => row.revenue,
            sortable: true,
            grow: 1.5,
            cell: row => {
                const percentage = (row.revenue / totalRevenue) * 100;
                return (
                    <div className="flex flex-col gap-1 w-full pr-4">
                        <div className="flex justify-between text-xs font-medium">
                            <span>{row.revenueFormatted}</span>
                            <span className="text-slate-400">{percentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div
                                className="bg-blue-500 h-full rounded-full transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                    </div>
                );
            },
        },
        {
            name: 'Lượt đặt',
            selector: row => row.bookings,
            sortable: true,
            center: true,
            cell: row => (
                <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold text-xs">
                    {row.bookings}
                </span>
            ),
        },
        {
            name: 'Tăng trưởng',
            selector: row => row.growth,
            sortable: true,
            cell: row => (
                <div className={`flex items-center gap-1 font-bold ${row.growth >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    {row.growth >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {row.growth > 0 ? `+${row.growth}` : row.growth}%
                </div>
            ),
        },
        {
            name: 'Thao tác',
            button: true,
            width: '80px',
            cell: () => (
                <button className="p-2 hover:bg-indigo-50 hover:text-blue-600 rounded-lg text-slate-400 transition-colors">
                    <Eye size={18} />
                </button>
            ),
        },
    ];

    return (
        <div className="space-y-8 p-4">


            {/* 3 Thẻ Stats Overview ở trên */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: 'Tổng doanh thu', value: `${(totalRevenue / 1e9).toFixed(2)} tỷ`, icon: <TrendingUp className="text-blue-600" /> },
                    { label: 'Tổng lượt đặt', value: totalBookings.toLocaleString(), color: 'text-slate-900', icon: <TrendingUp className="text-blue-600" /> },
                    { label: 'Hiệu suất TB', value: '84.5%', color: 'text-emerald-700', icon: <TrendingUp className="text-emerald-600" /> },
                ].map((card, i) => (
                    <div key={i} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{card.label}</p>
                            <p className={`text-2xl font-bold mt-1 ${card.color}`}>{card.value}</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-2xl">{card.icon || <div className="w-5 h-5" />}</div>
                    </div>
                ))}
            </div>
            <ManagerToolbar
                showAddButton={false}
                showExcel={false}
            />

            <CustomDataTable
                columns={columns}
                data={TOUR_REVENUE_DATA}
                defaultSortFieldId={2} // Mặc định sort theo cột doanh thu
                defaultSortAsc={false} // Giảm dần
            />

        </div>
    );
}