import React, { useState, useMemo } from 'react';
import CustomDataTable from '~/components/UI/Table/CustomDataTable';
import RowActionsButton from '~/components/UI/Table/Button/RowActionsButton';
import ManagerToolbar from '~/components/UI/ToolBar/ToolBar';

const REVIEW_DATA = [
    {
        id: 1,
        customerName: "Nguyễn Văn An",
        email: "an.nguyen@gmail.com",
        avatar: "NA",
        tourName: "Tour Vịnh Hạ Long 3N2Đ",
        tourCode: "HLG-2026-04",
        rating: 5,
        title: "Chuyến đi tuyệt vời, rất đáng tiền!",
        comment: "Hướng dẫn viên nhiệt tình, phong cảnh đẹp, dịch vụ trên tàu rất tốt. Sẽ quay lại lần sau.",
        date: "15/04/2026",
        time: "10:20",
        status: "Đã duyệt",
        statusColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
        helpful: 24,
        images: 3,
    },
    {
        id: 2,
        customerName: "Trần Thị Mai",
        email: "mai.tran@yahoo.com",
        avatar: "TM",
        tourName: "Tour Phú Quốc 4N3Đ",
        tourCode: "PQC-2026-03",
        rating: 4,
        title: "Đẹp nhưng ăn uống chưa ổn",
        comment: "Biển Phú Quốc rất đẹp, khách sạn tốt. Tuy nhiên bữa ăn tối hôm thứ 2 không ngon, hy vọng cải thiện.",
        date: "14/04/2026",
        time: "14:35",
        status: "Chờ duyệt",
        statusColor: "bg-amber-100 text-amber-700 border-amber-200",
        helpful: 8,
        images: 5,
    },
    {
        id: 3,
        customerName: "Lê Hoàng Nam",
        email: "nam.le@hotmail.com",
        avatar: "LN",
        tourName: "Tour Đà Lạt 3N2Đ",
        tourCode: "DLT-2026-03",
        rating: 2,
        title: "Thất vọng về tổ chức tour",
        comment: "Xe đón trễ 2 tiếng, lịch trình bị thay đổi không báo trước. Mong công ty cải thiện khâu tổ chức.",
        date: "12/04/2026",
        time: "09:15",
        status: "Bị ẩn",
        statusColor: "bg-red-100 text-red-700 border-red-200",
        helpful: 15,
        images: 0,
    },
    {
        id: 4,
        customerName: "Phạm Thu Hà",
        email: "hapham@gmail.com",
        avatar: "PH",
        tourName: "Tour Hội An - Đà Nẵng 4N3Đ",
        tourCode: "HAN-2026-04",
        rating: 5,
        title: "Hoàn hảo từ đầu đến cuối!",
        comment: "Đây là lần thứ 3 tôi đặt tour với công ty, lần nào cũng hài lòng. HDV Minh rất chuyên nghiệp và vui tính.",
        date: "11/04/2026",
        time: "16:50",
        status: "Đã duyệt",
        statusColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
        helpful: 31,
        images: 8,
    },
    {
        id: 5,
        customerName: "Hoàng Minh Tú",
        email: "tu.hoang@gmail.com",
        avatar: "HT",
        tourName: "Tour Sapa Trekking 3N2Đ",
        tourCode: "SPA-2026-04",
        rating: 3,
        title: "Cảnh đẹp nhưng đường đi vất vả",
        comment: "Phong cảnh Sapa tuyệt đẹp nhưng lịch trình trekking quá nặng cho người lớn tuổi. Nên có phương án thay thế.",
        date: "10/04/2026",
        time: "08:00",
        status: "Chờ duyệt",
        statusColor: "bg-amber-100 text-amber-700 border-amber-200",
        helpful: 6,
        images: 2,
    },
];

// Star rating display component
const StarRating = ({ rating }) => {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <svg
                    key={star}
                    className={`w-3.5 h-3.5 ${star <= rating ? 'text-amber-400' : 'text-slate-200'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
            <span className="ml-1 text-xs font-semibold text-slate-600">{rating}.0</span>
        </div>
    );
};


const Avatar = ({ initials }) => {
    const colors = [
        'bg-violet-100 text-violet-700',
        'bg-blue-100 text-blue-700',
        'bg-emerald-100 text-emerald-700',
        'bg-rose-100 text-rose-700',
        'bg-amber-100 text-amber-700',
    ];
    const colorIndex = initials.charCodeAt(0) % colors.length;
    return (
        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${colors[colorIndex]}`}>
            {initials}
        </div>
    );
};

