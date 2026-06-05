import React, { useState, useMemo } from 'react';
import ManagerCard from '~/components/UI/Card/ManagerCard';
import ManagerToolbar from '~/components/UI/ToolBar/ToolBar';

const TOUR_DATA = [
  {
    maTour: 1,
    maLoaiTour: 1,
    tenTour: "Du thuyền Di sản Hạ Long",
    moTa: "Khám phá Vịnh Hạ Long với hành trình du thuyền cao cấp.",
    thoiGianTour: "3 Ngày 2 Đêm",
    soLuongToiDa: 30,
    luotDat: 18,
    luotXem: 1250,
    diemKhoiHanh: "Hà Nội",
    trangThai: true,
    ngayTao: "2026-01-10",
    ngayCapNhat: "2026-05-15",
    ngayXoa: null,

    // UI
    duongDanAnh: "https://images.unsplash.com/photo-1524230507669-5ff97982bb5e?q=80&w=600"
  },
  {
    maTour: 2,
    maLoaiTour: 2,
    tenTour: "Chinh phục đỉnh Fansipan",
    moTa: "Trải nghiệm trekking và cáp treo lên nóc nhà Đông Dương.",
    thoiGianTour: "2 Ngày 1 Đêm",
    soLuongToiDa: 25,
    luotDat: 20,
    luotXem: 980,
    diemKhoiHanh: "Lào Cai",
    trangThai: true,
    ngayTao: "2026-01-15",
    ngayCapNhat: "2026-05-10",
    ngayXoa: null,

    duongDanAnh: "https://images.unsplash.com/photo-1504457047772-27faf1c00561?q=80&w=600"
  },
  {
    maTour: 3,
    maLoaiTour: 3,
    tenTour: "Vẻ đẹp Phố Cổ Hội An",
    moTa: "Khám phá phố cổ về đêm và văn hóa miền Trung.",
    thoiGianTour: "4 Ngày 3 Đêm",
    soLuongToiDa: 35,
    luotDat: 12,
    luotXem: 870,
    diemKhoiHanh: "Đà Nẵng",
    trangThai: false,
    ngayTao: "2026-02-01",
    ngayCapNhat: "2026-04-20",
    ngayXoa: null,

    duongDanAnh: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=600"
  },
  {
    maTour: 4,
    maLoaiTour: 4,
    tenTour: "Khám phá Đà Lạt Mộng Mơ",
    moTa: "Tour tham quan Đà Lạt với các địa điểm nổi tiếng.",
    thoiGianTour: "3 Ngày 2 Đêm",
    soLuongToiDa: 40,
    luotDat: 28,
    luotXem: 1600,
    diemKhoiHanh: "TP.HCM",
    trangThai: true,
    ngayTao: "2026-01-20",
    ngayCapNhat: "2026-05-18",
    ngayXoa: null,

    duongDanAnh: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600"
  },
  {
    maTour: 5,
    maLoaiTour: 1,
    tenTour: "Thiên đường biển Phú Quốc",
    moTa: "Trải nghiệm nghỉ dưỡng tại đảo ngọc Phú Quốc.",
    thoiGianTour: "4 Ngày 3 Đêm",
    soLuongToiDa: 50,
    luotDat: 42,
    luotXem: 2450,
    diemKhoiHanh: "TP.HCM",
    trangThai: true,
    ngayTao: "2026-01-05",
    ngayCapNhat: "2026-05-25",
    ngayXoa: null,

    duongDanAnh: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?q=80&w=600"
  },
  {
    maTour: 6,
    maLoaiTour: 5,
    tenTour: "Khám phá Hang Sơn Đoòng",
    moTa: "Hành trình mạo hiểm khám phá hang động lớn nhất thế giới.",
    thoiGianTour: "5 Ngày 4 Đêm",
    soLuongToiDa: 10,
    luotDat: 8,
    luotXem: 3200,
    diemKhoiHanh: "Quảng Bình",
    trangThai: false,
    ngayTao: "2026-02-15",
    ngayCapNhat: "2026-05-05",
    ngayXoa: null,

    duongDanAnh: "https://images.unsplash.com/photo-1516790236240-72d3936cc631?q=80&w=600"
  },
  {
    maTour: 7,
    maLoaiTour: 6,
    tenTour: "Tràng An - Ninh Bình",
    moTa: "Du ngoạn danh thắng Tràng An bằng thuyền.",
    thoiGianTour: "2 Ngày 1 Đêm",
    soLuongToiDa: 30,
    luotDat: 15,
    luotXem: 750,
    diemKhoiHanh: "Hà Nội",
    trangThai: true,
    ngayTao: "2026-03-01",
    ngayCapNhat: "2026-05-12",
    ngayXoa: null,

    duongDanAnh: "https://images.unsplash.com/photo-1599576315975-de2c8a4abbc3?q=80&w=600"
  },
  {
    maTour: 8,
    maLoaiTour: 1,
    tenTour: "Biển xanh Côn Đảo",
    moTa: "Khám phá thiên nhiên hoang sơ và lịch sử Côn Đảo.",
    thoiGianTour: "3 Ngày 2 Đêm",
    soLuongToiDa: 25,
    luotDat: 14,
    luotXem: 1100,
    diemKhoiHanh: "Vũng Tàu",
    trangThai: true,
    ngayTao: "2026-02-20",
    ngayCapNhat: "2026-05-22",
    ngayXoa: null,

    duongDanAnh: "https://images.unsplash.com/photo-1573160813959-929af7b9d51e?q=80&w=600"
  }
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
    </div>
  );
}