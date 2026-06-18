import React, { useState, useEffect } from 'react';
import ManagerCard from '~/components/UI/Card/ManagerCard';
import ManagerToolbar from '~/components/UI/ToolBar/ToolBar';
import LocationFormPage from './LocationFormPage';
import { getLocationApi, deleteLocationApi } from '~/Services/LocationService';
import { getAllTypeLocationApi } from '~/Services/TypeLocationService';
import { toastError, toastSuccess, toastWarning } from '~/utils/Toast';
import { getErrorMessage } from '~/utils/errorHelper';

export default function LocationManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(8);

  const [locations, setLocations] = useState([]);
  const [allTypes, setAllTypes] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [selectedLocation, setSelectedLocation] = useState(null);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      let statusParam = statusFilter === '' ? null : statusFilter === 'true';
      const response = await getLocationApi(currentPage, perPage, searchTerm, statusParam);
      setLocations(response.items || []);
      setTotalRows(response.totalItems || 0);
    } catch (error) {
      toastError("Lỗi tải danh sách địa điểm!");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllTypes = async () => {
    try {
      const res = await getAllTypeLocationApi();
      setAllTypes(res || []);
    } catch (error) {
      toastError("Không tải được danh sách loại");
    }
  };

  useEffect(() => {
    fetchAllTypes();
    fetchLocations();
  }, [currentPage, perPage, searchTerm, statusFilter]);

  const handleOpenForm = (mode, data = null) => {
    setFormMode(mode);
    setSelectedLocation(data);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedLocation(null);
  };

  const handleSuccess = () => {
    setShowForm(false);
    fetchLocations();
  };

  const handleDelete = async (item) => {
    if (item.trangThai === true) {
      toastWarning("Không thể xóa địa điểm đang hoạt động. Vui lòng chuyển sang trạng thái ẩn trước!");
      return;
    }
    try {
      await deleteLocationApi(item.maDiaDiem);
      toastSuccess("Đã xóa địa điểm thành công!");
      fetchLocations();
    } catch (error) {
      toastError("Xóa thất bại", getErrorMessage(error));
    }
  };

  if (showForm) {
    return (
      <div>
        <LocationFormPage
          mode={formMode}
          initialData={selectedLocation}
          onCancel={handleCloseForm}
          onSave={handleSuccess}
        />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <ManagerToolbar
        searchPlaceholder="Tìm kiếm địa điểm..."
        onSearchChange={(value) => { setSearchTerm(value); setCurrentPage(1); }}
        addButtonText="Thêm địa điểm"
        onAddClick={() => handleOpenForm('add')}
        showExcel={false}
        filters={[
          {
            placeholder: "Trạng thái",
            value: statusFilter,
            onChange: (value) => { setStatusFilter(value); setCurrentPage(1); },
            options: [
              { value: "", label: "Tất cả" },
              { value: "true", label: "Đang khai thác" },
              { value: "false", label: "Ngưng khai thác" }
            ],
          }
        ]}
      />

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : locations.length === 0 ? (
        <div className="text-center py-20 text-slate-500 font-medium bg-white rounded-2xl border border-dashed border-slate-300">
          Không tìm thấy địa điểm nào!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {locations.map((item, index) => (
            <ManagerCard
              key={`${item.maDiaDiem}-${index}`}
              item={{
                ...item,
                tenLoai: allTypes.find(t => t.maLoaiDD === item.loaiDiaDiem)?.tenLoaiDD || item.loaiDiaDiem
              }}
              type="location"
              onView={() => handleOpenForm('view', item)}
              onEdit={() => handleOpenForm('edit', item)}
              onDelete={item.trangThai === false
                ? () => handleDelete(hotel)
                : null}
            />
          ))}
        </div>
      )}
      {totalRows > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-2 pt-6 border-t border-slate-100 gap-4 mt-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">Số lượng:</span>
              <select
                value={perPage}
                onChange={(e) => {
                  setPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block p-1.5 outline-none cursor-pointer"
              >
                <option value={8}>8</option>
                <option value={16}>16</option>
                <option value={24}>24</option>
                <option value={32}>32</option>
              </select>
            </div>
            <span className="text-sm text-slate-400 font-medium">
              Hiển thị {(currentPage - 1) * perPage + 1} – {Math.min(currentPage * perPage, totalRows)} / {totalRows}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-sky-600 disabled:opacity-40 transition-all"
            >
              <span className="material-symbols-outlined text-xl">chevron_left</span>
            </button>
            {Array.from({ length: Math.ceil(totalRows / perPage) }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 rounded-xl text-sm font-bold ${currentPage === page ? 'bg-sky-500 text-white' : 'border border-slate-200 text-slate-600'}`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(Math.ceil(totalRows / perPage), p + 1))}
              disabled={currentPage === Math.ceil(totalRows / perPage)}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-sky-600 disabled:opacity-40 transition-all"
            >
              <span className="material-symbols-outlined text-xl">chevron_right</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}