export default function ReviewManager() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [ratingFilter, setRatingFilter] = useState('all');

    const handleView = (row) => {
        // TODO: Open review detail modal
    };

    const handleDelete = (row) => {
        // TODO: Delete review with confirmation
    };

    const filteredData = useMemo(() => {
        let data = REVIEW_DATA;

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            data = data.filter(item =>
                item.customerName.toLowerCase().includes(term) ||
                item.email.toLowerCase().includes(term) ||
                item.tourName.toLowerCase().includes(term) ||
                item.title.toLowerCase().includes(term)
            );
        }

        if (statusFilter !== 'all') {
            data = data.filter(item => item.status === statusFilter);
        }

        if (ratingFilter !== 'all') {
            data = data.filter(item => item.rating === parseInt(ratingFilter));
        }

        return data;
    }, [searchTerm, statusFilter, ratingFilter]);

    const columns = useMemo(() => [
        {
            name: 'Khách hàng',
            sortable: true,
            Width: '200px',
            selector: row => row.customerName,
            cell: (row) => (
                <div className="flex items-center gap-3 py-1">
                    <Avatar initials={row.avatar} />
                    <div>
                        <p className="font-semibold text-slate-900 text-sm">{row.customerName}</p>
                        <p className="text-xs text-slate-500">{row.email}</p>
                    </div>
                </div>
            ),
        },
        {
            name: 'Tour',
            Width: '200px',
            selector: row => row.tourName,
            cell: (row) => (
                <div>
                    <p className="font-medium text-slate-800 text-sm line-clamp-1">{row.tourName}</p>
                    <p className="text-xs text-slate-400 font-mono">{row.tourCode}</p>
                </div>
            ),
        },
        {
            name: 'Đánh giá',
            sortable: true,
            Width: '220px',
            selector: row => row.rating,
            cell: (row) => (
                <div>
                    <StarRating rating={row.rating} />
                    <p className="text-xs font-medium text-slate-700 mt-1 line-clamp-1">{row.title}</p>
                    <p className="text-xs text-slate-400 line-clamp-1">{row.comment}</p>
                </div>
            ),
        },
        {
            name: 'Hữu ích',
            sortable: true,
            width: '100px',
            selector: row => row.helpful,
            cell: (row) => (
                <div className="flex items-center gap-1 text-slate-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                    <span className="text-sm font-medium">{row.helpful}</span>
                </div>
            ),
        },
        {
            name: 'Ngày gửi',
            sortable: true,
            width: '120px',
            selector: row => row.date,
            cell: (row) => (
                <div className="text-center">
                    <p className="text-sm text-slate-600">{row.date}</p>
                    <p className="text-xs text-slate-400">{row.time}</p>
                </div>
            ),
        },
        {
            name: 'Trạng thái',
            width: '130px',
            cell: (row) => (
                <span className={`inline-block px-3 py-1.5 text-xs font-bold rounded-2xl border ${row.statusColor}`}>
                    {row.status}
                </span>
            ),
        },
        {
            name: 'Thao tác',
            width: '150px',
            cell: (row) => (
                <RowActionsButton
                    row={row}
                    onView={handleView}
                    onDelete={handleDelete}
                />
            ),
        },
    ], []);

    const stats = useMemo(() => {
        const total = REVIEW_DATA.length;
        const approved = REVIEW_DATA.filter(r => r.status === 'Đã duyệt').length;
        const pending = REVIEW_DATA.filter(r => r.status === 'Chờ duyệt').length;
        const avgRating = (REVIEW_DATA.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1);
        return { total, approved, pending, avgRating };
    }, []);

    return (
        <div className="space-y-6 p-4">
            <div>
                <ManagerToolbar
                    searchPlaceholder="Tìm theo tên, tour, tiêu đề..."
                    onSearchChange={setSearchTerm}
                    showCategoryFilter={false}
                    showAddButton={false}
                    showExcel ={false}
                />
            </div>
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