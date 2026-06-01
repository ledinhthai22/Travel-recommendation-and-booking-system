import React, { useState, useMemo } from 'react';
import ManagerCard from '~/components/UI/Card/ManagerCard';
import ManagerToolbar from '~/components/UI/ToolBar/ToolBar';

const HOTEL_DATA = [
  {
    id: 1,
    name: "Vinpearl Resort & Spa Hạ Long",
    province: "Quảng Ninh",
    status: "open",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=600",
    category: "Resort 5 sao",
    avatars: ["https://i.pravatar.cc/150?u=1", "https://i.pravatar.cc/150?u=2"]
  },
  {
    id: 2,
    name: "InterContinental Danang",
    province: "Đà Nẵng",
    status: "open",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=600",
    category: "Resort 5 sao",
    avatars: ["https://i.pravatar.cc/150?u=3", "https://i.pravatar.cc/150?u=4"]
  },
  {
    id: 3,
    name: "Amanoi Resort",
    province: "Ninh Thuận",
    status: "open",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=600",
    category: "Luxury Villa",
    avatars: ["https://i.pravatar.cc/150?u=5"]
  },
  {
    id: 4,
    name: "Six Senses Côn Đảo",
    province: "Bà Rịa – VT",
    status: "open",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600",
    category: "Luxury Villa",
    avatars: ["https://i.pravatar.cc/150?u=6", "https://i.pravatar.cc/150?u=7"]
  },
  {
    id: 5,
    name: "JW Marriott Phú Quốc",
    province: "Kiên Giang",
    status: "open",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1615880484746-a134be9a6ecf?q=80&w=600",
    category: "Resort 5 sao",
    avatars: ["https://i.pravatar.cc/150?u=8", "https://i.pravatar.cc/150?u=9"]
  },
  {
    id: 6,
    name: "Anantara Hội An",
    province: "Quảng Nam",
    status: "maintenance",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=600",
    category: "Boutique Hotel",
    avatars: ["https://i.pravatar.cc/150?u=10"]
  },
  {
    id: 7,
    name: "Sofitel Legend Metropole",
    province: "Hà Nội",
    status: "open",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=600",
    category: "Heritage Hotel",
    avatars: ["https://i.pravatar.cc/150?u=11", "https://i.pravatar.cc/150?u=12"]
  },
  {
    id: 8,
    name: "Park Hyatt Sài Gòn",
    province: "TP. Hồ Chí Minh",
    status: "open",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?q=80&w=600",
    category: "City Hotel",
    avatars: ["https://i.pravatar.cc/150?u=13"]
  },
  {
    id: 9,
    name: "Ana Mandara Đà Lạt",
    province: "Lâm Đồng",
    status: "open",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1587213811864-c3a8a886ed1d?q=80&w=600",
    category: "Mountain Resort",
    avatars: ["https://i.pravatar.cc/150?u=14", "https://i.pravatar.cc/150?u=15"]
  },
  {
    id: 10,
    name: "Silk Sense Hội An",
    province: "Quảng Nam",
    status: "maintenance",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=600",
    category: "Boutique Hotel",
    avatars: ["https://i.pravatar.cc/150?u=16"]
  },
  {
    id: 11,
    name: "Mia Resort Nha Trang",
    province: "Khánh Hòa",
    status: "open",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=600",
    category: "Beachfront Resort",
    avatars: ["https://i.pravatar.cc/150?u=17", "https://i.pravatar.cc/150?u=18"]
  },
  {
    id: 12,
    name: "Topas Ecolodge Sapa",
    province: "Lào Cai",
    status: "open",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1595877244574-e90ce41ce089?q=80&w=600",
    category: "Eco Lodge",
    avatars: ["https://i.pravatar.cc/150?u=19"]
  },
];

const PAGE_SIZE = 8;

export default function HotelManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return HOTEL_DATA;
    const term = searchTerm.toLowerCase();
    return HOTEL_DATA.filter(item =>
      item.name.toLowerCase().includes(term) ||
      item.province.toLowerCase().includes(term) ||
      item.category.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const pageData = filteredData.slice(startIdx, startIdx + PAGE_SIZE);

  return (
    <div className="p-4 space-y-6">
      <ManagerToolbar
        searchPlaceholder="Tìm kiếm khách sạn..."
        onSearchChange={(value) => {
          setSearchTerm(value);
          setCurrentPage(1);
        }}
        addButtonText="Thêm khách sạn"
      />

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {pageData.map(hotel => (
          <ManagerCard 
            key={hotel.id} 
            item={hotel} 
            type="hotel" 
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2 pt-4">
        <span className="text-xs text-slate-400 font-medium">
          Hiển thị {startIdx + 1}–{Math.min(startIdx + PAGE_SIZE, totalItems)} / {totalItems} khách sạn
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