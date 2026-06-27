import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import ManagerCard from "~/components/UI/Card/ManagerCard";
import ManagerToolbar from "~/components/UI/ToolBar/ToolBar";
import ConfirmModal from "~/components/UI/Modal/ConfirmModal";
import { getPagedToursApi, deleteTourApi, changeTourStatusApi } from "~/Services/TourService"
import { toastSuccess, toastWarning } from "~/utils/Toast";

const PAGE_SIZE_OPTIONS = [8, 16, 24, 32];

export default function TourManager() {
  const navigate = useNavigate();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(8);

  const [totalRows, setTotalRows] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedStatusTour, setSelectedStatusTour] = useState(null);
  const fetchTours = async () => {
    try {
      setLoading(true);

      const data = await getPagedToursApi(
        currentPage,
        perPage,
        searchTerm,
        statusFilter === ""
          ? null
          : Number(statusFilter)
      );

      const mappedTours = (data.items || []).map(x => ({
        ...x.tourInfo,
        tenKhachSans: x.tenKhachSans,
        lichTrinh: x.lichTrinh,
        chuyenKhoiHanhs: x.chuyenKhoiHanhs,

        // danh sách ảnh
        images: x.images || [],

        // ảnh đại diện
        hinhAnhTour:
          x.images?.find(img => img.anhChinh)?.duongDanAnh ||
          x.images?.[0]?.duongDanAnh ||
          null
      }));

      setTours(mappedTours);

      setTotalRows(
        data.totalItems ||
        data.totalRecords ||
        0
      );
    }
    catch (error) {
      console.log(error);
    }
    finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTours();
  }, [
    currentPage,
    perPage,
    searchTerm,
    statusFilter
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(keyword);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [keyword]);
  const totalPages = Math.ceil(
    totalRows / perPage
  );

  const handleAddTour = () => {
    // Chuyển sang form ở chế độ Thêm mới (không kèm ID)
    navigate("Them-Tour");
  };

  const handleViewTour = (tour) => {
    // Chuyển sang form ở chế độ Xem chi tiết kèm ID
    navigate(`Xem-chi-tiet/${tour.maTour}`);
  };

  const handleEditTour = (tour) => {
    // Chuyển sang form ở chế độ Cập nhật kèm ID
    navigate(`Cap-nhat/${tour.maTour}`);
  };
  const executeDelete = async () => {
    try {
      await deleteTourApi(selectedTour.maTour);

      toastSuccess(
        "Xóa tour thành công!"
      );

      setConfirmOpen(false);

      await fetchTours();
    }
    catch (error) {
      console.log(error);
    }
  };
  const handleDelete = (tour) => {
    if (tour.trangThai) {
      toastWarning(
        "Không thể xóa tour đang hoạt động."
      );
      return;
    }

    setSelectedTour(tour);
    setConfirmOpen(true);
  };
  const handleChangeStatus = (tour) => {
    setSelectedStatusTour(tour);
    setStatusModalOpen(true);
  };
  const executeChangeStatus = async () => {
    try {
      const newStatus =
        selectedStatusTour.trangThai === 1
          ? 2
          : 1;

      await changeTourStatusApi(
        selectedStatusTour.maTour,
        newStatus
      );

      toastSuccess(
        "Cập nhật trạng thái thành công"
      );

      setStatusModalOpen(false);

      await fetchTours();
    }
    catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="p-4 space-y-6">
      <ManagerToolbar
        searchPlaceholder="Tìm kiếm tour..."
        onSearchChange={(value) => {
          setKeyword(value); // <-- SỬA TỪ setSearchTerm THÀNH setKeyword
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
              { value: "1", label: "Mở bán" },
              { value: "2", label: "Tạm ngưng" },
              { value: "3", label: "Ngừng kinh doanh" }
            ]
          },
        ]}
      />

      {tours.length === 0 ? (
        <div className="text-center py-20 text-slate-500 font-medium bg-white rounded-2xl border border-dashed border-slate-300">
          Không tìm thấy tour nào!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tours.map((tour) => (
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
              onChangeStatus={() => handleChangeStatus(tour)}
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
        isOpen={statusModalOpen}
        title="Xác nhận thay đổi trạng thái"
        message={
          selectedStatusTour?.trangThai === 1
            ? `Bạn có muốn tạm ngưng tour "${selectedStatusTour?.tenTour}" không?`
            : `Bạn có muốn mở bán lại tour "${selectedStatusTour?.tenTour}" không?`
        }
        type="warning"
        confirmText="Xác nhận"
        onCancel={() => setStatusModalOpen(false)}
        onConfirm={executeChangeStatus}
      />
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