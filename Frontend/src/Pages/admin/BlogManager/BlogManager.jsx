import React, { useState, useMemo } from 'react';
import CustomDataTable from '~/components/UI/Table/CustomDataTable';
import RowActionsButton from '~/components/UI/Table/Button/RowActionsButton';
import ManagerToolbar from '~/components/UI/ToolBar/ToolBar';

const ARTICLES_DATA = [
    {
        id: 1,
        title: "Top 10 bãi biển đẹp nhất Việt Nam năm 2026",
        category: "Du lịch Biển",
        author: "Nguyễn Thị Lan",
        status: "published",
        views: 12480,
        createdAt: "12/04/2026",
        image: "https://images.unsplash.com/photo-1506929562872-bb421503efbf?q=80&w=600",
        excerpt: "Khám phá những bãi biển hoang sơ và nổi tiếng nhất Việt Nam trong năm nay.",
    },
    {
        id: 2,
        title: "Hướng dẫn chi tiết chinh phục Fansipan mùa đông",
        category: "Vùng Núi",
        author: "Trần Minh Quân",
        status: "draft",
        views: 3420,
        createdAt: "10/04/2026",
        image: "https://images.unsplash.com/photo-1504457047772-27faf1c00561?q=80&w=600",
        excerpt: "Những kinh nghiệm thực tế và chuẩn bị cần thiết khi leo Fansipan vào mùa lạnh.",
    },
    {
        id: 3,
        title: "Phố cổ Hội An về đêm – Vẻ đẹp không thể bỏ lỡ",
        category: "Phố Cổ",
        author: "Lê Thị Hương",
        status: "published",
        views: 8750,
        createdAt: "08/04/2026",
        image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=600",
        excerpt: "Không khí lung linh, thả đèn hoa đăng và những trải nghiệm khó quên.",
    },
    {
        id: 4,
        title: "Review tour Đà Lạt 4 ngày 3 đêm đầy đủ nhất",
        category: "Cao Nguyên",
        author: "Phạm Văn Hải",
        status: "published",
        views: 6520,
        createdAt: "05/04/2026",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600",
        excerpt: "Lịch trình chi tiết, chi phí và những địa điểm không nên bỏ lỡ tại Đà Lạt.",
    },
    {
        id: 5,
        title: "Côn Đảo - Thiên đường nghỉ dưỡng ít người biết đến",
        category: "Du lịch Biển",
        author: "Hoàng Thị Mai",
        status: "draft",
        views: 1890,
        createdAt: "03/04/2026",
        image: "https://images.unsplash.com/photo-1573160813959-929af7b9d51e?q=80&w=600",
        excerpt: "Những trải nghiệm độc đáo và lý do nên một lần đến với Côn Đảo.",
    },
    {
        id: 6,
        title: "Những homestay view triệu đô tại Sapa",
        category: "Vùng Núi",
        author: "Đỗ Minh Đức",
        status: "published",
        views: 5430,
        createdAt: "01/04/2026",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=600",
        excerpt: "Top homestay có view ruộng bậc thang và mây núi tuyệt đẹp.",
    },
];

const STATUS_MAP = {
    published: { label: "Đã xuất bản", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    draft:     { label: "Bản nháp",    color: "bg-amber-100 text-amber-700 border-amber-200" },
};

export default function BlogManager() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');

    const handleView = (row) => {
        // TODO: Open article detail / preview
    };

    const handleDelete = (row) => {
        // TODO: Delete article with confirmation
    };
    const handleEdit = (row) =>{

    };

    const categories = useMemo(() => {
        const unique = [...new Set(ARTICLES_DATA.map(a => a.category))];
        return unique;
    }, []);

    const filteredData = useMemo(() => {
        let data = ARTICLES_DATA;

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            data = data.filter(item =>
                item.title.toLowerCase().includes(term) ||
                item.author.toLowerCase().includes(term) ||
                item.category.toLowerCase().includes(term)
            );
        }

        if (statusFilter !== 'all') {
            data = data.filter(item => item.status === statusFilter);
        }

        if (categoryFilter !== 'all') {
            data = data.filter(item => item.category === categoryFilter);
        }

        return data;
    }, [searchTerm, statusFilter, categoryFilter]);

    // Summary stats
    const stats = useMemo(() => {
        const total = ARTICLES_DATA.length;
        const published = ARTICLES_DATA.filter(a => a.status === 'published').length;
        const draft = ARTICLES_DATA.filter(a => a.status === 'draft').length;
        const totalViews = ARTICLES_DATA.reduce((sum, a) => sum + a.views, 0);
        return { total, published, draft, totalViews };
    }, []);

    const columns = useMemo(() => [
        {
            name: 'Bài viết',
            sortable: true,
            selector: row => row.title,
            cell: (row) => (
                <div className="flex items-center gap-3 py-1">
                    <img
                        src={row.image}
                        alt={row.title}
                        className="w-14 h-10 object-cover rounded-lg flex-shrink-0 bg-slate-100"
                    />
                    <div className="min-w-0">
                        <p className="font-semibold text-slate-900 text-sm line-clamp-1">{row.title}</p>
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{row.excerpt}</p>
                    </div>
                </div>
            ),
        },
        {
            name: 'Danh mục',
            sortable: true,
            selector: row => row.category,
            cell: (row) => (
                <span className="text-xs font-medium px-3 py-1 bg-slate-100 text-slate-600 rounded-full">
                    {row.category}
                </span>
            ),
        },
        {
            name: 'Tác giả',
            sortable: true,
            selector: row => row.author,
            cell: (row) => (
                <p className="text-sm text-slate-700 font-medium">{row.author}</p>
            ),
        },
        {
            name: 'Lượt xem',
            sortable: true,
            selector: row => row.views,
            cell: (row) => (
                <div className="flex items-center gap-1.5 text-slate-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span className="text-sm font-semibold">{row.views.toLocaleString('vi-VN')}</span>
                </div>
            ),
        },
        {
            name: 'Ngày tạo',
            sortable: true,
            selector: row => row.createdAt,
            cell: (row) => (
                <p className="text-sm text-slate-600">{row.createdAt}</p>
            ),
        },
        {
            name: 'Trạng thái',
            cell: (row) => {
                const s = STATUS_MAP[row.status] ?? { label: row.status, color: 'bg-slate-100 text-slate-500 border-slate-200' };
                return (
                    <span className={`inline-block px-3 py-1.5 text-xs font-bold rounded-2xl border ${s.color}`}>
                        {s.label}
                    </span>
                );
            },
        },
        {
            name: 'Thao tác',
            width: '150px',
            cell: (row) => (
                <RowActionsButton
                    row={row}
                    onView={handleView}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                />
            ),
        },
    ], []);

    return (
        <div className="space-y-6 p-4">
            <div>
                <ManagerToolbar
                    searchPlaceholder="Tìm kiếm bài viết..."
                    onSearchChange={setSearchTerm}
                    addButtonText="Viết bài mới"
                    showExcel = {false}
                />
            </div>

            {/* DataTable */}
            <CustomDataTable
                selectableRows
                selectableRowsHighlight
                columns={columns}
                data={filteredData}
                paginationPerPage={10}
                highlightOnHover
                pointerOnHover
            />
        </div>
    );
}