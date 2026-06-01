import React, { useState, useRef } from 'react';
import {
    Funnel,
    BetweenHorizontalEnd,
    FileUp,
    FileDown,
    Plus
} from 'lucide-react';
export default function ManagerToolbar({
    searchPlaceholder,
    onSearchChange,
    addButtonText,
    onAddClick,
    showCategoryFilter = false,
    showAddButton = true,
    showExcel = true
}) {
    const [isExcelOpen, setIsExcelOpen] = useState(false);
    const excelRef = useRef(null);
    return (
        <div className="p-4 rounded-2xl border border-slate-200/60 shadow-sm bg-white">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                <div className="flex flex-col md:flex-row flex-1 items-stretch md:items-center gap-3">
                    <div className="relative flex-1 max-w-sm">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all font-medium"
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
                            <Funnel size={15} />
                            Bộ lọc
                        </button>
                        {showCategoryFilter && (
                            <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
                                {/* <span className="material-symbols-outlined text-lg">category</span> */}
                                <span>Loại hình</span>
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Excel Operations */}
                    {showExcel && (
                        <div ref={excelRef} className="relative hidden sm:block">
                            <button
                                onClick={() => setIsExcelOpen(!isExcelOpen)}
                                className="flex items-center gap-2 px-5 py-1.5 bg-white border border-emerald-500 text-emerald-600 rounded-xl text-sm font-bold hover:bg-emerald-50 transition-all shadow-sm active:scale-95 min-w-[160px]"
                            >
                                <BetweenHorizontalEnd size={15} />
                                <span className="hidden lg:inline">Nhập / Xuất Excel</span>
                                <span className={`material-symbols-outlined text-sm transition-transform duration-300 ${isExcelOpen ? 'rotate-180' : ''}`}>
                                    arrow_drop_down
                                </span>
                            </button>

                            {isExcelOpen && (
                                <div className="absolute right-0 mt-1 w-full bg-white border border-slate-100 shadow-xl rounded-xl py-2 z-50">
                                    <button className="w-full px-5 py-2.5 text-center text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-3 border-t border-slate-50">
                                        <FileUp size={16} color='blue' />
                                        Nhập Excel
                                    </button>
                                    <button className="w-full px-5 py-2.5 text-center text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-3">
                                        <FileDown size={16} color='green' />
                                        Xuất Excel
                                    </button>
                                </div>
                            )}

                        </div>

                    )}


                    {showAddButton && (
                        <>
                            <div className="h-10 w-px bg-slate-200 hidden md:block" />
                            <button
                                onClick={onAddClick}
                                className="px-5 py-1.5 h-10 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:opacity-90 active:scale-95 transition-all flex items-center gap-2"
                            >
                                <Plus size={20} />
                                <span>{addButtonText}</span>
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

