import React, { useState, useEffect, useCallback, useMemo } from 'react';
import CustomDataTable from '~/components/UI/Table/CustomDataTable';
import RowActionsButton from '~/components/UI/Table/Button/RowActionsButton';
import ManagerToolbar from '~/components/UI/ToolBar/ToolBar';

import {
    getWebInfoApi,
    clearWebInfoContentApi,
    updateWebInfoStatusApi
} from '~/Services/WebInfoService'

import { toastError, toastSuccess } from "~/utils/Toast";
import { getErrorMessage } from "~/utils/errorHelper";

import WebInfoDetailModal from "./WebInfoDetailModal";
import WebInfoEditModal from "./WebInfoEditModal";
import ConfirmModal from '~/components/UI/Modal/ConfirmModal';

// Dictionary mapping dịch các Key sang tiếng Việt dựa theo JSON dữ liệu của bạn
const KEY_TRANSLATIONS = {
    "ten_trang": "Tên trang",
    "logo_url": "Đường dẫn Logo",
    "Map_Trang_Lien_He": "Bản đồ trang liên hệ",
    "zalo": "Số Zalo",
    "email_hotro": "Email hỗ trợ",
    "so_dien_thoai": "Số điện thoại",
    "dia_chi": "Địa chỉ",
    "facebook_url": "Đường dẫn Facebook",
    // FAQ 1
    "faq_1_question": "FAQ 1: Câu hỏi",
    "faq_1_answer": "FAQ 1: Câu trả lời",
    // FAQ 2
    "faq_2_question": "FAQ 2: Câu hỏi",
    "faq_2_answer": "FAQ 2: Câu trả lời",
    // FAQ 3
    "faq_3_question": "FAQ 3: Câu hỏi",
    "faq_3_answer": "FAQ 3: Câu trả lời",
    // FAQ 4
    "faq_4_question": "FAQ 4: Câu hỏi",
    "faq_4_answer": "FAQ 4: Câu trả lời",
    // FAQ 5
    "faq_5_question": "FAQ 5: Câu hỏi",
    "faq_5_answer": "FAQ 5: Câu trả lời",
};

