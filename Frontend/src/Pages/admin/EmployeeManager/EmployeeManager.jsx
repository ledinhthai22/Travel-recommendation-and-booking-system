import React, { useMemo, useState } from 'react';
import CustomDataTable from '~/components/UI/Table/CustomDataTable'
import RowActionsButton from '~/components/UI/Table/Button/RowActionsButton'
import ManagerToolbar from '~/components/UI/ToolBar/ToolBar';
const EMPLOYEES_DATA = [
    {
        id: 'NV001',
        name: 'Lê Hoàng Nam',
        email: 'nam.lh@thefluid.com',
        avatar: 'https://i.pravatar.cc/150?u=6',
        role: 'Trưởng phòng Kinh doanh',
        dept: 'Kinh doanh',
        status: 'Đang làm việc',
        statusColor: 'bg-emerald-500',
        statusText: 'text-emerald-600',
        date: '12/05/2023',
        isLocked: false
    },
    {
        id: 'NV002',
        name: 'Phạm Thanh Thảo',
        email: 'thao.pt@thefluid.com',
        avatar: 'https://i.pravatar.cc/150?u=7',
        role: 'Giám sát Điều hành',
        dept: 'Điều hành',
        status: 'Đang làm việc',
        statusColor: 'bg-emerald-500',
        statusText: 'text-emerald-600',
        date: '08/11/2023',
        isLocked: false
    },
    {
        id: 'NV003',
        name: 'Đỗ Minh Hải',
        email: 'hai.dm@thefluid.com',
        avatar: 'https://i.pravatar.cc/150?u=8',
        role: 'Thiết kế Tour',
        dept: 'Sản phẩm',
        status: 'Nghỉ phép',
        statusColor: 'bg-amber-500',
        statusText: 'text-amber-600',
        date: '15/01/2024',
        isLocked: false
    },
    {
        id: 'NV004',
        name: 'Vũ Thu Hà',
        email: 'ha.vt@thefluid.com',
        avatar: 'https://i.pravatar.cc/150?u=9',
        role: 'Chuyên viên CSKH',
        dept: 'CSKH',
        status: 'Đã nghỉ việc',
        statusColor: 'bg-red-500',
        statusText: 'text-red-600',
        date: '20/09/2022',
        isLocked: true
    },
    {
        id: 'NV005',
        name: 'Bùi Tấn Tài',
        email: 'tai.bt@thefluid.com',
        avatar: 'https://i.pravatar.cc/150?u=10',
        role: 'Kỹ thuật viên IT',
        dept: 'Kỹ thuật',
        status: 'Đang làm việc',
        statusColor: 'bg-emerald-500',
        statusText: 'text-emerald-600',
        date: '10/02/2024',
        isLocked: false
    },
];
const getStatusStyle = (status) => {
    switch (status) {
        case 'Đang làm việc':
            return 'text-green-600 bg-green-50 border-green-200';
        case 'Nghỉ phép':
            return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        case 'Đã nghỉ việc':
            return 'text-red-500 bg-red-50 border-red-200';
        default:
            return 'text-slate-500 bg-slate-50 border-slate-200';
    }
};

export default function EmployeeManager() {
    const [searchTerm, setSearchTerm] = useState('');
    const View = (row) => {
    };
    const handleEdit = (row) => {

    };
    const handleDelete = (row) => {
    };
   
    const filteredData = EMPLOYEES_DATA.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = useMemo(() => [
        {
            name: 'Nhân sự',
            sortable: true,
            selector: row => row.name,
            cell: (row) => (
                <div className="flex items-center gap-4 py-1">
                    <img
                        src={row.avatar}
                        alt={row.name}
                        className={`w-10 h-10 rounded-full object-cover border border-slate-200 flex-shrink-0
                            ${row.isLocked ? 'opacity-50 grayscale' : ''}`}
                    />
                    <div className="min-w-0">
                        <h4 className={`font-bold text-sm truncate ${row.isLocked ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                            {row.name}
                        </h4>
                        <p className="text-xs text-slate-500 truncate">{row.email}</p>
                    </div>
                </div>
            ),
        },
        {
            name: 'Vị trí / Phòng ban',
            sortable: true,
            selector: row => row.role,
            cell: (row) => (
                <div>
                    <p className={`text-sm font-semibold ${row.isLocked ? 'text-slate-400' : 'text-slate-700'}`}>
                        {row.role}
                    </p>
                    <p className="text-[11px] text-blue-600 font-bold uppercase tracking-wider">
                        {row.dept}
                    </p>
                </div>
            ),
        },
        {
            name: 'Ngày gia nhập',
            sortable: true,
            selector: row => row.date,
            cell: (row) => (
                <span className="text-sm text-slate-500 font-medium">{row.date}</span>
            ),
        },
        {
            name: 'Trạng thái',
            cell: (row) => (
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${getStatusStyle(row.status)}`}>
                    {row.status}
                </span>
            ),
        }, {
            name: 'Thao tác',
            width: '150px',
            cell: (row) => (
                <RowActionsButton
                    row={row}
                    onView={View}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                />
            ),
        },
    ], []);

    return (
        <div className="space-y-6 p-4">
            <ManagerToolbar
                searchPlaceholder="Tìm kiếm nhân viên..."
                onSearchChange={setSearchTerm}
                addButtonText="Thêm nhân viên"
                showCategoryFilter={false}
                showExcel ={true}
            />

            {/* DataTable */}
            <CustomDataTable
                selectableRows
                selectableRowsHighlight
                columns={columns}
                data={filteredData}
                paginationPerPage={5}
                paginationComponentOptions={{
                    rowsPerPageText: 'Số dòng:',
                    rangeSeparatorText: 'trên',
                    noRowsPerPage: false,
                    selectAllRowsItem: true,
                    selectAllRowsItemText: 'Tất cả',
                }}
                highlightOnHover
                pointerOnHover
                noDataComponent={
                    <div className="py-8 text-center">
                        <p className="text-slate-400 text-sm">
                            Không có dữ liệu
                        </p>
                    </div>
                }
            />

        </div>
    );
}