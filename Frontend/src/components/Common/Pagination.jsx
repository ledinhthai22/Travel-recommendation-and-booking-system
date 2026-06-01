import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-1.5 mt-12">
            <PaginationBtn 
                onClick={() => onPageChange(p => Math.max(1, p - 1))} 
                disabled={currentPage === 1} 
                direction="left" 
            />
            
            {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .reduce((acc, p, i, arr) => {
                    if (i > 0 && p - arr[i - 1] > 1) acc.push('…');
                    acc.push(p);
                    return acc;
                }, [])
                .map((p, i) => 
                    p === '…' ? (
                        <span key={i} className="w-9 h-9 flex items-center justify-center text-slate-400 text-sm">···</span>
                    ) : (
                        <button 
                            key={p} 
                            onClick={() => onPageChange(p)}
                            className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all 
                                ${currentPage === p ? 'bg-[#0EA5E5] text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                        >
                            {p}
                        </button>
                    )
                )}

            <PaginationBtn 
                onClick={() => onPageChange(p => Math.min(totalPages, p + 1))} 
                disabled={currentPage === totalPages} 
                direction="right" 
            />
        </div>
    );
}

function PaginationBtn({ onClick, disabled, direction }) {
    return (
        <button 
            onClick={onClick} 
            disabled={disabled}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
            {direction === 'left' ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
    );
}