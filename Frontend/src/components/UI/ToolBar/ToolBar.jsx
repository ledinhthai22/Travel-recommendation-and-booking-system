import {
    ChevronDown,
    Plus,
    BetweenHorizontalEnd,
    FileUp,
    FileDown,
} from "lucide-react";

import { useRef, useState } from "react";
import Dropdown from "~/components/Common/Dropdown";

export default function ManagerToolbar({
    searchPlaceholder = "Tìm kiếm...",
    onSearchChange,

    showAddButton = true,
    addButtonText = "Thêm mới",
    onAddClick,

    filters = [],

    showExcel = true,
    showImportExcel = true,
    showExportExcel = true,

    onImportExcel,
    onExportExcel,

    className = "",
}) {
    const [isExcelOpen, setIsExcelOpen] = useState(false);
    const excelRef = useRef(null);

    return (
        <div
            className={`p-3 rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}
        >
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                {/* Search + Filter */}
                <div className="flex flex-col md:flex-row flex-1 gap-3">
                    <div className="relative flex-1 max-w-md">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                            search
                        </span>

                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            onChange={(e) =>
                                onSearchChange?.(e.target.value)
                            }
                            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-sky-500 focus:outline-none"
                        />
                    </div>

                    {filters.map((filter, index) => (
                        <div key={index} className="w-44">
                            <Dropdown
                                placeholder={filter.placeholder}
                                value={filter.value}
                                onChange={filter.onChange}
                                options={filter.options}
                            />
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    {showExcel && (
                        <div ref={excelRef} className="relative">
                            <button
                                onClick={() =>
                                    setIsExcelOpen(!isExcelOpen)
                                }
                                className="flex items-center gap-2 px-5 py-2 border border-emerald-500 text-emerald-600 rounded-xl text-sm font-semibold"
                            >
                                <BetweenHorizontalEnd size={16} />

                                Excel

                                <span
                                    className={`transition-transform ${
                                        isExcelOpen
                                            ? "rotate-180"
                                            : ""
                                    }`}
                                >
                                    <ChevronDown size={16} />
                                </span>
                            </button>

                            {isExcelOpen && (
                                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden">
                                    {showImportExcel && (
                                        <button
                                            onClick={() => {
                                                onImportExcel?.();
                                                setIsExcelOpen(false);
                                            }}
                                            className="w-full px-4 py-3 flex items-center gap-3 text-sm font-medium hover:bg-slate-50"
                                        >
                                            <FileUp size={16} />

                                            Nhập Excel
                                        </button>
                                    )}

                                    {showExportExcel && (
                                        <button
                                            onClick={() => {
                                                onExportExcel?.();
                                                setIsExcelOpen(false);
                                            }}
                                            className="w-full px-4 py-3 flex items-center gap-3 text-sm font-medium hover:bg-slate-50"
                                        >
                                            <FileDown size={16} />

                                            Xuất Excel
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {showAddButton && (
                        <>
                            <div className="h-10 w-px bg-slate-200 hidden md:block" />

                            <button
                                onClick={onAddClick}
                                className="h-10 px-5 rounded-xl bg-sky-500 text-white font-semibold text-sm flex items-center gap-2 hover:opacity-90"
                            >
                                <Plus size={16} />

                                {addButtonText}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}