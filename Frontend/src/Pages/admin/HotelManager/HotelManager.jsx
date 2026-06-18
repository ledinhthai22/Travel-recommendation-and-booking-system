import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import ManagerCard from "~/components/UI/Card/ManagerCard";
import ManagerToolbar from "~/components/UI/ToolBar/ToolBar";

import { getHotelApi, deleteHotelApi } from "~/Services/HotelService";
import { toastSuccess, toastError, toastWarning } from "~/utils/Toast";
import { getErrorMessage } from "~/utils/errorHelper";
import ConfirmModal from "~/components/UI/Modal/ConfirmModal";
export default function HotelManager() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [starFilter, setStarFilter] = useState("");
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmConfig, setConfirmConfig] = useState({});
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(8);

    const fetchHotels = async () => {
        try {
            setLoading(true);
            const response = await getHotelApi(
                currentPage,
                perPage,
                searchTerm,
                "",
                "",
                starFilter ? Number(starFilter) : null,
                statusFilter ? statusFilter === "true" : null
            );

            setHotels(response.items || []);
            setTotalRows(response.totalItems || 0);
        } catch (error) {
            toastError("Lỗi tải danh sách khách sạn!", getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHotels();
    }, [currentPage, perPage, searchTerm, statusFilter, starFilter]);


    const handleAddHotel = () => navigate("/Quan-ly/Khach-san/Them-Khach-San");

    const handleViewHotel = (hotel) =>
        navigate(`/Quan-ly/Khach-san/Xem-chi-tiet/${hotel.maKhachSan}`);

    const handleEditHotel = (hotel) =>
        navigate(`/Quan-ly/Khach-san/Cap-nhat/${hotel.maKhachSan}`);

    const executeDelete = async (hotel) => {
        try {
            await deleteHotelApi(hotel.maKhachSan);

            toastSuccess(
                `Đã xóa khách sạn "${hotel.tenKhachSan}" thành công!`
            );

            fetchHotels();
        } catch (error) {
            toastError(
                "Xóa thất bại",
                getErrorMessage(error)
            );
        }
    };
    const handleDelete = (hotel) => {
        if (hotel.trangThai === true) {
            toastWarning(
                "Không thể xóa khách sạn đang hoạt động. Vui lòng chuyển sang trạng thái ngưng hoạt động trước!"
            );
            return;
        }

        setConfirmConfig({
            title: "Xác nhận xóa khách sạn",
            message: `Bạn có chắc chắn muốn xóa khách sạn "${hotel.tenKhachSan}" không?`,
            type: "danger",
            confirmText: "Xóa",
            action: () => executeDelete(hotel)
        });

        setConfirmOpen(true);
    };
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
                            { value: "", label: "Tất cả" },
                            { value: "true", label: "Đang hợp tác" },
                            { value: "false", label: "Ngưng hoạt động" },
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
                            { value: "", label: "Tất cả sao" },
                            { value: "5", label: "5 sao" },
                            { value: "4", label: "4 sao" },
                            { value: "3", label: "3 sao" },
                            { value: "2", label: "2 sao" },
                            { value: "1", label: "1 sao" },
                        ],
                    },
                ]}
            />

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : hotels.length === 0 ? (
                <div className="text-center py-20 text-slate-500 font-medium bg-white rounded-2xl border border-dashed border-slate-300">
                    Không tìm thấy khách sạn nào!
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {hotels.map((hotel) => (
                        <ManagerCard
                            key={hotel.maKhachSan}
                            item={hotel}
                            type="hotel"
                            onView={() => handleViewHotel(hotel)}
                            onEdit={() => handleEditHotel(hotel)}
                            onDelete={hotel.trangThai === false
                                ? () => handleDelete(hotel)
                                : null}
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
                title={confirmConfig.title}
                message={confirmConfig.message}
                type={confirmConfig.type}
                confirmText={confirmConfig.confirmText}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={async () => {
                    await confirmConfig.action?.();
                    setConfirmOpen(false);
                }}
            />
        </div>
    );
}