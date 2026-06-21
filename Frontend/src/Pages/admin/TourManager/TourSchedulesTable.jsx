import React from "react";
import CustomDataTable from "~/components/UI/Table/CustomDataTable";
import RowActionsButton from "~/components/UI/Table/Button/RowActionsButton";

export default function TourSchedulesTable({
    data = [],
    onView,
    onEdit,
    loading = false
}) {
    const safeData = Array.isArray(data) ? data : [];

    const columns = [
        {
            name: "STT",
            selector: (row, index) => index + 1,
            width: "70px",
            center: true,
        },
        {
            name: "Mã chuyến ",
            selector: (row) =>  row.maChuyenCode,
            width: "240px",
            cell: (row) => (
                <div>
                    <div className="text-[12px] font-bold text-slate-800">{row.maChuyenCode}</div>
                </div>
            ),
            sortable: true,
        },
      
        {
            name: "Ngày khởi hành",
            selector: (row) => row.ngayKhoiHanh,
            cell: (row) => row.ngayKhoiHanh ? new Date(row.ngayKhoiHanh).toLocaleDateString('vi-VN') : "---",
            sortable: true,
            width: "150px",
        },
        {
            name: "Điểm đi",
            selector: (row) => row.diemKhoiHanh,
            cell: (row) => row.diemKhoiHanh ,
            sortable: true,
            width: "120px",
        },
        {
            name: "Điểm đến",
            selector: (row) => row.diemDen,
            cell: (row) => row.diemDen,
            sortable: true,
            width: "120px",
        },
        {
            name: "Trạng thái",
            cell: (row) => {
                const map = {
                    0: {
                        text: "Hết chỗ",
                        className: "bg-red-100 text-red-700"
                    },
                    1: {
                        text: "Đang mở bán",
                        className: "bg-green-100 text-green-700"
                    },
                    2: {
                        text: "Đã khởi hành",
                        className: "bg-blue-100 text-blue-700"
                    },
                    3: {
                        text: "Sắp mở",
                        className: "bg-amber-100 text-amber-700"
                    }
                };

                const status = map[row.trangThai] || {
                    text: "Không xác định",
                    className: "bg-gray-100 text-gray-600"
                };

                return (
                    <span
                        className={`px-5 py-1 rounded-full text-xs font-bold ${status.className}`}
                    >
                        {status.text}
                    </span>
                );
            },
            width: "150px",
        },
        {
            name: "Số chỗ",
            selector: (row) => row.soLuongCho,
            width: "120px",
            center: 'true',
        },
        {
            name: "Hành động",
            cell: (row) => (
                <RowActionsButton
                    row={row}
                    onView={onView}
                    onEdit={onEdit}
                    showDelete={false}
                />
            ),
            width: "130px",
           center: 'true',
        },
    ];

    return (
        <CustomDataTable
            columns={columns}
            data={safeData}
            progressPending={loading}
            noDataComponent={
                <div className="py-10 text-center text-slate-500">
                    Chưa có chuyến khởi hành nào
                </div>
            }
        />
    );
}