export default function Webinfo() {

    const [searchTerm, setSearchTerm] = useState('');
    const [webInfo, setWebInfo] = useState([]);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");
    const [openView, setOpenView] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmConfig, setConfirmConfig] = useState({
        title: '',
        message: '',
        type: 'danger',
        confirmText: 'Xác nhận',
        action: null
    });
    const pageSize = 100000000;
    
    const fetchWebInfo = useCallback(async (key = '', statusValue = "") => {
        setLoading(true);

        const res = await getWebInfoApi(
            1,
            pageSize,
            key,
            statusValue === "" ? null : statusValue === "true"
        );

        setWebInfo(res?.items || []);
        setLoading(false);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchWebInfo(searchTerm, status);
        }, 100);

        return () => clearTimeout(timer);
    }, [searchTerm, status, fetchWebInfo]);
    
    const handleConfirm = async () => {
        try {
            await confirmConfig.action?.();
        } catch (error) {
            toastError("Thao tác thất bại", getErrorMessage(error));
        } finally {
            setConfirmOpen(false);
        }
    };

    const handleView = useCallback((row) => {
        setSelectedItem(row);
        setOpenView(true);
    }, []);

    const handleEdit = useCallback((row) => {
        setSelectedItem(row);
        setOpenEdit(true);
    }, []);

    const handleToggleStatus = useCallback((row) => {
        const displayName = KEY_TRANSLATIONS[row.key] || row.key; // Tên hiển thị dạng tiếng Việt
        setConfirmConfig({
            title: "Cập nhật trạng thái",
            message: `Bạn muốn thay đổi trạng thái "${displayName}"?`,
            type: "warning",
            confirmText: "Cập nhật",
            action: async () => {
                await updateWebInfoStatusApi(row.maTTTrang, !row.trangthai);
                toastSuccess("Cập nhật thành công");
                fetchWebInfo(searchTerm);
            }
        });

        setConfirmOpen(true);
    }, [fetchWebInfo, searchTerm]);

    const handleDelete = useCallback((row) => {
        const displayName = KEY_TRANSLATIONS[row.key] || row.key; // Tên hiển thị dạng tiếng Việt
        setConfirmConfig({
            title: "Xóa thông tin",
            message: `Bạn có chắc muốn xóa nội dung "${displayName}" không?`,
            type: "danger",
            confirmText: "Xóa",
            action: async () => {
                await clearWebInfoContentApi(row.maTTTrang);
                toastSuccess("Xóa thành công", displayName);
                fetchWebInfo(searchTerm);
            }
        });

        setConfirmOpen(true);
    }, [fetchWebInfo, searchTerm]);

    const columns = useMemo(() => [
        {
            name: 'STT',
            width: '80px',
            center: 'true',
            selector: row => row.maTTTrang,
            sortable: true,
        },
        {
            name: 'Tên thông tin (Key)',
            selector: row => KEY_TRANSLATIONS[row.key] || row.key, // Hỗ trợ sort theo tiếng Việt nếu thư viện CustomDataTable có tích hợp
            sortable: true,
            cell: (row) => (
                <div>
                    {/* Hiển thị Tiếng Việt in đậm nổi bật hơn */}
                    <div className="text-sm font-semibold text-slate-800">
                        {KEY_TRANSLATIONS[row.key] || row.key} 
                    </div>
                    {/* Giữ lại key gốc font-mono nhỏ hơn ở dưới để tiện đối chiếu dev khi cần */}
                    <div className="font-mono text-xs text-slate-400 mt-0.5">
                        {row.key}
                    </div>
                </div>
            ),
        },
        {
            name: 'Nội dung',
            selector: row => row.noidung,
            cell: (row) => {
                if (row.key === "logo_url") {
                    return (
                        <img
                            src={`https://localhost:7016${row.noidung}`}
                            alt="Logo"
                            className="h-12 object-contain py-1"
                        />
                    );
                }

                return (
                    <div className="text-sm text-slate-700 max-w-xs truncate" title={row.noidung}>
                        {row.noidung || <em className="text-slate-300">Chưa có dữ liệu</em>}
                    </div>
                );
            }
        },
        {
            name: 'Trạng thái',
            selector: row => row.trangthai,
            cell: (row) => (
                <span className={`px-4 py-1.5 rounded-4xl text-xs font-bold ${row.trangthai
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                    }`}>
                    {row.trangthai ? "Hiển thị" : "Ẩn"}
                </span>
            )
        },
        {
            name: 'Ngày cập nhật',
            selector: row => row.ngayCapNhat,
            cell: (row) => {
                const date = row.ngayCapNhat ? new Date(row.ngayCapNhat) : null;

                return (
                    <div>
                        <p className="text-sm text-slate-700">
                            {date ? date.toLocaleDateString('vi-VN') : '--'}
                        </p>
                        <p className="text-xs text-slate-400">
                            {date ? date.toLocaleTimeString('vi-VN', {
                                hour: '2-digit',
                                minute: '2-digit'
                            }) : '--'}
                        </p>
                    </div>
                );
            }
        },
        {
            name: 'Thao tác',
            width: '150px',
            cell: (row) => (
                <RowActionsButton
                    row={row}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={!row.trangthai ? handleDelete : undefined}
                />
            )
        }
    ], [handleView, handleEdit, handleDelete]);

    return (
        <div className="space-y-6 p-4">

            <ManagerToolbar
                searchPlaceholder="Tìm kiếm thông tin..."
                onSearchChange={setSearchTerm}
                showAddButton={false}
                showExcel={false}
                filters={[
                    {
                        placeholder: "Trạng thái",
                        value: status,
                        onChange: setStatus,
                        options: [
                            { value: "", label: "Tất cả" },
                            { value: "true", label: "Hiển thị" },
                            { value: "false", label: "Ẩn" }
                        ],
                    }
                ]}
            />

            <CustomDataTable
                columns={columns}
                data={webInfo}
                paginationPerPage={10}
                highlightOnHover
                pointerOnHover
                paginationComponentOptions={{
                    rowsPerPageText: 'Số dòng:',
                    rangeSeparatorText: 'trên',
                    noRowsPerPage: false,
                    selectAllRowsItem: true,
                    selectAllRowsItemText: 'Tất cả',
                }}
                noDataComponent={
                    <div className="py-8 text-center">
                        <p className="text-slate-400 text-sm">
                            Không có dữ liệu
                        </p>
                    </div>
                }
            />

            <WebInfoDetailModal
                isOpen={openView}
                onClose={() => setOpenView(false)}
                data={selectedItem}
                onReload={() => fetchWebInfo(searchTerm, status)}
            />

            <WebInfoEditModal
                isOpen={openEdit}
                onClose={() => setOpenEdit(false)}
                data={selectedItem}
                onReload={() => fetchWebInfo(searchTerm, status)}
            />

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