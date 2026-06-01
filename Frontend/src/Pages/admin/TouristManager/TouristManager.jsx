import React, { useState, useMemo } from 'react';
import CustomDataTable from '~/components/UI/Table/CustomDataTable';
import RowActionsButton from '~/components/UI/Table/Button/RowActionsButton';
import ManagerToolbar from '~/components/UI/ToolBar/ToolBar';

const TOUR_PARTICIPANTS_DATA = [
  {
    id: 101,
    tourName: "Vịnh Hạ Long 3N2Đ",
    tourCode: "HL-20260412",
    startDate: "15/04/2026",
    customerName: "Nguyễn Thị Lan",
    email: "lan.nguyen@gmail.com",
    phone: "0912 345 678",
    avatar: "https://i.pravatar.cc/150?u=lan",
    passengers: 2,
    amount: "9.700.000đ",
    status: "Đã xác nhận",
    statusColor: "bg-emerald-100 text-emerald-700 border-emerald-200"
  },
  {
    id: 102,
    tourName: "Vịnh Hạ Long 3N2Đ",
    tourCode: "HL-20260412",
    startDate: "15/04/2026",
    customerName: "Trần Minh Quân",
    email: "quan.tran@yahoo.com",
    phone: "0987 654 321",
    avatar: "https://i.pravatar.cc/150?u=quan",
    passengers: 4,
    amount: "19.400.000đ",
    status: "Chờ thanh toán",
    statusColor: "bg-amber-100 text-amber-700 border-amber-200"
  },
  {
    id: 103,
    tourName: "Phú Quốc Beach Resort 4N3Đ",
    tourCode: "PQ-20260505",
    startDate: "20/04/2026",
    customerName: "Lê Hoàng Nam",
    email: "nam.le@hotmail.com",
    phone: "0934 567 890",
    avatar: "https://i.pravatar.cc/150?u=nam",
    passengers: 1,
    amount: "6.450.000đ",
    status: "Đã xác nhận",
    statusColor: "bg-emerald-100 text-emerald-700 border-emerald-200"
  },
  {
    id: 104,
    tourName: "Phú Quốc Beach Resort 4N3Đ",
    tourCode: "PQ-20260505",
    startDate: "20/04/2026",
    customerName: "Phạm Thu Hà",
    email: "hapham@gmail.com",
    phone: "0978 123 456",
    avatar: "https://i.pravatar.cc/150?u=ha",
    passengers: 3,
    amount: "19.350.000đ",
    status: "Đã xác nhận",
    statusColor: "bg-emerald-100 text-emerald-700 border-emerald-200"
  },
  {
    id: 105,
    tourName: "Fansipan Sapa 2N1Đ",
    tourCode: "SP-20260418",
    startDate: "18/04/2026",
    customerName: "Đặng Thị Mai",
    email: "mai.dang@gmail.com",
    phone: "0901 234 567",
    avatar: "https://i.pravatar.cc/150?u=mai",
    passengers: 2,
    amount: "5.580.000đ",
    status: "Đã huỷ",
    statusColor: "bg-red-100 text-red-700 border-red-200"
  },
];

export default function TourParticipantsManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTour, setSelectedTour] = useState('all');

  // Lọc dữ liệu
  const filteredData = useMemo(() => {
    let data = TOUR_PARTICIPANTS_DATA;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      data = data.filter(item =>
        item.customerName.toLowerCase().includes(term) ||
        item.email.toLowerCase().includes(term) ||
        item.tourName.toLowerCase().includes(term)
      );
    }

    if (selectedTour !== 'all') {
      data = data.filter(item => item.tourCode === selectedTour);
    }

    return data;
  }, [searchTerm, selectedTour]);

  const handleEdit = (row) => {
    console.log('Edit participant:', row);
  };

  const handleView = (row) => {
    console.log('View participant:', row);
  };

  const handleDelete = (row) => {
    console.log('Delete participant:', row);
  };

  const columns = useMemo(() => [
    {
      name: 'Khách hàng',
      sortable: true,
      selector: row => row.customerName,
      cell: (row) => (
        <div className="flex items-center gap-4 py-2">
          <img
            src={row.avatar}
            alt={row.customerName}
            className="w-11 h-11 rounded-full object-cover border border-slate-200"
          />
          <div>
            <h4 className="font-bold text-sm text-slate-900">{row.customerName}</h4>
            <p className="text-xs text-slate-500">{row.email}</p>
            <p className="text-xs text-slate-400">{row.phone}</p>
          </div>
        </div>
      ),
    },
    {
      name: 'Tour',
      sortable: true,
      selector: row => row.tourName,
      cell: (row) => (
        <div>
          <p className="font-medium text-slate-800">{row.tourName}</p>
          <p className="text-xs font-mono text-slate-400">{row.tourCode}</p>
          <p className="text-[10px] text-slate-500">Khởi hành: {row.startDate}</p>
        </div>
      ),
    },
    {
      name: 'Số khách',
      selector: row => row.passengers,
      cell: (row) => (
        <div className="text-center">
          <span className="font-semibold text-slate-700">{row.passengers}</span>
          <span className="text-xs text-slate-400 block">người</span>
        </div>
      ),
    },
    {
      name: 'Số tiền',
      selector: row => row.amount,
      cell: (row) => (
        <span className="font-bold text-emerald-600 text-right block">{row.amount}</span>
      ),
    },
    {
      name: 'Trạng thái',
      cell: (row) => (
        <span className={`inline-block px-4 py-1 text-xs font-bold rounded-2xl border ${row.statusColor}`}>
          {row.status}
        </span>
      ),
    },
    {
      name: 'Thao tác',
      width: '180px',
      cell: (row) => (
        <RowActionsButton
          row={row}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ),
    },
  ], []);
  return (
    <div className="space-y-6 p-4">
      <ManagerToolbar
        searchPlaceholder="Tìm khách hàng hoặc tour..."
        onSearchChange={setSearchTerm}
        addButtonText="Thêm khách vào tour"
        showCategoryFilter={false}
      />
      <CustomDataTable
        columns={columns}
        data={filteredData}
        selectableRows
        selectableRowsHighlight
        paginationPerPage={10}
        paginationRowsPerPageOptions={[8, 10, 15, 20]}
        highlightOnHover
        pointerOnHover
        noDataComponent={
          <div className="py-12 text-center text-slate-400">
            Không tìm thấy khách hàng nào theo bộ lọc
          </div>
        }
      />
    </div>
  );
}