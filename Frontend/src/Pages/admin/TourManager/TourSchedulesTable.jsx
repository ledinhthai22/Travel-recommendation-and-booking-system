import React from "react";
import CustomDataTable from "~/components/UI/Table/CustomDataTable";
import RowActionsButton from "~/components/UI/Table/Button/RowActionsButton";

export default function TourSchedulesTable({
    data = [],
    onView,
    onEdit,
    loading = false,
    showStatus = true,
    showCodeChuyen = true,
    isCreateMode = false
}) {
    const safeData = Array.isArray(data) ? data : [];

    const statusColumn = {
        name: "Trạng thái",
        width: "150px",
        center: true,
        cell: (row) => {
            const statusMap = {
                1: { text: "Sắp khởi hành", className: "bg-amber-100 text-amber-700" },
                2: { text: "Đang khởi hành", className: "bg-blue-100 text-blue-700" },
                3: { text: "Đã kết thúc", className: "bg-gray-100 text-gray-700" },
                4: { text: "Đã hủy", className: "bg-red-100 text-red-700" },
            };

            const status = statusMap[row.trangThai] ?? {
                text: "Không xác định",
                className: "bg-gray-100 text-gray-600",
            };

            return (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.className}`}>
                    {status.text}
                </span>
            );
        },
    };

    const columns = [
        {
            name: "STT",
            cell: (_, index) => (
                <span className="font-medium text-slate-500">{index + 1}</span>
            ),
            width: "60px",
            center: true,
        },

        ...(!isCreateMode && showCodeChuyen
            ? [
                {
                    name: "Mã chuyến",
                    selector: (row) => row.maChuyenCode,
                    cell: (row) => (
                        <span className="font-mono font-semibold">
                            {row.maChuyenCode || "---"}
                        </span>
                    ),
                    width: "180px",
                },
            ]
            : []),

        {
            name: "Ngày khởi hành",
            selector: (row) => row.ngayKhoiHanh,
            cell: (row) =>
                row.ngayKhoiHanh
                    ? new Date(row.ngayKhoiHanh).toLocaleDateString("vi-VN")
                    : "---",
            width: "140px",
        },

        {
            name: "Ngày kết thúc",
            selector: (row) => row.ngayKetThuc,
            cell: (row) =>
                row.ngayKetThuc
                    ? new Date(row.ngayKetThuc).toLocaleDateString("vi-VN")
                    : "---",
            width: "140px",
        },

        {
            name: "Điểm đi",
            selector: (row) => row.diemKhoiHanh,
            cell: (row) => row.diemKhoiHanh || "---",
            width: "170px",
        },

        {
            name: "Điểm đến",
            selector: (row) => row.diemDen,
            cell: (row) => row.diemDen || "---",
            grow: 1,
            minWidth: "220px",
        },

        // Chỉ hiện ở trang quản lý
        ...(!isCreateMode && showStatus ? [statusColumn] : []),

        {
            name: "Số chỗ",
            width: "120px",
            center: true,
            cell: (row) => {
                const toiDa = row.soChoToiDa ?? 0;
                const daDat = row.soChoDaDat ?? 0;
                const conLai = toiDa - daDat;

                return isCreateMode ? (
                    <span className="font-semibold">{toiDa}</span>
                ) : (
                    <div className="flex flex-col items-center">
                        <span className="font-semibold">{toiDa}</span>
                        <span
                            className={`text-xs ${conLai > 0
                                    ? "text-emerald-600"
                                    : "text-red-500"
                                }`}
                        >
                            Còn {conLai}
                        </span>
                    </div>
                );
            },
        },

        {
            name: "Hành động",
            width: "120px",
            center: true,
            cell: (row) => {
                const isLocked =
                    row.trangThai === 2 ||
                    row.trangThai === 3 ||
                    row.trangThai === 4 ||
                    row.soChoDaDat > 0;

                return (
                    <RowActionsButton
                        row={row}
                        onView={!isCreateMode ? onView : null}
                        onEdit={isLocked ? null : onEdit}
                    />
                );
            },
        },
    ];

    return (
        <CustomDataTable
            columns={columns}
            data={safeData}
            progressPending={loading}
            paginationComponentOptions={{
                rowsPerPageText: "Số dòng:",
                rangeSeparatorText: "trên",
                noRowsPerPage: false,
                selectAllRowsItem: true,
                selectAllRowsItemText: "Tất cả",
            }}
            highlightOnHover
            pointerOnHover
            noDataComponent={
                <div className="py-12 text-center">
                    <p className="text-slate-400">Chưa có chuyến khởi hành nào</p>
                </div>
            }
        />
    );
}