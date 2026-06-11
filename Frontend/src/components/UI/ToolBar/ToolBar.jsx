import {
    ChevronDown,
    Funnel,
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

    // ADD BUTTON
    showAddButton = true,
    addButtonText = "Thêm mới",
    onAddClick,

    // FILTER CONFIG (NEW FLEXIBLE)
    filters = [],

    // EXCEL
    showExcel = true,
    showImportExcel = true,
    showExportExcel = true,

    className = "",
}) {
    const [isExcelOpen, setIsExcelOpen] = useState(false);
    const excelRef = useRef(null);

    return (
        <div className={`p-[10px] rounded-2xl border border-slate-200/60 shadow-sm bg-white ${className}`}>
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                <div className="flex flex-col md:flex-row flex-1 items-stretch md:items-center gap-3">
                    <div className="relative flex-1 max-w-sm">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
                            search
                        </span>

                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-sky-600 focus:border-sky-600 focus:outline-none rounded-xl text-sm transition-colors"
                            onChange={(e) => onSearchChange?.(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {filters.map((filter, index) => (
                            <div key={index} className="w-44">
                                <Dropdown
                                    placeholder={filter.placeholder || "Filter"}
                                    value={filter.value}
                                    onChange={filter.onChange}
                                    options={filter.options || []}
                                />
                            </div>
                        ))}
                    </div>

                </div>

    
                <div className="flex items-center gap-3">

                    {showExcel && (
                        <div ref={excelRef} className="relative hidden sm:block">
                            <button
                                onClick={() => setIsExcelOpen(!isExcelOpen)}
                                className="flex items-center gap-2 px-5 py-[8px] bg-white border border-emerald-500 text-emerald-600 rounded-xl text-sm font-bold"
                            >
                                <BetweenHorizontalEnd size={15} />
                                Thao tác với Excel

                                <span className={`transition-transform ${isExcelOpen ? "rotate-180" : ""}`}>
                                    <ChevronDown size={15} />
                                </span>
                            </button>

                            {isExcelOpen && (
                                <div className="absolute right-0 mt-2 w-full bg-white shadow-xl rounded-xl py-2 z-50">

                                    {showImportExcel && (
                                        <button className="w-full px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-3">
                                            <FileUp size={16} color="blue" />
                                            Nhập Excel
                                        </button>
                                    )}

                                    {showExportExcel && (
                                        <button className="w-full px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-3">
                                            <FileDown size={16} color="green" />
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
                                className="px-5 py-1.5 h-10 bg-[#0EA5E5] text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:opacity-90 active:scale-95 transition-all flex items-center gap-2"
                            >
                                <Plus size={16} />
                                <span>{addButtonText}</span>
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}