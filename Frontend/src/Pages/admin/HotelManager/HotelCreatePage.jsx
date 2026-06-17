import HotelForm from '~/Pages/admin/HotelManager/HotelFormPage';
import { createHotelApi } from '~/Services/HotelService';
import { toastError,toastSuccess } from '~/utils/Toast';
import { getErrorMessage } from '~/utils/errorHelper';
import { useNavigate } from 'react-router-dom';

export default function HotelCreatePage() {
    const navigate = useNavigate();

    const handleSave = async (data) => {
        try {
            const formData = new FormData();
            formData.append("TenKhachSan", data.tenKhachSan.trim());
            formData.append("SoSao", data.soSao);
            formData.append("DiaChi", data.diaChi.trim());
            formData.append("SoDienThoai", data.soDienThoai.trim());
            formData.append("MoTa", data.moTa?.trim() || "");
            formData.append("TrangThai", data.trangThai)
            if (data.maTienNghi && data.maTienNghi.length > 0) {
                data.maTienNghi.forEach(id => {
                    formData.append("MaTienNghi", id);
                });
            }
            const sortedImages = [...data.images].sort((a, b) => (b.anhChinh ? 1 : 0) - (a.anhChinh ? 1 : 0));

            if (sortedImages.length === 0) {
                toastError("Vui lòng thêm ít nhất 1 hình ảnh!");
                return;
            }
            sortedImages.forEach(img => {
                if (img.file) {
                    formData.append("images", img.file);
                }
            });
            await createHotelApi(formData);
            toastSuccess("Thêm khách sạn thành công");
            navigate("/Quan-ly/Khach-san");

        } catch (error) {
            toastError(getErrorMessage(error))
        }
    };

    return (
        <div className="p-2 max-w-[1440px]">
            <HotelForm
                mode="add"
                onSave={handleSave}
                onCancel={() => navigate("/Quan-ly/Khach-san")}
            />
        </div>
    );
}