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
                1: { text: "Sắp khởi hành", className: "bg-yellow-100 text-yellow-700" },
                2: { text: "Đang khởi hành", className: "bg-blue-100 text-blue-700" },
                3: { text: "Đã kết thúc", className: "bg-gray-100 text-gray-700" },
                "": { text: "Không xác định", className: "bg-gray-100 text-gray-700" },
            };
            const status = map[row.trangThai] || { text: "Không xác định", className: "bg-gray-100 text-gray-600" };
            return (
                <span className={`px-5 py-1 rounded-full text-xs font-bold ${status.className}`}>
                    {status.text}
                </span>
            );
        },
        width: "150px",
    };

    const codeWidth = showStatus ? "240px" : "260px";
    const dateWidth = showStatus ? "150px" : "180px";
    const locationWidth = showStatus ? "120px" : "180px";
    const seatWidth = showStatus ? "140px" : "160px";
    const actionWidth = showStatus ? "130px" : "160px";

    const columns = [
        {
            name: "STT",
            selector: (_, index) => index + 1,
            cell: (_, index) => index + 1,
            width: "70px",
            center: true,
        },
        ...(showCodeChuyen ? [{
            name: "Mã code chuyến",
            selector: (row) => row.maChuyenCode,
            cell: (row) => (
                <div className="text-[12px] font-bold text-slate-800">{row.maChuyenCode}</div>
            ),
            sortable: true,
            width: codeWidth,
        }] : []),
        {
            name: "Ngày khởi hành",
            selector: (row) => row.ngayKhoiHanh,
            cell: (row) => row.ngayKhoiHanh
                ? new Date(row.ngayKhoiHanh).toLocaleDateString("vi-VN")
                : "---",
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
            width: locationWidth,
        },
        ...(showStatus ? [statusColumn] : []),
        {
            name: "Số chỗ",
            width: seatWidth,
            center: true,
            cell: (row) => {
                const toiDa = row.soChoToiDa ?? 0;
                const daDat = row.soChoDaDat ?? 0;
                const conLai = toiDa - daDat;

                // Chỉ hiện chi tiết khi có onView (chế độ xem)
                if (onView) {
                    return (
                        <div className="flex flex-col items-center leading-tight">
                            <span className={`text-[11px] font-semibold ${conLai > 0 ? "text-slate-600" : "text-red-500"}`}>
                                Còn {conLai}
                            </span>
                        </div>
                    );
                } else {
                    return (
                        <span className="text-[12px] font-bold text-slate-800">{toiDa}</span>
                    );
                }

            },
        },
        {
            name: "Hành động",
            cell: (row) => {
                const isLocked =
                    row.trangThai === 2 ||
                    row.trangThai === 3 ||
                    row.trangThai === 4 ||
                    row.soChoDaDat > 0;
                return (
                    <RowActionsButton
                        row={row}
                        onView={onView}
                        onEdit={isLocked ? null : onEdit}
                    />
                );
            },
            width: actionWidth,
            center: true,
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
                <div className="py-8 text-center">
                    <p className="text-slate-400 text-sm">Không có dữ liệu</p>
                </div>
            }
        />
    );
}