import React, { useState } from "react";
import InputField from "../UI/Form/InputField";
import Dropdown from "../Common/Dropdown";
import SelectField from "../UI/Form/SelectField";
import { formatCurrency } from "~/Helper/FormatCurrency";
export default function PassengerDetailsForm({
    passengers,
    singleRooms,
    onToggleSingleRoom,
    bookingData,
    details,
    setDetails
}) {
    const [editingPassenger, setEditingPassenger] = useState(null);

    const [showModal, setShowModal] = useState(false);


    const openEditForm = (type, index) => {
        const key = `${type}-${index}`;

        setEditingPassenger({ type, index });

        setTempForm(
            details[key] || {
                fullName: "",
                dob: "",
                phone: "",
            }
        );
    };

    const passengerList = [
        ...Array.from(
            { length: passengers.adults },
            (_, i) => ({
                key: `adults-${i}`,
                label: `Người lớn ${i + 1}`,
            })
        ),

        ...Array.from(
            { length: passengers.children },
            (_, i) => ({
                key: `children-${i}`,
                label: `Trẻ em ${i + 1}`,
            })
        ),

        ...Array.from(
            { length: passengers.toddlers },
            (_, i) => ({
                key: `toddlers-${i}`,
                label: `Trẻ nhỏ ${i + 1}`,
            })
        ),
    ];
    const handleChangePassenger = (
        key,
        field,
        value
    ) => {
        setDetails((prev) => ({
            ...prev,
            [key]: {
                ...prev[key],
                [field]: value,
            },
        }));
    };
    // const formatCurrency = (value) =>
    //     new Intl.NumberFormat("vi-VN", {
    //         style: "currency",
    //         currency: "VND",
    //         maximumFractionDigits: 0,
    //     }).format(value || 0);
    const handleSave = (e) => {
        e.preventDefault();

        if (!editingPassenger) return;

        const key = `${editingPassenger.type}-${editingPassenger.index}`;

        setDetails((prev) => ({
            ...prev,
            [key]: {
                ...tempForm,
                isSaved: true,
            },
        }));

        setEditingPassenger(null);
    };
    const handleSaveAll = () => {
        setShowModal(false);
    };

    const renderPassengerRows = (
        type,
        count,
        label,
        allowSingleRoom = false
    ) => {
        return Array.from({ length: count }).map((_, index) => {
            const key = `${type}-${index}`;
            const passenger = details[key];

            return (
                <div
                    key={key}
                    className="mb-3 flex items-center gap-3"
                >
                    <span className="w-8 text-sm text-slate-500">
                        #{index + 1}
                    </span>

                    <div className="flex flex-1 items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setShowModal(true)}
                            className="flex flex-1 items-center justify-between rounded-2xl border border-slate-300 px-5 py-3 hover:bg-slate-50"
                        >
                            <span className="font-medium text-slate-700">
                                {passenger?.fullName ||
                                    `${label} (*)`}
                            </span>

                            <span
                                className={`text-sm font-medium ${passenger?.isSaved
                                    ? "text-emerald-500"
                                    : "text-orange-500"
                                    }`}
                            >
                                {passenger?.fullName
                                    ? "Đã nhập"
                                    : "Nhập thông tin"}
                            </span>
                        </button>

                        {allowSingleRoom && (
                            <div className="flex items-center gap-2">
                                <span className="text-[12px] text-slate-600">
                                    Phòng đơn
                                </span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        onToggleSingleRoom(key)
                                    }
                                    className={`relative h-6 w-11 rounded-full transition ${singleRooms[key]
                                        ? "bg-sky-500"
                                        : "bg-slate-300"
                                        }`}
                                >
                                    <span
                                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${singleRooms[key]
                                            ? "left-[19px]"
                                            : "left-[2px]"
                                            }`}
                                    />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            );
        });
    };

    return (
        <>
            <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">
                <h2 className="mb-6 text-xl font-bold">
                    Thông tin hành khách
                </h2>

                {/* Người lớn */}
                {passengers.adults > 0 && (
                    <div className="mb-6">
                        <h3 className="font-semibold text-sky-600">
                            Người lớn
                            <span className="ml-2 text-sm font-normal text-slate-500">
                                (Từ 12 tuổi trở lên)
                            </span>
                        </h3>

                        <p className="mb-3 mt-1 text-xs text-sky-500">
                            Có thể đăng ký phòng đơn
                        </p>

                        {renderPassengerRows(
                            "adults",
                            passengers.adults,
                            "Người lớn",
                            true
                        )}
                    </div>
                )}

                {/* Trẻ em */}
                {passengers.children > 0 && (
                    <div className="mb-6">
                        <h3 className="mb-3 font-semibold text-sky-600">
                            Trẻ em
                            <span className="ml-2 text-sm font-normal text-slate-500">
                                (5 - 11 tuổi)
                            </span>
                        </h3>

                        {renderPassengerRows(
                            "children",
                            passengers.children,
                            "Trẻ em"
                        )}
                    </div>
                )}

                {/* Trẻ nhỏ */}
                {passengers.toddlers > 0 && (
                    <div>
                        <h3 className="mb-3 font-semibold text-sky-600">
                            Trẻ nhỏ
                            <span className="ml-2 text-sm font-normal text-slate-500">
                                (2 - 4 tuổi)
                            </span>
                        </h3>

                        {renderPassengerRows(
                            "toddlers",
                            passengers.toddlers,
                            "Trẻ nhỏ"
                        )}
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed
                                top-0
                                left-0
                                right-0
                                bottom-0
                                z-[9999]
                                flex
                                items-center
                                justify-center
                                mb-0
                                bg-black/40"
                >

                    <div className="flex h-screen items-start justify-center mt-38">

                        <div className="flex h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white">

                            {/* HEADER */}
                            <div className="flex items-center justify-between  bg-white px-8 py-6">
                                <h2 className="text-2xl font-bold text-slate-800">
                                    Thông tin hành khách
                                </h2>

                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-4xl text-slate-500 hover:text-slate-700"
                                >
                                    ×
                                </button>
                            </div>

                            {/* CONTENT */}
                            <div className="flex-1 overflow-y-auto p-6">

                                {/* THÔNG BÁO */}
                                <div className="mb-6 rounded-4xl bg-blue-100 p-5 text-lg text-slate-700">
                                    Phòng đơn dành cho khách hàng từ 12 tuổi trở lên,
                                    giá phòng đơn là:
                                    <span className="ml-2 font-semibold text-sky-600">

                                        {formatCurrency(bookingData?.gia?.phuThuPhongDon)}
                                    </span>
                                </div>

                                {/* DANH SÁCH HÀNH KHÁCH */}
                                <div className="space-y-6">

                                    {passengerList.map((passenger, index) => (
                                        <div
                                            key={passenger.key}
                                            className="rounded-[20px] bg-white p-6 shadow-sm"
                                        >
                                            <h3 className="mb-5 text-[15px] font-bold text-sky-500">
                                                {passenger.label}
                                            </h3>

                                            {/* STT + HỌ TÊN */}
                                            <div className="mb-5 flex gap-5">


                                                <div className="flex-1">

                                                    <label className="mb-2 block text-[13px] font-medium">
                                                        Họ tên
                                                        <span className="text-red-500">
                                                            {" "}(*)
                                                        </span>
                                                    </label>

                                                    <InputField
                                                        type="text"
                                                        placeholder="Ví dụ: Nguyễn Văn A"
                                                        value={
                                                            details[passenger.key]?.fullName || ""
                                                        }
                                                        onChange={(e) =>
                                                            handleChangePassenger(
                                                                passenger.key,
                                                                "fullName",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="
                                                h-16
                                                w-full
                                                rounded-full
                                                bg-slate-100
                                                px-6
                                                text-lg
                                                outline-none
                                            "
                                                    />
                                                </div>
                                            </div>

                                            {/* DOB + GENDER */}
                                            <div className="mb-5 grid grid-cols-2 gap-6">

                                                <div>
                                                    <label className="mb-2 block text-[13px] font-medium">
                                                        Ngày sinh
                                                        <span className="text-red-500">
                                                            {" "}(*)
                                                        </span>
                                                    </label>

                                                    <InputField
                                                        type="date"
                                                        value={
                                                            details[passenger.key]?.dob || ""
                                                        }
                                                        onChange={(e) =>
                                                            handleChangePassenger(
                                                                passenger.key,
                                                                "dob",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="
                                                    h-16
                                                    w-full
                                                    rounded-full
                                                    bg-slate-100
                                                    px-6
                                                    text-lg
                                                    outline-none
                                                "
                                                    />
                                                </div>

                                                <div>
                                                    <label className="mb-2 block text-[13px] font-medium">Giới tính</label>
                                                    <SelectField

                                                        value={details[passenger.key]?.gender || "Nam"}
                                                        onChange={(value) =>
                                                            handleChangePassenger(
                                                                passenger.key,
                                                                "gender",
                                                                value
                                                            )
                                                        }
                                                        options={[
                                                            {
                                                                value: "Nam",
                                                                label: "Nam",
                                                            },
                                                            {
                                                                value: "Nữ",
                                                                label: "Nữ",
                                                            },
                                                        ]}
                                                        className="
                                                                    h-16
                                                                    rounded-full
                                                                    bg-slate-100
                                                                    border-0
                                                                    shadow-none
                                                                "
                                                    />
                                                </div>

                                            </div>

                                            {/* PHONE + SINGLE ROOM */}
                                            <div className="flex items-end gap-6">

                                                <div className="flex-1">
                                                    <label className="mb-2 block text-[13px] font-medium">
                                                        Số điện thoại
                                                    </label>

                                                    <InputField
                                                        type="text"
                                                        placeholder="Ví dụ: 0901234567"
                                                        value={
                                                            details[passenger.key]?.phone || ""
                                                        }
                                                        onChange={(e) =>
                                                            handleChangePassenger(
                                                                passenger.key,
                                                                "phone",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="
                                                                    h-16
                                                                    rounded-full
                                                                    bg-slate-100
                                                                    px-6
                                                                    text-lg
                                                                    border-0
                                                                    shadow-none
                                                                "
                                                    />
                                                </div>

                                                {passenger.key.includes("adults") && (
                                                    <div className="mb-2 flex flex-col items-center">

                                                        <span className="mb-2 text-lg">
                                                            Phòng đơn
                                                        </span>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                onToggleSingleRoom(
                                                                    passenger.key
                                                                )
                                                            }
                                                            className={`
                                                    relative
                                                    h-8
                                                    w-14
                                                    rounded-full
                                                    transition
                                                    ${singleRooms[passenger.key]
                                                                    ? "bg-sky-500"
                                                                    : "bg-slate-300"}
                                                `}
                                                        >
                                                            <span
                                                                className={`
                                                        absolute
                                                        top-1
                                                        h-6
                                                        w-6
                                                        rounded-full
                                                        bg-white
                                                        transition
                                                        ${singleRooms[passenger.key]
                                                                        ? "left-7"
                                                                        : "left-1"}
                                                    `}
                                                            />
                                                        </button>

                                                    </div>
                                                )}

                                            </div>

                                        </div>
                                    ))}

                                </div>
                            </div>

                            {/* FOOTER */}
                            <div className="flex justify-end gap-5 bg-white p-6">

                                <button
                                    type="button"
                                    className="
                                        h-14
                                        w-35
                                        rounded-full
                                        border

                                        text-[13px]
                                        font-medium
                                    "
                                >
                                    Đặt lại
                                </button>

                                <button
                                    type="button"
                                    onClick={handleSaveAll}
                                    className="
                                        h-14
                                        w-35
                                        rounded-full
                                        bg-sky-500
                                        text-[13px]
                                        font-medium
                                        text-white
                                    "
                                >
                                    Xác nhận
                                </button>

                            </div>

                        </div>

                    </div>

                </div>
            )}
        </>
    );
}