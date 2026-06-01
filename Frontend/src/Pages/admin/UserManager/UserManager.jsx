import React, { useState, useMemo } from 'react';
import CustomDataTable from '~/components/UI/Table/CustomDataTable'
import RowActionsButton from '~/components/UI/Table/Button/RowActionsButton'
import ManagerToolbar from '~/components/UI/ToolBar/ToolBar';
const USERS_DATA = [
    {
        id: 1,
        name: 'Lê Minh Tuấn',
        email: 'minhtuan.le@fluidexplorer.com',
        avatar: 'https://i.pravatar.cc/150?u=1',
        role: 'Quản trị viên',
        status: 'Đang hoạt động',
        date: '12/05/2023',
        isLocked: false
    },
    {
        id: 2,
        name: 'Nguyễn Thu Hà',
        email: 'thuha.nguyen@travel.co',
        avatar: 'https://i.pravatar.cc/150?u=2',
        role: 'Điều hành Tour',
        status: 'Đang hoạt động',
        date: '08/11/2023',
        isLocked: false
    },
    {
        id: 3,
        name: 'Trần Hoàng Nam',
        email: 'nam.tran@concierge.vn',
        avatar: 'https://i.pravatar.cc/150?u=3',
        role: 'Hướng dẫn viên',
        status: 'Ngoại tuyến',
        date: '15/01/2024',
        isLocked: false
    },
    {
        id: 4,
        name: 'Phạm Thùy Linh',
        email: 'thuylinh.p@partner.com',
        avatar: 'https://i.pravatar.cc/150?u=4',
        role: 'Khách hàng VIP',
        status: 'Đã khóa',
        date: '20/09/2022',
        isLocked: true
    },
    {
        id: 5,
        name: 'Phạm Thùy Linh',
        email: 'thuylinh.p@partner.com',
        avatar: 'https://i.pravatar.cc/150?u=4',
        role: 'Khách hàng VIP',
        status: 'Đã khóa',
        date: '20/09/2022',
        isLocked: true
    },
];

const getStatusStyle = (status) => {
    switch (status) {
        case 'Đang hoạt động':
            return 'text-green-600 bg-green-50 border-green-200';
        case 'Nghỉ phép':
            return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        case 'Đã khóa':
            return 'text-red-500 bg-red-50 border-red-200';
        default:
            return 'text-slate-500 bg-slate-50 border-slate-200';
    }
};

export default function UserManager() {
    const [searchTerm, setSearchTerm] = useState('');

    // Lọc dữ liệu
    const filteredData = useMemo(() => {
        if (!searchTerm.trim()) return USERS_DATA;
        const term = searchTerm.toLowerCase();
        return USERS_DATA.filter(item =>
            item.name.toLowerCase().includes(term) ||
            item.email.toLowerCase().includes(term) ||
            item.role.toLowerCase().includes(term)
        );
    }, [searchTerm]);

    const handleEdit = (row) => {
        console.log('Edit user:', row);
        // Thêm logic chỉnh sửa sau
    };

    const handleView = (row) => {
        console.log('View user:', row);
        // Thêm logic xem chi tiết sau
    };

    const handleDelete = (row) => {
        console.log('Delete user:', row);
        // Thêm logic xóa (nên có confirm dialog)
    };

    const columns = useMemo(() => [
        {
            name: 'Người dùng',
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
                        <h4 className={`font-bold text-sm truncate ${row.isLocked ? 'text-slate-400' : 'text-slate-900'}`}>
                            {row.name}
                        </h4>
                        <p className="text-xs text-slate-500 truncate">{row.email}</p>
                    </div>
                </div>
            ),
        },
        {
            name: 'Vai trò',
            sortable: true,
            selector: row => row.role,
            cell: (row) => (
                <p className={`text-sm font-semibold ${row.isLocked ? 'text-slate-400' : 'text-slate-700'}`}>
                    {row.role}
                </p>
            ),
        },
        {
            name: 'Trạng thái',
            cell: (row) => (
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${getStatusStyle(row.status)}`}>
                    {row.status}
                </span>
            ),
        },
        {
            name: 'Ngày tham gia',
            sortable: true,
            selector: row => row.date,
            cell: (row) => (
                <span className="text-sm text-slate-500 font-medium">{row.date}</span>
            ),
        },
        {
            name: 'Thao tác',
            width: '150px',
            cell: (row) => (
                <RowActionsButton
                    row={row}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
                />
            ),
        },
    ], []);

    return (
        <div className="space-y-6 p-4">
            <ManagerToolbar
                searchPlaceholder="Tìm kiếm người dùng..."
                onSearchChange={setSearchTerm}
                addButtonText="Thêm người dùng"
                showCategoryFilter={false}
            />

            <CustomDataTable
                selectableRows
                selectableRowsHighlight
                columns={columns}
                data={filteredData}
                paginationPerPage={8}         
            />
        </div>
    );
}