import React, { useState, useMemo } from 'react';
import ManagerCard from '~/components/UI/Card/ManagerCard';
import ManagerToolbar from '~/components/UI/ToolBar/ToolBar';
import LocationModal from './LocationModal';

const LOCATION_DATA = [
  {
    maDiaDiem: 1,
    tenDiaDiem: "Vịnh Hạ Long",
    duongDanAnh: "https://images.unsplash.com/photo-1524230507669-5ff97982bb5e?q=80&w=600",
    loaiDiaDiem: "Vịnh",
    moTa: "Di sản thiên nhiên thế giới nổi tiếng với hàng nghìn đảo đá vôi.",
    tinhThanh: "Quảng Ninh",
    quocGia: "Việt Nam",
    khuVuc: true,
    ngayTao: "2026-01-10",
    ngayCapNhat: "2026-01-15",
    ngayXoa: null,
    trangThai: true
  },
  {
    maDiaDiem: 2,
    tenDiaDiem: "Fansipan",
    duongDanAnh: "https://images.unsplash.com/photo-1504457047772-27faf1c00561?q=80&w=600",
    loaiDiaDiem: "Núi",
    moTa: "Đỉnh núi cao nhất Đông Dương.",
    tinhThanh: "Lào Cai",
    quocGia: "Việt Nam",
    khuVuc: true,
    ngayTao: "2026-01-11",
    ngayCapNhat: "2026-01-16",
    ngayXoa: null,
    trangThai: true
  },
  {
    maDiaDiem: 3,
    tenDiaDiem: "Phố Cổ Hội An",
    duongDanAnh: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=600",
    loaiDiaDiem: "Di tích lịch sử",
    moTa: "Đô thị cổ nổi tiếng của Việt Nam.",
    tinhThanh: "Quảng Nam",
    quocGia: "Việt Nam",
    khuVuc: true,
    ngayTao: "2026-01-12",
    ngayCapNhat: "2026-01-17",
    ngayXoa: null,
    trangThai: true
  },
  {
    maDiaDiem: 4,
    tenDiaDiem: "Đà Lạt",
    duongDanAnh: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600",
    loaiDiaDiem: "Thành phố",
    moTa: "Thành phố ngàn hoa.",
    tinhThanh: "Lâm Đồng",
    quocGia: "Việt Nam",
    khuVuc: true,
    ngayTao: "2026-01-13",
    ngayCapNhat: "2026-01-18",
    ngayXoa: null,
    trangThai: true
  },
  {
    maDiaDiem: 5,
    tenDiaDiem: "Phú Quốc",
    duongDanAnh: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?q=80&w=600",
    loaiDiaDiem: "Đảo",
    moTa: "Hòn đảo du lịch nổi tiếng phía Nam.",
    tinhThanh: "Kiên Giang",
    quocGia: "Việt Nam",
    khuVuc: true,
    ngayTao: "2026-01-14",
    ngayCapNhat: "2026-01-19",
    ngayXoa: null,
    trangThai: true
  },
  {
    maDiaDiem: 6,
    tenDiaDiem: "Bangkok",
    duongDanAnh: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=600",
    loaiDiaDiem: "Thành phố",
    moTa: "Thủ đô của Thái Lan.",
    tinhThanh: "Bangkok",
    quocGia: "Thái Lan",
    khuVuc: false,
    ngayTao: "2026-01-15",
    ngayCapNhat: "2026-01-20",
    ngayXoa: null,
    trangThai: true
  },
  {
    maDiaDiem: 7,
    tenDiaDiem: "Núi Phú Sĩ",
    duongDanAnh: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=600",
    loaiDiaDiem: "Núi",
    moTa: "Biểu tượng nổi tiếng của Nhật Bản.",
    tinhThanh: "Yamanashi",
    quocGia: "Nhật Bản",
    khuVuc: false,
    ngayTao: "2026-01-16",
    ngayCapNhat: "2026-01-21",
    ngayXoa: null,
    trangThai: true
  },
  {
    maDiaDiem: 8,
    tenDiaDiem: "Đảo Jeju",
    duongDanAnh: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=600",
    loaiDiaDiem: "Đảo",
    moTa: "Hòn đảo du lịch nổi tiếng của Hàn Quốc.",
    tinhThanh: "Jeju",
    quocGia: "Hàn Quốc",
    khuVuc: false,
    ngayTao: "2026-01-17",
    ngayCapNhat: "2026-01-22",
    ngayXoa: null,
    trangThai: true
  }
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
            key={item.maDiaDiem}
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
                ? 'bg-[#0EA5E5] text-white shadow'
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