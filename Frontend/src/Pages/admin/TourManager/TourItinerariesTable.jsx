import React from "react";
import { Utensils } from "lucide-react";
import CustomDataTable from "~/components/UI/Table/CustomDataTable";
import RowActionsButton from "~/components/UI/Table/Button/RowActionsButton";

export default function TourItinerariesTable({
    data = [],
    onEdit,
    onDelete,
    isViewMode = false,
    loading = false
}) {
    const safeData = Array.isArray(data) ? data : [];
    const getImageUrl = (path) => {
        if (!path) return null;

        if (path.startsWith("blob:")) {
            return path;
        }

        if (path.startsWith("/")) {
            return `${import.meta.env.VITE_API_URL}${path}`;
        }

        return path;
    };
    const columns = [
        {
            name: "Ngày",
            selector: (row) => row.soThuTuNgay,
            cell: (row) => (
                <span className="inline-block px-2.5 py-1 text-xs font-bold rounded-md">
                    Ngày {row.soThuTuNgay}
                </span>
            ),
            width: "90px",
            center: true,
            sortable: true,
        },
        {
            name: "Hình ảnh",
            width: "150px",
            center: 'true',
            cell: (row) => {
                const imageSrc = row.preview
                    ? row.preview
                    : getImageUrl(row.duongDanAnh);

                return (
                    <div className="w-40 h-15 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0 my-1">
                        {imageSrc ? (
                            <img
                                src={imageSrc}
                                alt="Ảnh ngày"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src =
                                        "https://placehold.co/100x60?text=No+Image";
                                }}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">
                                Không ảnh
                            </div>
                        )}
                    </div>
                );
            },
        },
        {
            name: "Tiêu đề ngày",
            selector: (row) => row.tenLichTrinh || "---",
            cell: (row) => (
                <p className="font-semibold text-slate-700 line-clamp-2" title={row.tenLichTrinh}>
                    {row.tenLichTrinh || "---"}
                </p>
            ),
            grow: 2,
            sortable: true,
            center: 'true'
        },
        {
            name: "Bữa ăn",
            selector: (row) => row.buaAn || "",
            cell: (row) => (
                row.buaAn ? (
                    <span className="inline-flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full font-medium">
                        <Utensils size={13} className="text-amber-500" />
                        {row.buaAn}
                    </span>
                ) : (
                    <span className="text-slate-400 italic text-xs">Không có</span>
                )
            ),
            width: "160px",
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
            center: 'true',
        },
        {
            name: "Hành động",
            cell: (row) => (
                <RowActionsButton
                    row={row}
                    onView={isViewMode ? () => onEdit(row) : null}
                    onEdit={!isViewMode ? () => onEdit(row) : null}
                    onDelete={
                        !isViewMode && safeData.length > 1
                            ? () => onDelete(row)
                            : null
                    }
                    showDelete={
                        !isViewMode && safeData.length > 1
                    }
                />
            ),
            width: "180px",
            center: 'true',
        },
    ];

    const conditionalRowStyles = [
        {
            when: (row) => !row.trangThai,
            style: {
                backgroundColor: "rgba(248, 250, 252, 0.6)",
                opacity: 0.7,
            },
        },
    ];

    return (
        <CustomDataTable
            columns={columns}
            data={safeData}
            loading={loading}
            conditionalRowStyles={conditionalRowStyles}
            noDataComponent={
                <div className="py-10 text-center text-slate-500">
                    Chưa có ngày nào trong lịch trình
                </div>
            }
        />
    );
}