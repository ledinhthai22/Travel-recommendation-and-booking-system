import React, { useState, useMemo } from 'react';
import ManagerCard from '~/components/UI/Card/ManagerCard';
import ManagerToolbar from '~/components/UI/ToolBar/ToolBar';
import LocationModal from './LocationModal';

const LOCATION_DATA = [
  { id: 1, name: "Vịnh Hạ Long", province: "Quảng Ninh", status: "open", rating: 4.9, image: "https://images.unsplash.com/photo-1524230507669-5ff97982bb5e?q=80&w=600", category: "Du lịch Biển", activeTours: 12, revenue: "420M" },
  { id: 2, name: "Fansipan Sapa", province: "Lào Cai", status: "maintenance", rating: 4.7, image: "https://images.unsplash.com/photo-1504457047772-27faf1c00561?q=80&w=600", category: "Vùng Núi", activeTours: 8, revenue: "120M" },
  { id: 3, name: "Phố Cổ Hội An", province: "Quảng Nam", status: "open", rating: 4.8, image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=600", category: "Phố Cổ", activeTours: 10, revenue: "280M" },
  { id: 4, name: "Đà Lạt", province: "Lâm Đồng", status: "open", rating: 4.6, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600", category: "Cao Nguyên", activeTours: 15, revenue: "310M"},
  { id: 5, name: "Phú Quốc", province: "Kiên Giang", status: "open", rating: 4.8, image: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?q=80&w=600", category: "Du lịch Biển", activeTours: 18, revenue: "520M" },
  { id: 6, name: "Mũi Né", province: "Bình Thuận", status: "maintenance", rating: 4.5, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=600", category: "Du lịch Biển", activeTours: 6, revenue: "95M" },
  { id: 7, name: "Tràng An", province: "Ninh Bình", status: "open", rating: 4.7, image: "https://images.unsplash.com/photo-1599576315975-de2c8a4abbc3?q=80&w=600", category: "Di sản", activeTours: 9, revenue: "175M" },
  { id: 8, name: "Côn Đảo", province: "Bà Rịa – VT", status: "open", rating: 4.9, image: "https://images.unsplash.com/photo-1573160813959-929af7b9d51e?q=80&w=600", category: "Du lịch Biển", activeTours: 7, revenue: "210M"},
  { id: 9, name: "Bà Nà Hills", province: "Đà Nẵng", status: "open", rating: 4.6, image: "https://images.unsplash.com/photo-1570366583862-f91883984fde?q=80&w=600", category: "Vui chơi", activeTours: 11, revenue: "390M"},
  { id: 10, name: "Mù Cang Chải", province: "Yên Bái", status: "maintenance", rating: 4.8, image: "https://images.unsplash.com/photo-1598514983318-2f64f8f4796c?q=80&w=600", category: "Vùng Núi", activeTours: 5, revenue: "88M"},
  { id: 11, name: "Hang Sơn Đoòng", province: "Quảng Bình", status: "open", rating: 5.0, image: "https://images.unsplash.com/photo-1516790236240-72d3936cc631?q=80&w=600", category: "Khám phá", activeTours: 3, revenue: "650M"},
  { id: 12, name: "Cần Thơ", province: "Cần Thơ", status: "open", rating: 4.5, image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=600", category: "Sông nước", activeTours: 14, revenue: "195M" },
];

const PAGE_SIZE = 8;

export default function LocationManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [locations, setLocations] = useState(LOCATION_DATA);

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    mode: 'add',
    data: null
  });

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return locations;
    const term = searchTerm.toLowerCase();
    return locations.filter(item =>
      (item.name || '').toLowerCase().includes(term) ||
      (item.province || '').toLowerCase().includes(term) ||
      (item.category || '').toLowerCase().includes(term)
    );
  }, [searchTerm, locations]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const pageData = filteredData.slice(startIdx, startIdx + PAGE_SIZE);

  const openModal = (mode, data = null) => {
    setModalConfig({ isOpen: true, mode, data });
  };

  const handleSave = (newLocation, mode) => {
    if (mode === 'add') {
      setLocations(prev => [newLocation, ...prev]);
    } else if (mode === 'edit') {
      setLocations(prev => prev.map(item =>
        item.id === newLocation.id ? newLocation : item
      ));
    }
    setCurrentPage(1);
  };

  // FIX: nhận item từ argument của callback (truyền từ ManagerCard)
  const handleView = (item) => openModal('view', item);
  const handleEdit = (item) => openModal('edit', item);
  const handleDelete = (item) => setLocations(prev => prev.filter(l => l.id !== item.id));

  return (
    <div className="p-4 space-y-6">
      <ManagerToolbar
        searchPlaceholder="Tìm kiếm địa điểm..."
        onSearchChange={(value) => {
          setSearchTerm(value);
          setCurrentPage(1);
        }}
        addButtonText="Thêm địa điểm"
        onAddClick={() => openModal('add')}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {pageData.map(item => (
          <ManagerCard
            key={item.id}
            item={item} 
            type="location"
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2 pt-4">
        <span className="text-xs text-slate-400 font-medium">
          Hiển thị {startIdx + 1}–{Math.min(startIdx + PAGE_SIZE, totalItems)} / {totalItems} địa điểm
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
              className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${currentPage === page
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

      <LocationModal
        isOpen={modalConfig.isOpen}
        mode={modalConfig.mode}
        initialData={modalConfig.data}
        onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
        onSave={handleSave}
      />
    </div>
  );
}