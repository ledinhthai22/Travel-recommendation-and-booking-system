import React, { useState, useEffect, useCallback, useMemo } from "react";

import CustomDataTable from "~/components/UI/Table/CustomDataTable";
import ManagerToolbar from "~/components/UI/ToolBar/ToolBar";
import RowActionsButton from "~/components/UI/Table/Button/RowActionsButton";
import { formatCurrency } from "~/Helper/FormatCurrency";
import { getPromotionApi, getPromotionByIdApi, deletePromotionApi } from "~/Services/PromotionService";
import { connection } from "~/Services/signalRService";
import PromotionDetailModal from "./PromotionDetailModal";
import CreatePromotionModal from "./CreatePromotionModal";
import UpdatePromotionModal from "./UpdatePromotionModal";
import ConfirmModal from "~/components/UI/Modal/ConfirmModal";
export default function PromotionManager() {
    const [searchCode, setSearchCode] = useState("");
    const [searchName, setSearchName] = useState("");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const [promotions, setPromotions] = useState([]);
    const [now, setNow] = useState(Date.now());
    const [openDetail, setOpenDetail] = useState(false);
    const [selectedPromotion, setSelectedPromotion] = useState(null);
    const [openCreate, setOpenCreate] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [confirmConfig, setConfirmConfig] = useState({
        title: '',
        message: '',
        type: 'danger',
        confirmText: 'Xác nhận',
        action: null
    });
    const [confirmOpen, setConfirmOpen] = useState(false);

    const pageSize = 100000000;
    useEffect(() => {
        const timer = setInterval(() => {
            setNow(Date.now());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const getTimeLeft = (endDate) => {
        if (!endDate) return "Không có dữ liệu";

        const end = new Date(endDate).getTime();

        if (isNaN(end)) {
            return "Ngày không hợp lệ";
        }

        const diff = end - now;

        if (diff <= 0) {
            return "Đã hết hạn";
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
            (diff / (1000 * 60 * 60)) % 24
        );
        const minutes = Math.floor(
            (diff / (1000 * 60)) % 60
        );

        return `${days}d ${hours}h ${minutes}m`;
    };


    const statusLabels = {
        1: "Chờ kích hoạt",
        2: "Đang hoạt động",
        3: "Ngưng hoạt động",
        4: "Hết hạn"
    };

    const statusColors = {
        1: "bg-yellow-100 text-yellow-700",
        2: "bg-green-100 text-green-700",
        3: "bg-yellow-100 text-yellow-700",
        4: "bg-slate-100 text-slate-700"
    };

    const handleConfirm = async () => {
        try {
            await confirmConfig.action?.();
        } catch (error) {
            toastError(getErrorMessage(error));
        } finally {
            setConfirmOpen(false);
        }
    };
    const fetchPromotions = useCallback(async () => {
        try {
            setLoading(true);

            const res = await getPromotionApi(
                1,
                pageSize,
                searchCode,
                searchName,
                status === "" ? undefined : Number(status)
            );

            setPromotions(res?.items || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [searchCode, searchName, status]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchPromotions();
        }, 300);

        return () => clearTimeout(timer);
    }, [fetchPromotions]);


    useEffect(() => {
        const startSignalR = async () => {
            try {
                if (connection.state === "Disconnected") {
                    await connection.start();
                }

                console.log("SignalR Connected");

                connection.off("PromotionStatusChanged");

                connection.on("PromotionStatusChanged", () => {
                    console.log(
                        "Promotion status changed - refreshing..."
                    );

                    fetchPromotions();
                });
            } catch (error) {
                console.error("SignalR Error:", error);

                setTimeout(startSignalR, 5000);
            }
        };

        startSignalR();

        return () => {
            connection.off("PromotionStatusChanged");
        };
    }, [fetchPromotions]);


    const handleView = async (row) => {
        try {
            const res = await getPromotionByIdApi(row.maUuDai);

            setSelectedPromotion(res);
            setOpenDetail(true);
        } catch (error) {
            console.log(error);
        }
    };
    const handleEdit = async (row) => {
        const res = await getPromotionByIdApi(
            row.maUuDai
        );
        console.log("Promotion Detail:", res);
        setSelectedPromotion(res);
        setOpenUpdate(true);
    };
    const handleDelete = useCallback((row) => {
        setConfirmConfig({
            title: "Xóa ưu đãi ",
            message: `Bạn có chắc muốn xóa "${row.tenUuDai}" không?`,
            type: "danger",
            confirmText: "Xóa",
            action: async () => {
                await deletePromotionApi(row.maUuDai);
                toastSuccess("Xóa thành công nhân viên", row.tenUuDai);
                fetchStaffs();
            }
        });
        setConfirmOpen(true);
    }, [fetchPromotions]);
    const columns = useMemo(
        () => [
            {
                name: "STT",
                width: "80px",
                center: true,
                cell: (row, index) => (
                    <span className="font-medium">{index + 1}</span>
                )
            },
            {
                name: "Mã Code",
                selector: (row) => row.maCode,
                cell: (row) => (
                    <div className="font-mono font-semibold">
                        {row.maCode}
                    </div>
                )
            },
            {
                name: "Tên ưu đãi",
                selector: (row) => row.tenUuDai
            },
            {
                name: "Điều kiện áp dụng",
                selector: (row) => ` > ${formatCurrency(row.dieuKienApDung)}`,
                center: 'true'

            },
            {
                name: "Giảm (%)",
                selector: (row) => row.phanTramGiam,
                sortable: true,
                center: 'true',
                cell: (row) => (
                    <span className="text-amber-600 font-bold">
                        {row.phanTramGiam}%
                    </span>
                )
            },
            {
                name: "Số lượng tối đa",
                selector: (row) => row.soLuongToiDa,
                center: 'true',
                sortable: true,
                cell: (row) => (
                    <span className="font-semibold text-red-500/80">
                        {row.soLuongToiDa}
                    </span>
                )
            },
            {
                name: "Thời gian còn lại",
                center: 'true',
                cell: (row) => (
                    <span className="font-semibold text-[10px] text-blue-600">
                        {getTimeLeft(row.ngayHetHan)}
                    </span>
                )
            },
            {
                name: "Trạng thái",
                selector: (row) => row.trangThai,

                cell: (row) => (
                    <span
                        className={`px-4 py-1 rounded-full text-xs font-bold ${statusColors[row.trangThai] ||
                            "bg-slate-100 text-slate-700"
                            }`}
                    >
                        {statusLabels[row.trangThai] || "Không xác định"}
                    </span>
                )
            },
            {
                name: "Thao tác",
                width: "150px",
                center: 'true',
                cell: (row) => (
                    <RowActionsButton
                        row={row}
                        onView={handleView}
                        onEdit={
                            [1, 2, 3].includes(row.trangThai)
                                ? handleEdit
                                : undefined
                        }
                        onDelete={
                            row.trangThai === 4
                                ? handleDelete
                                : undefined
                        }
                    />
                )
            }
        ],
        [now]
    );

    return (
        <div className="space-y-6 p-4">
            <ManagerToolbar
                searchPlaceholder="Tìm mã hoặc tên ưu đãi..."
                onSearchChange={setSearchCode}
                showAddButton={true}
                addButtonText="Thêm ưu đãi"
                showExcel={false}
                filters={[
                    {
                        placeholder: "Trạng thái",
                        value: status,
                        onChange: setStatus,
                        options: [
                            { value: "", label: "Tất cả" },
                            { value: "1", label: "Chờ kích hoạt" },
                            { value: "2", label: "Đang hoạt động" },
                            { value: "3", label: "Ngưng hoạt động" },
                            { value: "4", label: "Hết hạn" }
                        ]
                    }
                ]}
                onAddClick={() => setOpenCreate(true)}
            />

            <CustomDataTable
                columns={columns}
                data={promotions}
                pagination
                paginationPerPage={10}
                progressPending={loading}
                highlightOnHover
                pointerOnHover
                paginationComponentOptions={{
                    rowsPerPageText: "Số dòng:",
                    rangeSeparatorText: "trên",
                    noRowsPerPage: false,
                    selectAllRowsItem: true,
                    selectAllRowsItemText: "Tất cả"
                }}
                noDataComponent={
                    <div className="py-8 text-center">
                        <p className="text-slate-400 text-sm">
                            Không có dữ liệu
                        </p>
                    </div>
                }
            />
            <PromotionDetailModal
                isOpen={openDetail}
                onClose={() => setOpenDetail(false)}
                promotion={selectedPromotion}
            />
            <CreatePromotionModal
                isOpen={openCreate}
                onClose={() => setOpenCreate(false)}
                onSuccess={fetchPromotions}
            />
            <UpdatePromotionModal
                isOpen={openUpdate}
                onClose={() => setOpenUpdate(false)}
                promotion={selectedPromotion}
                onSuccess={fetchPromotions}
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