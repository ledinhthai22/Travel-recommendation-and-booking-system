import React, { useState, useMemo } from 'react';
import ManagerCard from '~/components/UI/Card/ManagerCard';
import ManagerToolbar from '~/components/UI/ToolBar/ToolBar';

const TOUR_DATA = [
  {
    id: 1,
    title: "Du thuyền Di sản Hạ Long",
    location: "Hạ Long",
    price: "3,500,000đ",
    duration: "3 Ngày 2 Đêm",
    status: "open",
    image: "https://images.unsplash.com/photo-1524230507669-5ff97982bb5e?q=80&w=600",
    avatars: ["https://i.pravatar.cc/150?u=1", "https://i.pravatar.cc/150?u=2"],
    rating: 4.5
  },
  {
    id: 2,
    title: "Chinh phục đỉnh Fansipan",
    location: "Sapa",
    price: "2,100,000đ",
    duration: "2 Ngày 1 Đêm",
    status: "open",
    image: "https://images.unsplash.com/photo-1504457047772-27faf1c00561?q=80&w=600",
    avatars: ["https://i.pravatar.cc/150?u=3"],
    rating: 4.5
  },
  {
    id: 3,
    title: "Vẻ đẹp Phố Cổ Hội An",
    location: "Hội An",
    price: "4,200,000đ",
    duration: "4 Ngày 3 Đêm",
    status: "paused",
    image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=600",
    avatars: ["https://i.pravatar.cc/150?u=5"],
    rating: 4.5
  },
  {
    id: 4,
    title: "Vẻ đẹp Phố Cổ Hội An",
    location: "Hội An",
    price: "4,200,000đ",
    duration: "4 Ngày 3 Đêm",
    status: "paused",
    image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=600",
    avatars: ["https://i.pravatar.cc/150?u=5"],
    rating: 4.5
  },
  {
    id: 5,
    title: "Vẻ đẹp Phố Cổ Hội An",
    location: "Hội An",
    price: "4,200,000đ",
    duration: "4 Ngày 3 Đêm",
    status: "paused",
    image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=600",
    avatars: ["https://i.pravatar.cc/150?u=5"],
    rating: 4.5
  },
  {
    id: 6,
    title: "Vẻ đẹp Phố Cổ Hội An",
    location: "Hội An",
    price: "4,200,000đ",
    duration: "4 Ngày 3 Đêm",
    status: "paused",
    image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=600",
    avatars: ["https://i.pravatar.cc/150?u=5"],
    rating: 4.5
  },
  {
    id: 7,
    title: "Vẻ đẹp Phố Cổ Hội An",
    location: "Hội An",
    price: "4,200,000đ",
    duration: "4 Ngày 3 Đêm",
    status: "paused",
    image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=600",
    avatars: ["https://i.pravatar.cc/150?u=5"],
    rating: 4.5
  },
  {
    id: 8,
    title: "Vẻ đẹp Phố Cổ Hội An",
    location: "Hội An",
    price: "4,200,000đ",
    duration: "4 Ngày 3 Đêm",
    status: "paused",
    image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=600",
    avatars: ["https://i.pravatar.cc/150?u=5"],
    rating: 4.5
  },
  {
    id: 9,
    title: "Vẻ đẹp Phố Cổ Hội An",
    location: "Hội An",
    price: "4,200,000đ",
    duration: "4 Ngày 3 Đêm",
    status: "paused",
    image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=600",
    avatars: ["https://i.pravatar.cc/150?u=5"],
    rating: 4.5
  },
];

const PAGE_SIZE = 8;

export default function TourManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return TOUR_DATA;
    const term = searchTerm.toLowerCase();
    return TOUR_DATA.filter(tour =>
      tour.title.toLowerCase().includes(term) ||
      tour.location.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const pageData = filteredData.slice(startIdx, startIdx + PAGE_SIZE);

  return (
    <div className="p-4 space-y-6">
      <ManagerToolbar
        searchPlaceholder="Tìm kiếm tour..."
        onSearchChange={(value) => {
          setSearchTerm(value);
          setCurrentPage(1);
        }}
        addButtonText="Thêm tour"
        showCategoryFilter={true} 
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {pageData.map(tour => (
          <ManagerCard 
            key={tour.id} 
            item={tour} 
            type="tour" 
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2 pt-4">
        <span className="text-xs text-slate-400 font-medium">
          Hiển thị {startIdx + 1}–{Math.min(startIdx + PAGE_SIZE, totalItems)} / {totalItems} tour
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:bg-white hover:shadow-sm disabled:opacity-40 transition-all"
          >
            <span className="material-symbols-outlined text-xl">chevron_left</span>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${
                currentPage === page
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:bg-white hover:shadow-sm disabled:opacity-40 transition-all"
          >
            <span className="material-symbols-outlined text-xl">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
}