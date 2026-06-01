import React, { useState, useMemo } from 'react';
import CustomDataTable from '~/components/UI/Table/CustomDataTable'
import RowActionsButton from '~/components/UI/Table/Button/RowActionsButton'
import ManagerToolbar from '~/components/UI/ToolBar/ToolBar';
const SETTINGS_DATA = [
    {
        id: 1,
        key: "site_name",
        value: "Lối Riêng Travel",
        group: "Thông tin chung",
        description: "Tên website hiển thị",
        type: "text"
    },
    {
        id: 2,
        key: "meta_title",
        value: "Du lịch Việt Nam - Tour chất lượng cao | Lối Riêng Travel",
        group: "SEO",
        description: "Tiêu đề SEO mặc định",
        type: "text"
    },
    {
        id: 3,
        key: "meta_description",
        value: "Khám phá những hành trình du lịch tuyệt vời tại Việt Nam cùng Lối Riêng Travel",
        group: "SEO",
        description: "Mô tả SEO mặc định",
        type: "textarea"
    },
    {
        id: 4,
        key: "hotline",
        value: "1900 1234",
        group: "Liên hệ",
        description: "Số điện thoại hỗ trợ",
        type: "text"
    },
    {
        id: 5,
        key: "email_support",
        value: "info@loirengtravel.com",
        group: "Liên hệ",
        description: "Email hỗ trợ khách hàng",
        type: "text"
    },
    {
        id: 6,
        key: "address",
        value: "Số 123 Đường ABC, Quận 1, TP. Hồ Chí Minh",
        group: "Liên hệ",
        description: "Địa chỉ công ty",
        type: "text"
    },
    {
        id: 7,
        key: "facebook_url",
        value: "https://facebook.com/loirengtravel",
        group: "Mạng xã hội",
        description: "Link Facebook",
        type: "url"
    },
    {
        id: 8,
        key: "instagram_url",
        value: "https://instagram.com/loirengtravel",
        group: "Mạng xã hội",
        description: "Link Instagram",
        type: "url"
    },
    {
        id: 9,
        key: "logo_url",
        value: "/logo.png",
        group: "Hình ảnh",
        description: "Đường dẫn logo website",
        type: "text"
    },
    {
        id: 10,
        key: "footer_copyright",
        value: "© 2026 Lối Riêng Travel. All rights reserved.",
        group: "Footer",
        description: "Nội dung bản quyền chân trang",
        type: "text"
    },
];

export default function Webinfo() {
    const [searchTerm, setSearchTerm] = useState('');
    const [groupFilter, setGroupFilter] = useState('all');
    const handleEdit = (row) => {
    };
    const handleView = (row)=>{

    }
    const handleDelete = (row) => {
    };
    const filteredData = useMemo(() => {
        let data = SETTINGS_DATA;

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            data = data.filter(item =>
                item.key.toLowerCase().includes(term) ||
                item.value.toLowerCase().includes(term) ||
                item.description.toLowerCase().includes(term)
            );
        }

        if (groupFilter !== 'all') {
            data = data.filter(item => item.group === groupFilter);
        }

        return data;
    }, [searchTerm, groupFilter]);

    const columns = useMemo(() => [
        {
            name: 'Khóa (Key)',
            sortable: true,
            selector: row => row.key,
            cell: (row) => (
                <div className="font-mono text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-lg inline-block">
                    {row.key}
                </div>
            ),
        },
        {
            name: 'Giá trị (Value)',
            selector: row => row.value,
            cell: (row) => (
                <div className="text-sm text-slate-700 line-clamp-2 break-all">
                    {row.value}
                </div>
            ),
        },
        {
            name: 'Nhóm',
            sortable: true,
            selector: row => row.group,
            cell: (row) => (
                <span className="text-xs font-medium px-3 py-1 bg-slate-100 text-slate-600 rounded-full">
                    {row.group}
                </span>
            ),
        },
        {
            name: 'Mô tả',
            selector: row => row.description,
            cell: (row) => (
                <span className="text-sm text-slate-500">{row.description}</span>
            ),
        },
        {
            name: 'Thao tác',
            width: '150px',
            cell: (row) => (
                <RowActionsButton
                    row={row}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                    onView={handleView}
                />
            ),
        },
    ], []);


    const groups = useMemo(() => {
        return ['all', ...new Set(SETTINGS_DATA.map(item => item.group))];
    }, []);

    return (
        <div className="space-y-6 p-4">
            <ManagerToolbar
                searchPlaceholder="Tìm kiếm thông tin..."
                onSearchChange={setSearchTerm}
                addButtonText="Thêm thông tin"
                showCategoryFilter={false}
                showAddButton = {false}
                showExcel = {false}
            />
            <CustomDataTable
                columns={columns}
                data={filteredData}
                paginationPerPage={5}
                highlightOnHover
                pointerOnHover
            />
        </div>
    );
}