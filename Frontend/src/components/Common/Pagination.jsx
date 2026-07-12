import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    // 1. Tạo danh sách các số trang một cách rõ ràng, không dùng bộ lọc phức tạp
    const getPageNumbers = () => {
        const pages = [];
        
        for (let i = 1; i <= totalPages; i++) {
            // Điều kiện: Luôn hiện trang đầu, trang cuối, và các trang xung quanh currentPage trong khoảng 1 đơn vị
            if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
                // Nếu khoảng cách giữa trang hiện tại và trang trước đó > 1, chèn dấu ba chấm
                if (pages.length > 0 && i - pages[pages.length - 1] > 1) {
                    pages.push('…');
                }
                pages.push(i);
            }
        }
        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="flex items-center justify-center gap-1.5 mt-12 select-none">
            {/* Nút sang trái - Truyền số trực tiếp thay vì callback function */}
            <PaginationBtn 
                onClick={() => onPageChange(Math.max(1, currentPage - 1))} 
                disabled={currentPage === 1} 
                direction="left" 
            />
            
            {/* Render danh sách trang */}
            {pageNumbers.map((p, i) => 
                p === '…' ? (
                    <span key={`dots-${i}`} className="w-9 h-9 flex items-center justify-center text-slate-400 text-sm">···</span>
                ) : (
                    <button 
                        key={`page-${p}`} // Đảm bảo key là duy nhất theo số trang
                        onClick={() => onPageChange(p)}
                        className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all 
                            ${currentPage === p ? 'bg-[#0EA5E5] text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                    >
                        {p}
                    </button>
                )
            )}

            {/* Nút sang phải - Truyền số trực tiếp */}
            <PaginationBtn 
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} 
                disabled={currentPage === totalPages} 
                direction="right" 
            />
        </div>
    );
}

// Gom sạch text thừa, đảm bảo component nút bấm chỉ chứa đúng Icon ẩn bên trong
function PaginationBtn({ onClick, disabled, direction }) {
    return (
        <button 
            type="button"
            onClick={onClick} 
            disabled={disabled}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
            {direction === 'left' ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
    );
}