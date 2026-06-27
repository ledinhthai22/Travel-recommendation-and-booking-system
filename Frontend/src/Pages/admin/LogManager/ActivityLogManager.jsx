import React, { useCallback, useEffect, useMemo, useState } from 'react';
import CustomDataTable from '~/components/UI/Table/CustomDataTable';
import RowActionsButton from '~/components/UI/Table/Button/RowActionsButton';
import ManagerToolbar from '~/components/UI/ToolBar/ToolBar';
import logService from '~/Services/LogService';
import LogDetailModal from './LogModalDetail';
import {connection} from "~/Services/signalRService";
const ACTION_COLOR_MAP = {
    'Tạo': 'bg-emerald-100 text-emerald-700',
    'Cập nhật': 'bg-amber-100 text-amber-700',
    'Xóa': 'bg-red-100 text-red-700',
    'Đăng nhập': 'bg-blue-100 text-blue-700',
    'Cập nhật trạng thái': 'bg-purple-100 text-purple-700',
    'Đặt lại mật khẩu': 'bg-orange-100 text-orange-700',
    'Xem danh sách': 'bg-slate-100 text-slate-600',
    'Xem chi tiết': 'bg-sky-100 text-sky-700',
};

export default function ActivityLogManager() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [totalRows, setTotalRows] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [selectedLogId, setSelectedLogId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchLogs = useCallback(async (page, size, key) => {
        try {
            setLoading(true);
            const res = await logService.getLogsPage(page, size, key);
            if (res?.success) {
                setLogs(res.data?.items ?? []);
                setTotalRows(res.data?.totalItems ?? 0);
            }
        } catch (err) {
            console.error('Lỗi tải log:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLogs(pageNumber, pageSize, searchTerm);
    }, [pageNumber, pageSize]);
    useEffect(() => {

        const connectSignalR = async () => {
            try {

                if (connection.state === "Disconnected") {
                    await connection.start();
                }

                console.log("SignalR Connected");

                connection.on(
                    "ReceiveActivityLog",
                    (newLog) => {

                        console.log(
                            "Realtime Log:",
                            newLog
                        );

                        setLogs(prev => [
                            newLog,
                            ...prev
                        ]);

                        setTotalRows(prev => prev + 1);
                    }
                );

            } catch (error) {
                console.error(
                    "SignalR Error:",
                    error
                );
            }
        };

        connectSignalR();

        return () => {
            connection.off("ReceiveActivityLog");
        };

    }, []);
    useEffect(() => {
        const timer = setTimeout(() => {
            setPageNumber(1);
            fetchLogs(1, pageSize, searchTerm);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleView = useCallback((row) => {
        setSelectedLogId(row.maNhatKy);
        setIsModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedLogId(null);
    }, []);

    const columns = useMemo(() => [
        {
            name: 'Loại tài khoản',
            sortable: true,
            selector: row => row.loaiTaiKhoan,
            cell: row => (
                <span className="text-[12px] font-bold  tracking-wide">
                    {row.loaiTaiKhoan}
                </span>
            )
        },
        {
            name: 'Hành động',
            sortable: true,
            selector: row => row.tenHanhDong,
            cell: row => (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap
                    ${ACTION_COLOR_MAP[row.tenHanhDong] ?? 'bg-slate-100 text-slate-700'}`}>
                    {row.tenHanhDong}
                </span>
            )
        },
        {
            name: 'IP',
            selector: row => row.diaChiIP,
            cell: row => (
                <span className="font-mono text-xs text-slate-600">
                    {row.diaChiIP ?? '—'}
                </span>
            ),
            minWidth: '60px',
        },
        {
            name: 'Trình duyệt',
            minWidth: '180px',
            selector: row => row.trinhDuyet,
            cell: row => (
                <p className="text-xs text-slate-500 truncate" title={row.trinhDuyet}>
                    {row.trinhDuyet ?? '—'}
                </p>
            )
        },
        {
            name: 'Thời gian',
            sortable: true,
            selector: row => row.thoiGianTao,
            cell: row => {
                const date = new Date(row.thoiGianTao);
                return (
                    <div>
                        <p className="text-sm text-slate-700">
                            {date.toLocaleDateString('vi-VN')}
                        </p>
                        <p className="text-xs text-slate-400">
                            {date.toLocaleTimeString('vi-VN')}
                        </p>
                    </div>
                );
            }
        },
        {
            name: 'Thao tác',
            width: '150px',
            cell: row => (
                <RowActionsButton
                    row={row}
                    onView={handleView}
                    showEdit={false}
                    showDelete={false}
                />
            )
        }
    ], [handleView]);

    return (
        <div className="space-y-6 p-4">
            <ManagerToolbar
                searchPlaceholder="Tìm hành động, module, loại tài khoản..."
                onSearchChange={setSearchTerm}
                showAddButton={false}
                showExcel={false}
            />
            <CustomDataTable
                columns={columns}
                data={logs}
                progressPending={loading}
                pagination
                paginationServer
                paginationTotalRows={totalRows}
                paginationDefaultPage={pageNumber}
                paginationPerPage={pageSize}
                onChangePage={(page) => setPageNumber(page)}
                onChangeRowsPerPage={(newSize) => {
                    setPageSize(newSize);
                    setPageNumber(1);
                }}
                paginationComponentOptions={{
                    rowsPerPageText: 'Số dòng:',
                    rangeSeparatorText: 'trên',
                    noRowsPerPage: false,
                    selectAllRowsItem: false,
                }}
                highlightOnHover
                pointerOnHover
                noDataComponent={
                    <div className="py-8 text-center">
                        <p className="text-slate-400 text-sm">Không có dữ liệu</p>
                    </div>
                }
            />

            <LogDetailModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                logId={selectedLogId}
            />
        </div>
    );
}