export const LOAI_HOAT_DONG_OPTIONS = [
    { value: "TAP_TRUNG", label: "Tập trung", color: "slate", bgClass: "bg-slate-100", textClass: "text-slate-700", borderClass: "border-slate-300" },
    { value: "DI_CHUYEN", label: "Di chuyển", color: "slate", bgClass: "bg-slate-100", textClass: "text-slate-700", borderClass: "border-slate-300" },
    { value: "THAM_QUAN", label: "Tham quan", color: "slate", bgClass: "bg-slate-100", textClass: "text-slate-700", borderClass: "border-slate-300" },
    { value: "AN_UONG", label: "Ăn uống", color: "slate", bgClass: "bg-slate-100", textClass: "text-slate-700", borderClass: "border-slate-300" },
    { value: "NGHI_NGOI", label: "Nghỉ ngơi", color: "slate", bgClass: "bg-slate-100", textClass: "text-slate-700", borderClass: "border-slate-300" },
    { value: "KHAC", label: "Khác", color: "slate", bgClass: "bg-slate-100", textClass: "text-slate-700", borderClass: "border-slate-300" },
];

export const LOAI_HOAT_DONG_MAP = Object.fromEntries(
    LOAI_HOAT_DONG_OPTIONS.map(opt => [opt.value, opt])
);

export const getColorClass = (value) => {
    const option = LOAI_HOAT_DONG_MAP[value];
    if (!option) return 'bg-slate-100 text-slate-700 border-slate-300';
    return `${option.bgClass} ${option.textClass} border ${option.borderClass}`;
};

export const getSelectedColorClass = (value) => {
    return 'bg-slate-500 text-white border-transparent';
};