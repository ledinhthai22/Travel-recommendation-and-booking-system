import { Plus, Trash2, CalendarDays, Ticket } from "lucide-react";
import InputField from "~/components/UI/Form/InputField";
import SelectField from "~/components/UI/Form/SelectField";
export default function TourScheduleSection({
    value = [],
    onChange
}) {
    // Hàm tiện ích để lấy value chuẩn từ Event hoặc String (Đồng bộ với TourFormPage)
    const getVal = (e) => e?.target?.value ?? e;

    const handleAdd = () => {
        const newItem = {
            id: Date.now(),

            maHDV: "",
            maPhuongTien: "",

            maChuyenCode: "",
            tenChuyen: "",

            diemKhoiHanh: "",
            diemDen: "",

            ngayKhoiHanh: "",
            gioDenNoiDi: "",

            ngayKetThuc: "",
            gioDenNoiVe: "",

            soLuongCho: "",

            ghiChu: "",

            gia: {
                hangKhachSan: "",
                giaNguoiLon: "",
                giaTreEm: "",
                giaEmBe: "",
                phuThuPhongDon: ""
            }
        }

        onChange([...value, newItem]);
    };
    const huongDanViens = [
        {
            maHDV: 1,
            tenHDV: "Nguyễn Văn A"
        },
        {
            maHDV: 2,
            tenHDV: "Trần Văn B"
        }
    ];
    const phuongTiens = [
        {
            maPhuongTien: 1,
            tenPhuongTien: "Máy bay"
        },
        {
            maPhuongTien: 2,
            tenPhuongTien: "Xe khách"
        }
    ];
    const handleGiaChange = (chuyenId, field, value) => {
        onChange(
            value.map(ch =>
                ch.id === chuyenId
                    ? {
                        ...ch,
                        gia: {
                            ...ch.gia,
                            [field]: value
                        }
                    }
                    : ch
            )
        );
    };
    const handleRemove = (id) => {
        onChange(value.filter(x => x.id !== id));
    };

    const handleChange = (id, field, val) => {
        onChange(
            value.map(x =>
                x.id === id ? { ...x, [field]: val } : x
            )
        );
    };

    const handleAddPrice = (chuyenId) => {
        onChange(
            value.map(x =>
                x.id === chuyenId
                    ? {
                        ...x,
                        gia: [
                            ...(x.gia || []),
                            {
                                id: Date.now(),
                                hangKhachSan: "",
                                giaNguoiLon: "",
                                giaTreEm: "",
                                giaEmBe: "",
                                phuThuPhongDon: ""
                            }
                        ]
                    }
                    : x
            )
        );
    };

    const handlePriceChange = (chuyenId, priceId, field, val) => {
        onChange(
            value.map(x =>
                x.id === chuyenId
                    ? {
                        ...x,
                        gia: x.gia.map(p =>
                            p.id === priceId ? { ...p, [field]: val } : p
                        )
                    }
                    : x
            )
        );
    };

    const handleRemovePrice = (chuyenId, priceId) => {
        onChange(
            value.map(x =>
                x.id === chuyenId
                    ? {
                        ...x,
                        gia: x.gia.filter(p => p.id !== priceId)
                    }
                    : x
            )
        );
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* DYNAMIC STICKY HEADER SECTION */}
            <div
                className={`
                    flex justify-between items-end border-b border-slate-200 transition-all duration-300
                    ${value.length >= 2
                        ? "sticky -top-6 z-30 bg-slate-50/95 backdrop-blur-md pt-[12px] pb-4 -mx-6 px-6 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)]"
                        : "pb-4"
                    }
                `}
            >
                <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <CalendarDays className="text-sky-500" size={24} />
                        Quản lý Chuyến khởi hành
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                        Thêm và cấu hình lịch trình, giá vé cho từng chuyến đi cụ thể.
                    </p>
                </div>

                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-medium rounded-xl transition-colors shadow-sm"
                >
                    <Plus size={18} />
                    <span>Thêm chuyến mới</span>
                </button>
            </div>

            {/* EMPTY STATE */}
            {value.length === 0 && (
                <div className="text-center py-12 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl">
                    <p className="text-slate-500 mb-4">Chưa có chuyến khởi hành nào được thêm.</p>
                    <button
                        onClick={handleAdd}
                        className="text-sky-500 font-medium hover:text-sky-600 transition"
                    >
                        + Tạo chuyến đầu tiên
                    </button>
                </div>
            )}

            {/* LIST CHUYẾN KHỞI HÀNH */}
            <div className="space-y-6">
                {value.map((ch, index) => (
                    <div
                        key={ch.id}
                        className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-sm"
                    >
                        {/* HEADER ITEM */}
                        <div className="flex justify-between items-center bg-slate-50 px-6 py-4 border-b border-slate-200">
                            <span className="font-bold text-slate-700 uppercase tracking-wide text-sm">
                                Chuyến #{index + 1}
                            </span>

                            <button
                                onClick={() => handleRemove(ch.id)}
                                className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                <Trash2 size={16} />
                                <span className="font-medium">Xóa chuyến</span>
                            </button>
                        </div>

                        {/* FIELDS */}
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">

                                <InputField
                                    label="Mã chuyến"
                                    value={ch.maChuyenCode}
                                    onChange={(e) =>
                                        handleChange(ch.id, "maChuyenCode", getVal(e))
                                    }
                                />

                                <InputField
                                    label="Tên chuyến"
                                    value={ch.tenChuyen}
                                    onChange={(e) =>
                                        handleChange(ch.id, "tenChuyen", getVal(e))
                                    }
                                />
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Hướng dẫn viên</label>
                                    <SelectField
                                        value={ch.maHDV}
                                        options={huongDanViens}
                                        valueKey="maHDV"
                                        labelKey="tenHDV"
                                        onChange={(e) =>
                                            handleChange(ch.id, "maHDV", getVal(e))
                                        }
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Phương tiện</label>
                                    <SelectField

                                        value={ch.maPhuongTien}
                                        options={phuongTiens}
                                        valueKey="maPhuongTien"
                                        labelKey="tenPhuongTien"
                                        onChange={(e) =>
                                            handleChange(ch.id, "maPhuongTien", getVal(e))
                                        }
                                    />
                                </div>


                                <InputField
                                    label="Điểm khởi hành"
                                    value={ch.diemKhoiHanh}
                                    onChange={(e) =>
                                        handleChange(ch.id, "diemKhoiHanh", getVal(e))
                                    }
                                />

                                <InputField
                                    label="Điểm đến"
                                    value={ch.diemDen}
                                    onChange={(e) =>
                                        handleChange(ch.id, "diemDen", getVal(e))
                                    }
                                />

                                <InputField
                                    type="datetime-local"
                                    label="Ngày khởi hành"
                                    value={ch.ngayKhoiHanh}
                                    onChange={(e) =>
                                        handleChange(ch.id, "ngayKhoiHanh", getVal(e))
                                    }
                                />

                                <InputField
                                    type="datetime-local"
                                    label="Giờ đến nơi đi"
                                    value={ch.gioDenNoiDi}
                                    onChange={(e) =>
                                        handleChange(ch.id, "gioDenNoiDi", getVal(e))
                                    }
                                />

                                <InputField
                                    type="datetime-local"
                                    label="Ngày kết thúc"
                                    value={ch.ngayKetThuc}
                                    onChange={(e) =>
                                        handleChange(ch.id, "ngayKetThuc", getVal(e))
                                    }
                                />

                                <InputField
                                    type="datetime-local"
                                    label="Giờ đến nơi về"
                                    value={ch.gioDenNoiVe}
                                    onChange={(e) =>
                                        handleChange(ch.id, "gioDenNoiVe", getVal(e))
                                    }
                                />

                                <InputField
                                    type="number"
                                    label="Số lượng chỗ"
                                    value={ch.soLuongCho}
                                    onChange={(e) =>
                                        handleChange(ch.id, "soLuongCho", getVal(e))
                                    }
                                />
                            </div>

                            <InputField
                                multiline
                                rows={3}
                                label="Ghi chú"
                                value={ch.ghiChu}
                                onChange={(e) =>
                                    handleChange(ch.id, "ghiChu", getVal(e))
                                }
                            />

                            <div className="grid grid-cols-5 gap-4">
                                <InputField
                                    label="Hạng khách sạn"
                                    value={ch.gia?.hangKhachSan || ""}
                                    onChange={(e) =>
                                        handleGiaChange(
                                            ch.id,
                                            "hangKhachSan",
                                            getVal(e)
                                        )
                                    }
                                />

                                <InputField
                                    label="Giá người lớn"
                                    type="number"
                                    value={ch.gia?.giaNguoiLon || ""}
                                    onChange={(e) =>
                                        handleGiaChange(
                                            ch.id,
                                            "giaNguoiLon",
                                            getVal(e)
                                        )
                                    }
                                />
                                <InputField
                                    label="Giá trẻ em"
                                    type="number"
                                    value={ch.gia?.giaTreEm || ""}
                                    onChange={(e) =>
                                        handleGiaChange(
                                            ch.id,
                                            "giaTreEm",
                                            getVal(e)
                                        )
                                    }
                                />

                                <InputField
                                    label="Giá em bé"
                                    type="number"
                                    value={ch.gia?.giaEmBe || ""}
                                    onChange={(e) =>
                                        handleGiaChange(
                                            ch.id,
                                            "giaEmBe",
                                            getVal(e)
                                        )
                                    }
                                />

                                <InputField
                                    label="Phụ thu phòng đơn"
                                    type="number"
                                    value={ch.gia?.phuThuPhongDon || ""}
                                    onChange={(e) =>
                                        handleGiaChange(
                                            ch.id,
                                            "phuThuPhongDon",
                                            getVal(e)
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}