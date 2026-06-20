import React from "react";
import CustomDataTable from "~/components/UI/Table/CustomDataTable"; // Điều chỉnh đường dẫn cho đúng cấu trúc thư mục của bạn
import RowActionsButton from "~/components/UI/Table/Button/RowActionsButton";

export default function TourSchedulesTable({ data, onView, onEdit, loading = false }) {
    
    // Định nghĩa các cột cho bảng dữ liệu dưới Mô tả tour
    const columns = [
        {
            name: "STT",
            selector: (row, index) => index + 1,
            width: "70px",
            center: true,
        },
        {
            name: "Tên chuyến / Ngày khởi hành",
            selector: (row) => row.tenChuyen || row.ngayKhoiHanh || "Chưa xác định",
            sortable: true,
            grow: 2,
        },
        {
            name: "Giá tour (VND)",
            selector: (row) => row.giaTour?.toLocaleString("vi-VN") || "0",
            sortable: true,
        },
        {
            name: "Trạng thái",
            cell: (row) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    row.trangThai ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
                }`}>
                    {row.trangThai ? "Sẵn sàng" : "Tạm ngưng"}
                </span>
            ),
            width: "120px",
        },
        {
            name: "Hành động",
            cell: (row) => (
                <RowActionsButton
                    row={row}
                    onView={onView}
                    onEdit={onEdit}
                    // Ẩn các tính năng không cần thiết của User Account
                    showLock={false}
                    showUnlock={false}
                    showResetPass={false}
                    showDelete={false}
                />
            ),
            allowOverflow: true,
            button: true,
            width: "140px",
            center: true,
        },
    ];

    return (
        <CustomDataTable
            columns={columns}
            data={data}
            loading={loading}
        />
    );
}