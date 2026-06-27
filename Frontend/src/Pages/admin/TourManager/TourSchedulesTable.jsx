import React from "react";
import CustomDataTable from "~/components/UI/Table/CustomDataTable";
import RowActionsButton from "~/components/UI/Table/Button/RowActionsButton";

export default function TourSchedulesTable({
    data = [],
    onView,
    onEdit,
    loading = false,
    showStatus = true,
    showCodeChuyen = true
}) {
    const safeData = Array.isArray(data) ? data : [];
    const statusColumn = {
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
    };
    const codeWidth = showStatus ? "240px" : "260px";
    const dateWidth = showStatus ? "150px" : "180px";
    const locationWidth = showStatus ? "120px" : "180px";
    const seatWidth = showStatus ? "120px" : "140px";
    const actionWidth = showStatus ? "130px" : "160px";
    const noteWidth = showStatus ? "120" : "155px"

    const columns = [
        {
            name: "STT",
            selector: (row, index) => index + 1,
            width: "70px",
            center: 'true',
        },
        ...(showCodeChuyen ? [{
            name: "Mã code chuyến",
            selector: (row) => row.maChuyenCode,
            width: codeWidth,
            cell: (row) => (
                <div>
                    <div className="text-[12px] font-bold text-slate-800">{row.maChuyenCode}</div>
                </div>
            ),
            sortable: true,
        }] : []),


        {
            name: "Ngày khởi hành",
            selector: (row) => row.ngayKhoiHanh,
            cell: (row) => row.ngayKhoiHanh ? new Date(row.ngayKhoiHanh).toLocaleDateString('vi-VN') : "---",
            sortable: true,
            width: dateWidth,
        },
        {
            name: "Điểm đi",
            selector: (row) => row.diemKhoiHanh,
            cell: (row) => row.diemKhoiHanh,
            sortable: true,
            width: locationWidth,
        },
        {
            name: "Điểm đến",
            selector: (row) => row.diemDen,
            cell: (row) => row.diemDen,
            sortable: true,
            idth: locationWidth,
        },
        // {
        //     name: "Ghi chú chuyến đi",
        //     selector: (row) => row.ghiChu,
        //     cell: (row) => row.ghiChu,
        //     sortable: true,
        //     idth: locationWidth,
        // },

        ...(showStatus ? [statusColumn] : []),
        {
            name: "Số chỗ",
            selector: (row) => row.soChoToiDa,
            width: seatWidth,
            center: 'true',
        },
        {
            name: "Hành động",
            cell: (row) => (
                <RowActionsButton
                    row={row}
                    onEdit={onEdit}
                    onView={onView}
                    showDelete={false}
                />
            ),
            width: actionWidth,
            center: 'true',
        },
    ];

    return (
        <CustomDataTable
            columns={columns}
            data={safeData}
            progressPending={loading}
            paginationComponentOptions={{
                rowsPerPageText: 'Số dòng:',
                rangeSeparatorText: 'trên',
                noRowsPerPage: false,
                selectAllRowsItem: true,
                selectAllRowsItemText: 'Tất cả',
            }}
            highlightOnHover
            pointerOnHover
            noDataComponent={
                <div className="py-8 text-center">
                    <p className="text-slate-400 text-sm">Không có dữ liệu</p>
                </div>
            }
        />
    );
}