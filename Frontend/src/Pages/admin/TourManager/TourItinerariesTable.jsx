import React from "react";
import { Utensils } from "lucide-react";
import CustomDataTable from "~/components/UI/Table/CustomDataTable";
import RowActionsButton from "~/components/UI/Table/Button/RowActionsButton";
export default function TourItinerariesTable({
    data,
    onEdit,
    onRemove,
    onToggleStatus,
    loading = false
}) {

    const columns = [
        {
            name: "Ngày",
            selector: (row) => row.soThuTuNgay,
            cell: (row) => (
                <span className="inline-block px-2.5 py-1  text-xs font-bold  ">
                    Ngày {row.soThuTuNgay}
                </span>
            ),
            width: "90px",
            center: true,
            sortable: true,
        },
        {
            name: "Hình ảnh",
            cell: (row) => (
                <div className="w-20 h-14 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 shadow-sm flex-shrink-0 my-1">
                    {row.preview ? (
                        <img src={row.preview} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400 font-medium">
                            Không ảnh
                        </div>
                    )}
                </div>
            ),
            width: "110px",
        },
        {
            name: "Tiêu đề",
            selector: (row) => row.tenLichTrinh || "---",
            cell: (row) => (
                <p className="font-semibold text-slate-700 line-clamp-2" title={row.tenLichTrinh}>
                    {row.tenLichTrinh || "---"}
                </p>
            ),
            grow: 2,
            sortable: true,
        },
        {
            name: "Chế độ ăn",
            selector: (row) => row.buaAn || "",
            cell: (row) => (
                row.buaAn ? (
                    <span className="inline-flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full font-medium">
                        <Utensils size={13} className="text-amber-500" />
                        {row.buaAn}
                    </span>
                ) : (
                    <span className="text-slate-400 italic text-xs">Không tính kèm</span>
                )
            ),
            width: "150px",
        },
        {
            name: "Hoạt động chính",
            selector: (row) => row.hoatDongChinh || "",
            cell: (row) => (
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2" title={row.hoatDongChinh}>
                    {row.hoatDongChinh || "---"}
                </p>
            ),
            grow: 2,
        },
        {
            name: "Hành động",
            cell: (row) => (
                <RowActionsButton
                    row={row}
                    onView={false}
                    onEdit={onEdit}
                    showDelete={false}
                />
            ),
            width: "130px",
            center: true,
        },
    ];

    const conditionalRowStyles = [
        {
            when: (row) => !row.trangThai,
            style: {
                backgroundColor: "rgba(248, 250, 252, 0.5)",
                opacity: 0.6,
            },
        },
    ];

    return (
        <CustomDataTable
            columns={columns}
            data={data}
            loading={loading}
            conditionalRowStyles={conditionalRowStyles}
        />
    );
}