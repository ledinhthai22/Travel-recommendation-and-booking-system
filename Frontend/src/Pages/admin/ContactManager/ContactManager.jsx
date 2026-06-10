import React, { useState, useMemo, useEffect } from 'react';
import CustomDataTable from '~/components/UI/Table/CustomDataTable';
import RowActionsButton from '~/components/UI/Table/Button/RowActionsButton';
import ManagerToolbar from '~/components/UI/ToolBar/ToolBar';
import { getContactsApi } from '~/Services/ContactService';
import { toastError } from '~/utils/Toast';
import { getErrorMessage } from '~/utils/errorHelper';
export default function ContactManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchContacts = async () => {
    try {
      setLoading(true);

      const response = await getContactsApi(1, 10);

      setContacts(response.items || []);
    } catch (error) {
       toastError('Thao tác thất bại', getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const filteredData = useMemo(() => {
    let data = contacts;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();

      data = data.filter(
        item =>
          item.hoTen?.toLowerCase().includes(term) ||
          item.email?.toLowerCase().includes(term) ||
          item.noiDung?.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== 'all') {
      const isRead = statusFilter === 'đã đọc';

      data = data.filter(item => item.trangThai === isRead);
    }

    return data;
  }, [contacts, searchTerm, statusFilter]);

  const handleView = row => {
    console.log('Xem chi tiết liên hệ:', row);
  };

  const handleDelete = row => {
    console.log('Xóa liên hệ:', row);
  };

  const columns = useMemo(
    () => [
      {
        name: 'Người gửi',
        sortable: true,
        width: '240px',
        selector: row => row.hoTen,
        cell: row => (
          <div>
            <p className="font-semibold text-slate-900">
              {row.hoTen}
            </p>
            <p className="text-xs text-slate-500">
              {row.email}
            </p>
          </div>
        ),
      },
      {
        name: 'Nội dung',
        width: '320px',
        selector: row => row.noiDung,
        cell: row => (
          <div>
            <p className="text-xs text-slate-600 line-clamp-2">
              {row.noiDung}
            </p>
          </div>
        ),
      },
      {
        name: 'Số điện thoại',
        selector: row => row.sodienThoai,
        cell: row => (
          <span>{row.sodienThoai}</span>
        ),
      },
      {
        name: 'Ngày gửi',
        sortable: true,
        selector: row => row.ngayTao,
        cell: row => (
          <div>
            <p className="text-sm text-slate-700">
              {new Date(row.ngayTao).toLocaleDateString(
                'vi-VN'
              )}
            </p>
            <p className="text-xs text-slate-400">
              {new Date(row.ngayTao).toLocaleTimeString(
                'vi-VN',
                {
                  hour: '2-digit',
                  minute: '2-digit',
                }
              )}
            </p>
          </div>
        ),
      },
      {
        name: 'Trạng thái',
        cell: row => (
          <span
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-2xl border
            ${
              !row.trangThai
                ? 'bg-blue-100 text-blue-700 border-blue-200'
                : 'bg-emerald-100 text-emerald-700 border-emerald-200'
            }`}
          >
            {!row.trangThai && (
              <span className="bg-blue-500  rounded-full" />
            )}

            {row.trangThai
              ? 'đã đọc'
              : 'chưa đọc'}
          </span>
        ),
      },
      {
        name: 'Thao tác',
        width: '140px',
        cell: row => (
          <RowActionsButton
            row={row}
            onView={handleView}
            onDelete={handleDelete}
          />
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6 p-4">
      <ManagerToolbar
        searchPlaceholder="Tìm kiếm tên, email, nội dung..."
        onSearchChange={setSearchTerm}
        showCategoryFilter={false}
        showAddButton={false}
        showExcel={false}
      />

      <CustomDataTable
        columns={columns}
        data={filteredData}
        progressPending={loading}
        pagination
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