import React, { useState, useMemo } from 'react';
import CustomDataTable from '~/components/UI/Table/CustomDataTable';
import RowActionsButton from '~/components/UI/Table/Button/RowActionsButton';
import ManagerToolbar from '~/components/UI/ToolBar/ToolBar';

const CONTACT_DATA = [
  {
    id: 1,
    name: "Nguyễn Văn An",
    email: "an.nguyen@gmail.com",
    phone: "0912 345 678",
    subject: "Hỏi về tour Vịnh Hạ Long",
    message: "Tôi muốn biết lịch trình chi tiết và giá tour tháng 5/2026",
    date: "14/04/2026",
    time: "09:45",
    status: "chưa đọc",           // Chỉ dùng 2 trạng thái này
    type: "Hỏi đáp tour"
  },
  {
    id: 2,
    name: "Trần Thị Mai",
    email: "mai.tran@yahoo.com",
    phone: "0987 654 321",
    subject: "Yêu cầu hỗ trợ đặt tour Phú Quốc",
    message: "Gia đình tôi muốn đặt tour 4N3Đ, có thể hỗ trợ phòng gia đình không?",
    date: "13/04/2026",
    time: "14:20",
    status: "đã đọc",
    type: "Đặt tour"
  },
  {
    id: 3,
    name: "Lê Hoàng Nam",
    email: "nam.le@hotmail.com",
    phone: "0934 567 890",
    subject: "Khiếu nại về tour Đà Lạt",
    message: "Tour Đà Lạt tháng này bị hủy đột ngột, mong được hỗ trợ hoàn tiền.",
    date: "12/04/2026",
    time: "16:10",
    status: "chưa đọc",
    type: "Khiếu nại"
  },
  {
    id: 4,
    name: "Phạm Thu Hà",
    email: "hapham@gmail.com",
    phone: "0978 123 456",
    subject: "Thắc mắc chính sách hủy tour",
    message: "Tôi muốn biết chính sách hoàn tiền nếu hủy trước 7 ngày.",
    date: "11/04/2026",
    time: "11:30",
    status: "đã đọc",
    type: "Hỏi đáp"
  },
];

export default function ContactManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const filteredData = useMemo(() => {
    let data = CONTACT_DATA;

    // Lọc theo từ khóa tìm kiếm
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      data = data.filter(item =>
        item.name.toLowerCase().includes(term) ||
        item.email.toLowerCase().includes(term) ||
        item.subject.toLowerCase().includes(term) ||
        item.message.toLowerCase().includes(term)
      );
    }

    // Lọc theo trạng thái (chỉ 2 trạng thái)
    if (statusFilter !== 'all') {
      data = data.filter(item => item.status === statusFilter);
    }

    return data;
  }, [searchTerm, statusFilter]);

  const handleView = (row) => {
    console.log('Xem chi tiết liên hệ:', row);
    // Thêm logic mở modal xem chi tiết
  };

  const handleDelete = (row) => {
    console.log('Xóa liên hệ:', row);
    // Thêm logic xác nhận xóa
  };

  const columns = useMemo(() => [
    {
      name: 'Người gửi',
      sortable: true,
      Width: '240px',
      selector: row => row.name,
      cell: (row) => (
        <div>
          <p className="font-semibold text-slate-900">{row.name}</p>
          <p className="text-xs text-slate-500">{row.email}</p>
        </div>
      ),
    },
    {
      name: 'Tiêu đề & Nội dung',
      Width: '320px',
      selector: row => row.subject,
      cell: (row) => (
        <div>
          <p className="font-medium text-slate-800 line-clamp-1">{row.subject}</p>
          <p className="text-xs text-slate-600 line-clamp-2 mt-1">{row.message}</p>
        </div>
      ),
    },
    {
      name: 'Loại',
      sortable: true,
      selector: row => row.type,
      cell: (row) => (
        <span className="inline-block px-3 py-1 text-xs font-medium bg-slate-100 text-slate-600 rounded-full">
          {row.type}
        </span>
      ),
    },
    {
      name: 'Ngày gửi',
      sortable: true,
      selector: row => row.date,
      cell: (row) => (
        <div>
          <p className="text-sm text-slate-700">{row.date}</p>
          <p className="text-xs text-slate-400">{row.time}</p>
        </div>
      ),
    },
    {
      name: 'Trạng thái',
      cell: (row) => (
        <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-2xl border 
          ${row.status === 'chưa đọc'
            ? 'bg-blue-100 text-blue-700 border-blue-200'
            : 'bg-emerald-100 text-emerald-700 border-emerald-200'
          }`}>
          {row.status === 'chưa đọc' && <span className="w-2 h-2 bg-blue-500 rounded-full" />}
          {row.status}
        </span>
      ),
    },
    {
      name: 'Thao tác',
      width: '140px',
      cell: (row) => (
        <RowActionsButton
          row={row}
          onView={handleView}
          onDelete={handleDelete}
        />
      ),
    },
  ], []);

  return (
    <div className="space-y-6 p-4">
      <ManagerToolbar
        searchPlaceholder="Tìm kiếm tên, email, tiêu đề..."
        onSearchChange={setSearchTerm}
        showCategoryFilter={false}
        showAddButton={false}
        showExcel={false}
      />
      <CustomDataTable
        columns={columns}
        data={filteredData}
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
    </div>
  );
}