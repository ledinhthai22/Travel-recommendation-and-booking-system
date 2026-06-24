import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toastSuccess, toastError } from '~/utils/Toast';
import { getErrorMessage } from '~/utils/errorHelper';
import HotelForm from './HotelFormPage';
import ConfirmModal from '~/components/UI/Modal/ConfirmModal';
import {
    getHotelByIdApi,
    updateHotelApi,
    changeHotelStatusApi,
    setMainHotelImageApi,
    deleteHotelImageApi
} from '~/Services/HotelService';

export default function HotelEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [initialData, setInitialData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingData, setPendingData] = useState(null);

    const loadHotelDetail = async () => {
        try {
            setLoading(true);
            const data = await getHotelByIdApi(id);
            setInitialData({
                tenKhachSan: data.tenKhachSan,
                soDienThoai: data.soDienThoai,
                diaChi: data.diaChi,
                soSao: data.soSao,
                moTa: data.moTa,
                trangThai: data.trangThai,
                hinhAnh: data.hinhAnh || [],
                tienIch: data.tienIch || []
            });
        } catch (error) {
            toastError("Không thể tải thông tin khách sạn này!");
            navigate("/Quan-ly/Khach-san");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) loadHotelDetail();
    }, [id]);

    const handleStatusChange = async (newStatus) => {
        try {
            await changeHotelStatusApi(id, newStatus);
            toastSuccess("Thay đổi trạng thái khách sạn thành công!",);
            setInitialData(prev => ({ ...prev, trangThai: newStatus }));
        } catch (error) {
            console.error("Lỗi cập nhật trạng thái:", error);
            toastError("Không thể thay đổi trạng thái khách sạn.");
        }
    };

    const handleSetMainImage = async (imageId) => {
        try {
            await setMainHotelImageApi(imageId);
            toastSuccess("Đã đặt làm ảnh đại diện khách sạn thành công!");
            await loadHotelDetail();
        } catch (error) {
            console.error("Lỗi đặt ảnh chính:", error);
            toastError("Không thể đặt ảnh này làm ảnh chính.");
        }
    };

    const handleFormSubmit = (data) => {
        setPendingData(data);
        setConfirmOpen(true);
    };

    const handleConfirmUpdate = async () => {
        if (!pendingData) return;

        try {
            const formData = new FormData();
            formData.append("TenKhachSan", pendingData.tenKhachSan.trim());
            formData.append("SoSao", pendingData.soSao);
            formData.append("DiaChi", pendingData.diaChi.trim());
            formData.append("SoDienThoai", pendingData.soDienThoai.trim());
            formData.append("MoTa", pendingData.moTa?.trim() || "");
            formData.append("TrangThai", pendingData.trangThai);

            if (pendingData.maTienIch && pendingData.maTienIch.length > 0) {
                pendingData.maTienIch.forEach(id => {
                    formData.append("MaTienIch", id);
                });
            }

            if (pendingData.images && pendingData.images.length > 0) {
                pendingData.images.forEach(img => {
                    if (img.file) {
                        formData.append("images", img.file);
                    }
                });
            }

            await updateHotelApi(id, formData);
            toastSuccess("Cập nhật thông tin khách sạn thành công", formData.tenKhachSan);
            navigate("/Quan-ly/Khach-san");
        } catch (error) {
            toastError(getErrorMessage(error));
        } finally {
            setConfirmOpen(false);
            setPendingData(null);
        }
    };
    const handleRemoveOldImage = async (imageId) => {
        try {
            // Gọi API xóa trực tiếp dưới DB backend
            await deleteHotelImageApi(imageId);
            toastSuccess("Xóa hình ảnh thành công!");
            // Load lại dữ liệu khách sạn để cập nhật state đồng bộ
            await loadHotelDetail();
        } catch (error) {
            console.error("Lỗi xóa ảnh:", error);
            toastError("Không thể xóa hình ảnh này.");
        }
    };
    if (loading) {
        return (
            <div className="flex h-64 w-full items-center justify-center text-slate-500 font-medium">
                Đang tải dữ liệu khách sạn cần sửa...
            </div>
        );
    }

    return (
        <div >
            <HotelForm
                mode="edit"
                initialData={initialData}
                onSave={handleFormSubmit}
                onCancel={() => navigate("/Quan-ly/Khach-san")}
                onStatusChange={handleStatusChange}
                onSetMainImage={handleSetMainImage}
                onRemoveOldImage={handleRemoveOldImage}
            />

            <ConfirmModal
                isOpen={confirmOpen}
                title="Xác nhận cập nhật"
                message={`Bạn có chắc chắn muốn cập nhật các thay đổi cho khách sạn "${initialData?.tenKhachSan}" không?`}
                confirmText="Cập nhật"
                type="warning"
                onCancel={() => {
                    setConfirmOpen(false);
                    setPendingData(null);
                }}
                onConfirm={handleConfirmUpdate}
            />
        </div>
    );
}