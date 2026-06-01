import { Search } from 'lucide-react';

export default function EmptyState({
    icon: Icon = Search,
    title = 'Không tìm thấy dữ liệu',
    keyword = '',
    keywordLabel = 'từ khóa',
    emptyMessage = 'Không có dữ liệu phù hợp với bộ lọc hiện tại.',
    suggestions = [
        'Thử từ khóa khác',
        'Xóa bớt bộ lọc',
        'Chọn danh mục khác',
    ],
    buttonText = 'Xóa bộ lọc',
    onReset,
}) {
    return (
        <div className="flex flex-col items-center rounded-3xl border border-slate-100 bg-white px-6 py-20 text-center shadow-sm">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
                <Icon className="text-[#0EA5E5]" size={36} />
            </div>

            <h3 className="text-xl font-bold text-slate-800">
                {title}
            </h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
                {keyword ? (
                    <>
                        Không có kết quả phù hợp với {keywordLabel}{' '}
                        <b className="text-slate-600">"{keyword}"</b>.
                    </>
                ) : (
                    <>{emptyMessage}</>
                )}
            </p>

            {suggestions.length > 0 && (
                <div className="mt-5 space-y-1 text-sm text-slate-400">
                    <p>Gợi ý:</p>
                    {suggestions.map((item) => (
                        <p key={item}>• {item}</p>
                    ))}
                </div>
            )}

            {onReset && (
                <button
                    type="button"
                    onClick={onReset}
                    className="mt-6 rounded-xl bg-[#0EA5E5] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0EA5E5]"
                >
                    {buttonText}
                </button>
            )}
        </div>
    );
}