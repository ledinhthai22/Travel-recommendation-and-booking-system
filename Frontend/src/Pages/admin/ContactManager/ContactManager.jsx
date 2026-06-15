import React, { useState, useMemo, useEffect } from 'react';
import CustomDataTable from '~/components/UI/Table/CustomDataTable';
import RowActionsButton from '~/components/UI/Table/Button/RowActionsButton';
import ManagerToolbar from '~/components/UI/ToolBar/ToolBar';
import ContactDetailModal from './ContactDetailModal';
import { getContactByIdApi, getContactsApi,softDeleteContactApi } from '~/Services/ContactService';
import { toastError,toastSuccess } from '~/utils/Toast';
import { getErrorMessage } from '~/utils/errorHelper';
import ConfirmModal from '~/components/UI/Modal/ConfirmModal';
import { data } from 'react-router-dom';
export default function ContactManager() {
  //quản lý các state(biến) truyền xuống BE  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  //(biến) state lưu dữ liệu Be trả về 
  const [contacts, setContacts] = useState([]);
  const [totalRows,setTotalRows] =useState(0);
  const [loading, setLoading] = useState(false);
  //biến cho modal xem chi tiết
  const [openView, setOpenView] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  //xóa mềm
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({
      title: '',
      message: '',
      type: 'danger',
      confirmText: 'Xác nhận',
      action: null
  });

  // hàm gọi api
  const fetchContacts = async () => {
    try {
      setLoading(true);

      // chuyển đổi statusFilter sang bool cho BE
      let statusParam = null;
      if (statusFilter === 'true') statusParam = true;
      if (statusFilter === 'false') statusParam = false;

      const response = await getContactsApi(currentPage,perPage,searchTerm,statusParam);
      // Map đúng cấu trúc từ PageDTO của BE
      setContacts(response.items || []);
      setTotalRows(response.totalItems || 0);

    } catch (error) {
       toastError('Thao tác thất bại', getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  // lắng nghe thay đổi của api lấy danh sách liên hệ
  useEffect(() => {
    fetchContacts();
  }, [currentPage, perPage, searchTerm, statusFilter]);

  //xem chi tiết
  const handleView = async (row) => {
    if (!row.trangThai) {
            await getContactByIdApi(row.maLienHe);
            setContacts(prev => prev.map(item => 
                item.maLienHe === row.maLienHe ? { ...item, trangThai: true } : item
            ));
            setSelectedItem({ ...row, trangThai: true });
    } else {
        setSelectedItem(row);
    }
    setOpenView(true);
};

  const handleConfirm = async () => {
      try {
          await confirmConfig.action?.();
      } catch (error) {
          toastError("Thao tác thất bại", getErrorMessage(error));
      } finally {
          setConfirmOpen(false);
      }
  };

  //xóa liên hệ
  const handleDelete = (row) => {
      if (!row.trangThai) {
          toastError("Không thể xóa: Liên hệ này chưa được đọc");
          return;
      }
      setConfirmConfig({
          title: "Xóa liên hệ",
          message: `Bạn có chắc chắn muốn xóa liên hệ của "${row.hoTen}" không?`,
          type: "danger",
          confirmText: "Xóa",
          action: async () => {
              setLoading(true);
              await softDeleteContactApi(row.maLienHe);
              toastSuccess("Xóa liên hệ thành công!");
              fetchContacts();
          }
      });
      setConfirmOpen(true);
    };

  const columns = useMemo(
    () => [
      {
        name: 'STT',
        width: '80px',
        center: true,
        cell: (row, index) => (
            <span className="font-medium">{index + 1}</span>
        )
      },
      {
        name: 'Người gửi',
        sortable: true,
        width: '240px',
        selector: row => row.hoTen || '',
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
        selector: row => row.ngayTao || '',
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
            showDelete={row.trangThai===true}
          />
        ),
      },
    ],
    [handleView]
  );

  return (
    <div className="space-y-6 p-4">
      <ManagerToolbar
    searchPlaceholder="Tìm kiếm tên, email, nội dung..."
    onSearchChange={(value) => {
        setSearchTerm(value);
        setCurrentPage(1); // gõ tìm kiếm phải đưa về trang 1  
    }}
    showAddButton={false}
    showExcel={false}
    filters={[
        {
            placeholder: "Trạng thái",
            value: statusFilter,
            onChange: (value) => {
                setStatusFilter(value);
                setCurrentPage(1);
            },
            options: [
                { value: "", label: "Tất cả" },
                { value: "true", label: "Đã đọc" },
                { value: "false", label: "Chưa đọc" }
            ],
        }
    ]}
/>

      <CustomDataTable
        columns={columns}
        data={contacts}
        progressPending={loading}
        pagination
        paginationServer
        paginationTotalRows={totalRows}
        onChangePage={(page) => setCurrentPage(page)}
        onChangeRowsPerPage={(newPerPage, page) => {
            setPerPage(newPerPage);
            setCurrentPage(page);
        }}
        highlightOnHover
        pointerOnHover
        paginationComponentOptions={{
          rowsPerPageText: 'Số dòng:',
          rangeSeparatorText: 'trên',
          noRowsPerPage: false,
          selectAllRowsItem: false,
        }}
        noDataComponent={
          <div className="py-8 text-center">
            <p className="text-slate-400 text-sm">
              Không có dữ liệu
            </p>
          </div>
        }
      />

      <ContactDetailModal 
      isOpen={openView}
      onClose={() => {
        setOpenView(false);
        setSelectedItem(null);
        fetchContacts();
    }}
      data={selectedItem}
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