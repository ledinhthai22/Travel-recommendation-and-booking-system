import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import ManagerCard from "~/components/UI/Card/ManagerCard";
import ManagerToolbar from "~/components/UI/ToolBar/ToolBar";
import ConfirmModal from "~/components/UI/Modal/ConfirmModal";

import { toastSuccess, toastWarning } from "~/utils/Toast";

const PAGE_SIZE_OPTIONS = [8, 16, 24, 32];

export default function TourManager() {
  const navigate = useNavigate();
  const TOUR_DATA = [
    { maTour: 1, maLoaiTour: 1, tenTour: "Du thuyền Di sản Hạ Long", moTa: "Khám phá Vịnh Hạ Long với hành trình du thuyền cao cấp.", thoiGianTour: "3 Ngày 2 Đêm", soLuongToiDa: 30, luotDat: 18, luotXem: 1250, diemKhoiHanh: "Hà Nội", trangThai: true, ngayTao: "2026-01-10", ngayCapNhat: "2026-05-15", ngayXoa: null, duongDanAnh: "https://images.unsplash.com/photo-1524230507669-5ff97982bb5e?q=80&w=600" },
    { maTour: 2, maLoaiTour: 2, tenTour: "Chinh phục đỉnh Fansipan", moTa: "Trải nghiệm trekking và cáp treo lên nóc nhà Đông Dương.", thoiGianTour: "2 Ngày 1 Đêm", soLuongToiDa: 25, luotDat: 20, luotXem: 980, diemKhoiHanh: "Lào Cai", trangThai: true, ngayTao: "2026-01-15", ngayCapNhat: "2026-05-10", ngayXoa: null, duongDanAnh: "https://images.unsplash.com/photo-1504457047772-27faf1c00561?q=80&w=600" },
    { maTour: 3, maLoaiTour: 3, tenTour: "Vẻ đẹp Phố Cổ Hội An", moTa: "Khám phá phố cổ về đêm và văn hóa miền Trung.", thoiGianTour: "4 Ngày 3 Đêm", soLuongToiDa: 35, luotDat: 12, luotXem: 870, diemKhoiHanh: "Đà Nẵng", trangThai: false, ngayTao: "2026-02-01", ngayCapNhat: "2026-04-20", ngayXoa: null, duongDanAnh: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=600" },
    { maTour: 4, maLoaiTour: 4, tenTour: "Khám phá Đà Lạt Mộng Mơ", moTa: "Tour tham quan Đà Lạt với các địa điểm nổi tiếng.", thoiGianTour: "3 Ngày 2 Đêm", soLuongToiDa: 40, luotDat: 28, luotXem: 1600, diemKhoiHanh: "TP.HCM", trangThai: true, ngayTao: "2026-01-20", ngayCapNhat: "2026-05-18", ngayXoa: null, duongDanAnh: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600" },
    { maTour: 5, maLoaiTour: 1, tenTour: "Thiên đường biển Phú Quốc", moTa: "Trải nghiệm nghỉ dưỡng tại đảo ngọc Phú Quốc.", thoiGianTour: "4 Ngày 3 Đêm", soLuongToiDa: 50, luotDat: 42, luotXem: 2450, diemKhoiHanh: "TP.HCM", trangThai: true, ngayTao: "2026-01-05", ngayCapNhat: "2026-05-25", ngayXoa: null, duongDanAnh: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?q=80&w=600" },
    { maTour: 6, maLoaiTour: 5, tenTour: "Khám phá Hang Sơn Đoòng", moTa: "Hành trình mạo hiểm khám phá hang động lớn nhất thế giới.", thoiGianTour: "5 Ngày 4 Đêm", soLuongToiDa: 10, luotDat: 8, luotXem: 3200, diemKhoiHanh: "Quảng Bình", trangThai: false, ngayTao: "2026-02-15", ngayCapNhat: "2026-05-05", ngayXoa: null, duongDanAnh: "https://images.unsplash.com/photo-1516790236240-72d3936cc631?q=80&w=600" },
    { maTour: 7, maLoaiTour: 6, tenTour: "Tràng An - Ninh Bình", moTa: "Du ngoạn danh thắng Tràng An bằng thuyền.", thoiGianTour: "2 Ngày 1 Đêm", soLuongToiDa: 30, luotDat: 15, luotXem: 750, diemKhoiHanh: "Hà Nội", trangThai: true, ngayTao: "2026-03-01", ngayCapNhat: "2026-05-12", ngayXoa: null, duongDanAnh: "https://images.unsplash.com/photo-1599576315975-de2c8a4abbc3?q=80&w=600" },
    { maTour: 8, maLoaiTour: 1, tenTour: "Biển xanh Côn Đảo", moTa: "Khám phá thiên nhiên hoang sơ và lịch sử Côn Đảo.", thoiGianTour: "3 Ngày 2 Đêm", soLuongToiDa: 25, luotDat: 14, luotXem: 1100, diemKhoiHanh: "Vũng Tàu", trangThai: true, ngayTao: "2026-02-20", ngayCapNhat: "2026-05-22", ngayXoa: null, duongDanAnh: "https://images.unsplash.com/photo-1573160813959-929af7b9d51e?q=80&w=600" }
  ];
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(8);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);

  const filteredTours = useMemo(() => {
    return TOUR_DATA.filter((tour) => {
      const matchSearch =
        !searchTerm ||
        tour.tenTour.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.diemKhoiHanh.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus =
        statusFilter === ""
          ? true
          : String(tour.trangThai) === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [searchTerm, statusFilter]);

  const totalRows = filteredTours.length;

  const pagedTours = filteredTours.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const totalPages = Math.ceil(totalRows / perPage);

  const handleAddTour = () => {
    navigate("/Quan-ly/Cac-chuyen-di/Them-Tour");
  };

  const handleViewTour = (tour) => {
    navigate(`/Quan-ly/Cac-chuyen-di/Xem-chi-tiet/${tour.maTour}`);
  };

  const handleEditTour = (tour) => {
    navigate(`/Quan-ly/Cac-chuyen-di/Cap-nhat/${tour.maTour}`);
  };

  const executeDelete = () => {
    toastSuccess(
      `Đã xóa tour "${selectedTour.tenTour}" thành công!`
    );

    setConfirmOpen(false);
  };

  const handleDelete = (tour) => {
    if (tour.trangThai) {
      toastWarning(
        "Không thể xóa tour đang hoạt động. Vui lòng ngưng hoạt động trước!"
      );
      return;
    }

    setSelectedTour(tour);
    setConfirmOpen(true);
  };

  return (
    <div className="p-4 space-y-6">
      <ManagerToolbar
        searchPlaceholder="Tìm kiếm tour..."
        onSearchChange={(value) => {
          setSearchTerm(value);
          setCurrentPage(1);
        }}
        addButtonText="Thêm tour"
        onAddClick={handleAddTour}
        showExcel={false}
        filters={[
          {
            placeholder: "Trạng thái",
            value: statusFilter,
            onChange: (value) => {
              setStatusFilter(value);
              setCurrentPage(1);
            },
            options: [
              { value: "", label: "Tất cả" },
              { value: "true", label: "Đang hoạt động" },
              { value: "false", label: "Ngưng hoạt động" },
            ],
          },
        ]}
      />

      {pagedTours.length === 0 ? (
        <div className="text-center py-20 text-slate-500 font-medium bg-white rounded-2xl border border-dashed border-slate-300">
          Không tìm thấy tour nào!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {pagedTours.map((tour) => (
            <ManagerCard
              key={tour.maTour}
              item={tour}
              type="tour"
              onView={() => handleViewTour(tour)}
              onEdit={() => handleEditTour(tour)}
              onDelete={
                !tour.trangThai
                  ? () => handleDelete(tour)
                  : null
              }
            />
          ))}
        </div>
      )}

      {totalRows > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-2 pt-6 border-t border-slate-100 gap-4 mt-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">Số lượng:</span>
              <select
                value={perPage}
                onChange={(e) => {
                  setPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg p-1.5 outline-none cursor-pointer"
              >
                {[8, 16, 24, 32].map((num) => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>

            <span className="text-sm text-slate-400 font-medium">
              Hiển thị {(currentPage - 1) * perPage + 1} –{" "}
              {Math.min(currentPage * perPage, totalRows)} / {totalRows}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-sky-600 disabled:opacity-40 transition-all"
            >
              <span className="material-symbols-outlined text-xl">chevron_left</span>
            </button>

            {Array.from({ length: Math.ceil(totalRows / perPage) }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${currentPage === page
                  ? "bg-sky-500 text-white"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(p => Math.min(Math.ceil(totalRows / perPage), p + 1))}
              disabled={currentPage === Math.ceil(totalRows / perPage)}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-sky-600 disabled:opacity-40 transition-all"
            >
              <span className="material-symbols-outlined text-xl">chevron_right</span>
            </button>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmOpen}
        title="Xác nhận xóa tour"
        message={`Bạn có chắc chắn muốn xóa tour "${selectedTour?.tenTour}" không?`}
        type="danger"
        confirmText="Xóa"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={executeDelete}
      />
    </div>
  );
}