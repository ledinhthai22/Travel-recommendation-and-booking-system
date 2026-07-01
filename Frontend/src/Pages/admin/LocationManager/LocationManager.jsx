import React, { useState, useEffect } from 'react';
import ManagerCard from '~/components/UI/Card/ManagerCard';
import ManagerToolbar from '~/components/UI/ToolBar/ToolBar';
import LocationFormModal from './LocationFormModal';
import { getLocationApi, deleteLocationApi, updateLocationStatusApi } from '~/Services/LocationService';
import { getAllTypeLocationApi } from '~/Services/TypeLocationService';
import { toastError, toastSuccess, toastWarning } from '~/utils/Toast';
import { getErrorMessage } from '~/utils/errorHelper';
import ConfirmModal from '~/components/UI/Modal/ConfirmModal';


export default function LocationManager() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(8);

    const [locations, setLocations] = useState([]);
    const [allTypes, setAllTypes] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [loading, setLoading] = useState(false);

    // Modal
    const [modalOpen, setModalOpen] = useState(false);
    const [formMode, setFormMode] = useState('add');
    const [selectedLocation, setSelectedLocation] = useState(null);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmConfig, setConfirmConfig] = useState({
        title: '', message: '', type: 'warning', confirmText: 'Xác nhận', action: null
    });

    const fetchAllTypes = async () => {
        try {
            const res = await getAllTypeLocationApi();
            setAllTypes(res || []);
        } catch (error) {
            toastError("Không tải được danh sách loại");
        }
    };
    // Thay useEffect cũ bằng cái này
    useEffect(() => {
        fetchAllTypes();           // Chỉ gọi 1 lần
    }, []); // ← Dependencies rỗng

    useEffect(() => {
        fetchLocations();
    }, [currentPage, perPage, searchTerm, statusFilter]);

    const fetchLocations = async () => {
        try {
            // Chỉ show loading khi search hoặc filter thay đổi, KHÔNG show khi chỉ chuyển trang
            const isInitialOrFilterChange = currentPage === 1 || searchTerm || statusFilter;

            if (isInitialOrFilterChange) {
                setLoading(true);
            }

            const statusParam = statusFilter === '' ? null : statusFilter === 'true';
            const response = await getLocationApi(currentPage, perPage, searchTerm, statusParam);

            setLocations(response.items || []);
            setTotalRows(response.totalItems || 0);
        } catch (error) {
            toastError("Lỗi tải danh sách địa điểm!");
        } finally {
            setLoading(false);
        }
    };


    const handleOpenModal = (mode, data = null) => {
        setFormMode(mode);
        setSelectedLocation(data);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedLocation(null);
    };

    const handleSuccess = () => {
        handleCloseModal();
        fetchLocations();
    };

    action: async () => {
        try {
            setLoading(true);

            const result = await deleteLocationApi(
                item.maDiaDiem
            );

            toastSuccess(
                result?.message ||
                "Đã xóa địa điểm thành công!"
            );

            if (
                locations.length === 1 &&
                currentPage > 1
            ) {
                setCurrentPage(prev => prev - 1);
            } else {
                fetchLocations();
            }
        }
        catch (error) {
            toastError(
                "Xóa địa điểm thất bại!",
                getErrorMessage(error)
            );
        }
        finally {
            setLoading(false);
        }
    }
    const handleToggleStatus = async (item) => {
        try {
            const result =
                await updateLocationStatusApi(
                    item.maDiaDiem,
                    !item.trangThai
                );

            toastSuccess(
                result.message
            );

            fetchLocations();
        }
        catch (error) {
            toastError(
                "Cập nhật trạng thái thất bại",
                getErrorMessage(error)
            );
        }
    };
    const generatePaginationPages = (current, total) => {
        if (total <= 7) {
            return Array.from({ length: total }, (_, i) => i + 1);
        }

        const pages = [];
        const showFirst = 2;
        const showLast = 2;
        const showAround = 2;

        // First pages
        for (let i = 1; i <= Math.min(showFirst, total); i++) {
            pages.push(i);
        }

        // Middle pages around current
        const start = Math.max(showFirst + 1, current - showAround);
        const end = Math.min(total - showLast, current + showAround);

        if (start > showFirst + 1) {
            pages.push('...');
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (end < total - showLast) {
            pages.push('...');
        }

        // Last pages
        for (let i = Math.max(total - showLast + 1, end + 1); i <= total; i++) {
            pages.push(i);
        }

        // Remove duplicates
        return [...new Set(pages)];
    };
    const handleChangeStatus = (item) => {
        setConfirmConfig({
            title: "Cập nhật trạng thái",
            message: item.trangThai
                ? `Ngưng khai thác "${item.tenDiaDiem}" ?`
                : `Khai thác lại "${item.tenDiaDiem}" ?`,
            type: "warning",
            confirmText: "Xác nhận",
            action: async () => {
                try {
                    const result =
                        await updateLocationStatusApi(
                            item.maDiaDiem,
                            !item.trangThai
                        );

                    toastSuccess(
                        result.message ||
                        "Cập nhật trạng thái thành công!"
                    );

                    fetchLocations();
                }
                catch (error) {
                    toastError(
                        "Cập nhật trạng thái thất bại",
                        getErrorMessage(error)
                    );
                }
            }
        });

        setConfirmOpen(true);
    };
    const handleDelete = (item) => {
        setConfirmConfig({
            title: "Xóa địa điểm",
            message: `Bạn có chắc muốn xóa "${item.tenDiaDiem}" không?`,
            type: "danger",
            confirmText: "Xóa",
            action: async () => {
                try {
                    setLoading(true);

                    const result = await deleteLocationApi(item.maDiaDiem);

                    toastSuccess(
                        result?.message ||
                        "Đã xóa địa điểm thành công!"
                    );

                    if (locations.length === 1 && currentPage > 1) {
                        setCurrentPage(prev => prev - 1);
                    } else {
                        fetchLocations();
                    }
                }
                catch (error) {
                    toastError(
                        "Xóa địa điểm thất bại!",
                        getErrorMessage(error)
                    );
                }
                finally {
                    setLoading(false);
                }
            }
        });

        setConfirmOpen(true);
    };
    return (
        <div className="p-4 space-y-6">
            <ManagerToolbar
                searchPlaceholder="Tìm kiếm địa điểm..."
                onSearchChange={(value) => { setSearchTerm(value); setCurrentPage(1); }}
                addButtonText="Thêm địa điểm"
                onAddClick={() => handleOpenModal('add')}
                showExcel={false}
                filters={[
                    {
                        placeholder: "Trạng thái",
                        value: statusFilter,
                        onChange: (value) => { setStatusFilter(value); setCurrentPage(1); },
                        options: [
                            { value: "", label: "Tất cả" },
                            { value: "true", label: "Đang khai thác" },
                            { value: "false", label: "Ngưng khai thác" }
                        ],
                    }
                ]}
            />

            {/* Danh sách */}
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : locations.length === 0 ? (
                <div className="text-center py-20 text-slate-500 font-medium bg-white rounded-2xl border border-dashed border-slate-300">
                    Không tìm thấy địa điểm nào!
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {locations.map((item) => (
                        <ManagerCard
                            key={item.maDiaDiem}
                            item={{
                                ...item,
                                tenLoai:
                                    allTypes.find(
                                        t => t.maLoaiDD === item.loaiDiaDiem
                                    )?.tenLoaiDD || item.loaiDiaDiem
                            }}
                            type="location"
                            onView={() => handleOpenModal('view', item)}
                            onEdit={() => handleOpenModal('edit', item)}
                            onDelete={
                                item.trangThai === false
                                    ? () => handleDelete(item)
                                    : null
                            }
                            onChangeStatus={() =>
                                handleChangeStatus(item)
                            }
                        />
                    ))}
                </div>
            )}
            {/* Phần phân trang - ĐÃ SỬA */}
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

                    {/* Phân trang thông minh với ellipsis */}
                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-sky-600 disabled:opacity-40 transition-all"
                        >
                            <span className="material-symbols-outlined text-xl">chevron_left</span>
                        </button>

                        {generatePaginationPages(currentPage, Math.ceil(totalRows / perPage)).map((page, index) => (
                            page === '...' ? (
                                <span key={`ellipsis-${index}`} className="w-9 h-9 flex items-center justify-center text-slate-400">
                                    ...
                                </span>
                            ) : (
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
                            )
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
                    if (confirmConfig.action) await confirmConfig.action();
                    setConfirmOpen(false);
                }}
            />

            {/* Modal Form */}
            <LocationFormModal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                mode={formMode}
                initialData={selectedLocation}
                onSave={handleSuccess}
            />
        </div>
    );
}