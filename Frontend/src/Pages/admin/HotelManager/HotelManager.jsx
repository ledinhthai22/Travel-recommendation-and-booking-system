import React, { useState, useMemo } from 'react';
import ManagerCard from '~/components/UI/Card/ManagerCard';
import ManagerToolbar from '~/components/UI/ToolBar/ToolBar';

const HOTEL_DATA = [
  {
    maKhachSan: 1,
    tenKhachSan: "Vinpearl Resort & Spa Hạ Long",
    soSao: 5,
    diaChi: "Đảo Rều, Hạ Long, Quảng Ninh",
    soDienThoai: "02033858888",
    moTa: "Khu nghỉ dưỡng cao cấp nằm trên đảo riêng tại Vịnh Hạ Long.",
    trangThai: true,

    hinhAnh: [
      {
        maAnhKS: 1,
        duongDanAnh: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=600",
        anhChinh: true,
        soThuTu: 1
      },
      {
        maAnhKS: 2,
        duongDanAnh: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600",
        anhChinh: false,
        soThuTu: 2
      }
    ],

    tienNghi: [
      "WiFi miễn phí",
      "Hồ bơi",
      "Spa",
      "Phòng Gym",
      "Nhà hàng"
    ],

    ngayTao: "2026-01-01",
    ngayCapNhat: "2026-01-05",
    ngayXoa: null
  },

  {
    maKhachSan: 2,
    tenKhachSan: "InterContinental Danang",
    soSao: 5,
    diaChi: "Bán đảo Sơn Trà, Đà Nẵng",
    soDienThoai: "02363938888",
    moTa: "Resort nghỉ dưỡng sang trọng bên bờ biển.",
    trangThai: true,

    hinhAnh: [
      {
        maAnhKS: 3,
        duongDanAnh: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=600",
        anhChinh: true,
        soThuTu: 1
      }
    ],

    tienNghi: [
      "WiFi miễn phí",
      "Hồ bơi",
      "Bãi biển riêng",
      "Nhà hàng"
    ],

    ngayTao: "2026-01-02",
    ngayCapNhat: "2026-01-06",
    ngayXoa: null
  },

  {
    maKhachSan: 3,
    tenKhachSan: "Amanoi Resort",
    soSao: 5,
    diaChi: "Vĩnh Hy, Ninh Thuận",
    soDienThoai: "02593777777",
    moTa: "Khu nghỉ dưỡng biệt lập hướng biển.",
    trangThai: false,

    hinhAnh: [
      {
        maAnhKS: 4,
        duongDanAnh: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=600",
        anhChinh: true,
        soThuTu: 1
      }
    ],

    tienNghi: [
      "WiFi miễn phí",
      "Spa",
      "Yoga",
      "Nhà hàng"
    ],

    ngayTao: "2026-01-03",
    ngayCapNhat: "2026-01-07",
    ngayXoa: null
  }
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
            key={hotel.maKhachSan} 
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
    </div>
  );
}