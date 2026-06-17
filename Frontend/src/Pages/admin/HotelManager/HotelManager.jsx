import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ManagerCard from "~/components/UI/Card/ManagerCard";
import ManagerToolbar from "~/components/UI/ToolBar/ToolBar";
import ConfirmModal from "~/components/UI/Modal/ConfirmModal";
import { getHotelApi, deleteHotelApi } from "~/Services/HotelService";
import { toastSuccess, toastError } from "~/utils/Toast";

export default function HotelManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [starFilter, setStarFilter] = useState("");
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const navigate = useNavigate();

  const [confirmConfig, setConfirmConfig] = useState({
    title: "",
    message: "",
    type: "danger",
    confirmText: "Xác nhận",
    action: null,
  });
  const fetchHotels = async () => {
    try {
      setLoading(true);

      const response = await getHotelApi(
        currentPage,
        pageSize,
        searchTerm,
        "",
        "",
        starFilter === "" ? null : Number(starFilter),
        statusFilter === "" ? null : statusFilter
      );

      setHotels(response.items || []);
      setTotalItems(response.totalItems || 0);
    } catch (error) {
      console.error("Lỗi lấy danh sách khách sạn:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, [
    currentPage,
    pageSize,
    searchTerm,
    statusFilter,
    starFilter,
  ]);

  const totalPages = Math.ceil(totalItems / pageSize);
  const startIdx = (currentPage - 1) * pageSize;

  const handleConfirm = async () => {
    try {
      if (confirmConfig.action) {
        await confirmConfig.action();
      }
    } catch (error) {
      console.error(error);

      const msg =
        error?.response?.data?.message ||
        "Có lỗi xảy ra khi thực hiện tác vụ";

      toastError(msg);
    } finally {
      setConfirmOpen(false);
    }
  };

  const handleAddHotel = () => {
    navigate("/Quan-ly/Khach-san/Them-Khach-San");
  };

  const handleViewHotel = (hotel) => {
    navigate(
      `/Quan-ly/Khach-san/Xem-chi-tiet/${hotel.maKhachSan}`
    );
  };

  const handleEditHotel = (hotel) => {
    navigate(
      `/Quan-ly/Khach-san/Cap-nhat/${hotel.maKhachSan}`
    );
  };

  const handleDelete = useCallback(
    (hotel) => {
      setConfirmConfig({
        title: "Xóa khách sạn",
        message: `Bạn có chắc muốn xóa "${hotel.tenKhachSan}" ?`,
        type: "danger",
        confirmText: "Xóa",
        action: async () => {
          await deleteHotelApi(hotel.maKhachSan);

          toastSuccess(
            "Xóa thành công khách sạn " +
            hotel.tenKhachSan
          );

          fetchHotels();
        },
      });

      setConfirmOpen(true);
    },
    [fetchHotels]
  );

  return (
    <div className="p-4 space-y-6">
      <ManagerToolbar
        searchPlaceholder="Tìm kiếm khách sạn..."
        onSearchChange={(value) => {
          setSearchTerm(value);
          setCurrentPage(1);
        }}
        addButtonText="Thêm khách sạn"
        onAddClick={handleAddHotel}
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
              { label: "Tất cả", value: "" },
              { label: "Hoạt động", value: "true" },
              { label: "Ngưng hoạt động", value: "false" },
            ],
          },
          {
            placeholder: "Số sao",
            value: starFilter,
            onChange: (value) => {
              setStarFilter(value);
              setCurrentPage(1);
            },
            options: [
              {
                label: "Xếp loại số sao",
                value: "",
              },
              {
                label: "5 sao",
                value: 5,
              },
              {
                label: "4 sao",
                value: 4,
              },
              {
                label: "3 sao",
                value: 3,
              },
              {
                label: "2 sao",
                value: 2,
              },
              {
                label: "1 sao",
                value: 1,
              },
            ],
          },
        ]}
      />

      {loading ? (
        <div className="text-center py-10">
          Đang tải dữ liệu...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-6">
          {hotels.map((hotel) => (
            <ManagerCard
              key={hotel.maKhachSan}
              item={hotel}
              type="hotel"
              onView={handleViewHotel}
              onEdit={handleEditHotel}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between px-2">
        <span className="text-xs text-slate-400 font-medium">
          Hiển thị{" "}
          {totalItems === 0 ? 0 : startIdx + 1} –{" "}
          {Math.min(
            startIdx + pageSize,
            totalItems
          )}{" "}
          / {totalItems} khách sạn
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() =>
              setCurrentPage((p) =>
                Math.max(1, p - 1)
              )
            }
            disabled={currentPage === 1}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:bg-white hover:shadow-sm disabled:opacity-40 transition-all"
          >
            <span className="material-symbols-outlined text-xl">
              chevron_left
            </span>
          </button>

          {Array.from(
            { length: totalPages },
            (_, i) => i + 1
          ).map((page) => (
            <button
              key={page}
              onClick={() =>
                setCurrentPage(page)
              }
              className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${currentPage === page
                ? "bg-[#0EA5E5] text-white shadow"
                : "text-slate-500 hover:bg-slate-100"
                }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((p) =>
                Math.min(
                  totalPages,
                  p + 1
                )
              )
            }
            disabled={
              currentPage === totalPages ||
              totalPages === 0
            }
            className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:bg-white hover:shadow-sm disabled:opacity-40 transition-all"
          >
            <span className="material-symbols-outlined text-xl">
              chevron_right
            </span>
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmText={confirmConfig.confirmText}
        type={confirmConfig.type}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
      />
    </div>
  );
}