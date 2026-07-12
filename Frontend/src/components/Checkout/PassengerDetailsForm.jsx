import React, { useState, useEffect } from "react";
import InputField from "../UI/Form/InputField";
import SelectField from "../UI/Form/SelectField";
import { formatCurrency } from "~/Helper/FormatCurrency";
import { createPortal } from "react-dom";
import DatePicker from "../UI/Form/DatePicker";

export default function PassengerDetailsForm({
    passengers,
    singleRooms,
    onToggleSingleRoom,
    bookingData,
    details,
    setDetails,
    errors = {},
    contact = {},
    activeTab = 'me'
}) {
    const [showModal, setShowModal] = useState(false);
    const [modalErrors, setModalErrors] = useState({});
    const [autoFilled, setAutoFilled] = useState(false);
    const [previousPassengers, setPreviousPassengers] = useState({ adults: 0, children: 0, toddlers: 0 });

    const totalPassengers =
        passengers.adults +
        passengers.children +
        passengers.toddlers;

    const shouldScroll = totalPassengers > 1;
    const isValidAutoFill = (key, passengerData) =>
        key === 'adults-0' &&
        activeTab === 'me' &&
        !!passengerData?.isAutoFilled &&
        !!passengerData?.fullName?.trim() &&
        !!passengerData?.dob;

    const passengerList = [
        ...Array.from(
            { length: passengers.adults || 0 },
            (_, i) => ({
                key: `adults-${i}`,
                label: `Người lớn ${i + 1}`,
                isAdult: true,
                isFirstAdult: i === 0
            })
        ),
        ...Array.from(
            { length: passengers.children || 0 },
            (_, i) => ({
                key: `children-${i}`,
                label: `Trẻ em ${i + 1}`,
                isAdult: false,
                isFirstAdult: false
            })
        ),
        ...Array.from(
            { length: passengers.toddlers || 0 },
            (_, i) => ({
                key: `toddlers-${i}`,
                label: `Trẻ nhỏ ${i + 1}`,
                isAdult: false,
                isFirstAdult: false
            })
        ),
    ];

    useEffect(() => {
        setPreviousPassengers(passengers);
    }, [passengers]);

    useEffect(() => {
        if (activeTab === 'me' && contact.fullName && passengers.adults > 0) {
            const firstAdultKey = `adults-0`;

            if (!details[firstAdultKey] || !details[firstAdultKey].fullName) {
                setDetails(prev => ({
                    ...prev,
                    [firstAdultKey]: {
                        fullName: contact.fullName,
                        phone: contact.phone || "",
                        email: contact.email || "",
                        gender: "Nam",
                        dob: contact.dob || "",
                        isSaved: true,
                        isAutoFilled: true
                    }
                }));
                setAutoFilled(true);
            } else if (details[firstAdultKey]?.isAutoFilled && contact.dob) {
                if (!details[firstAdultKey].dob) {
                    setDetails(prev => ({
                        ...prev,
                        [firstAdultKey]: {
                            ...prev[firstAdultKey],
                            dob: contact.dob
                        }
                    }));
                }
            }
        }

        if (activeTab === 'other') {
            const firstAdultKey = `adults-0`;
            if (details[firstAdultKey]?.isAutoFilled) {
                setDetails(prev => {
                    const newDetails = { ...prev };
                    delete newDetails[firstAdultKey];
                    return newDetails;
                });
                setAutoFilled(false);
            }
        }
    }, [activeTab, contact, passengers.adults, details, setDetails]);

    useEffect(() => {
        const validKeys = new Set(passengerList.map(p => p.key));

        setDetails(prev => {
            const newDetails = {};
            let hasChanges = false;

            Object.keys(prev).forEach(key => {
                if (validKeys.has(key)) {
                    if (key === 'adults-0' && !prev[key]?.fullName && contact.fullName && activeTab === 'me') {
                        newDetails[key] = {
                            fullName: contact.fullName,
                            phone: contact.phone || "",
                            email: contact.email || "",
                            gender: "Nam",
                            dob: contact.dob || "",
                            isSaved: true,
                            isAutoFilled: true
                        };
                        hasChanges = true;
                        setAutoFilled(true);
                    } else {
                        newDetails[key] = prev[key];
                    }
                } else {
                    hasChanges = true;
                }
            });

            if (activeTab === 'me' && passengers.adults > 0 && !newDetails['adults-0']?.fullName && contact.fullName) {
                newDetails['adults-0'] = {
                    fullName: contact.fullName,
                    phone: contact.phone || "",
                    email: contact.email || "",
                    gender: "Nam",
                    dob: contact.dob || "",
                    isSaved: true,
                    isAutoFilled: true
                };
                hasChanges = true;
                setAutoFilled(true);
            }

            return hasChanges ? newDetails : prev;
        });
    }, [passengers, contact, setDetails, activeTab]);

    const handleChangePassenger = (key, field, value) => {
        setDetails((prev) => ({
            ...prev,
            [key]: {
                ...prev[key],
                [field]: value,
                isSaved: true,
                isAutoFilled: key === 'adults-0' && activeTab === 'me' ? false : (prev[key]?.isAutoFilled || false)
            },
        }));

        setModalErrors((prev) => ({
            ...prev,
            [key]: {
                ...prev[key],
                [field]: undefined,
            },
        }));
    };

    const handleSaveAll = () => {
        const errors = {};
        let valid = true;

        passengerList.forEach(({ key }) => {
            const p = details[key] || {};
            errors[key] = {};

            const isFirstAdultAutoFilled = isValidAutoFill(key, p);

            if (!isFirstAdultAutoFilled) {
                if (!p.fullName?.trim()) {
                    errors[key].fullName = "Nhập họ tên";
                    valid = false;
                }

                if (!p.dob) {
                    errors[key].dob = "Chọn ngày sinh";
                    valid = false;
                }

                if (p.phone && !/^0\d{9}$/.test(p.phone)) {
                    errors[key].phone = "SĐT không hợp lệ";
                    valid = false;
                }
            }
        });

        setModalErrors(errors);
        if (!valid) return;

        setDetails((prev) => {
            const updated = { ...prev };
            passengerList.forEach(({ key }) => {
                if (!updated[key]?.gender) {
                    updated[key] = {
                        ...updated[key],
                        gender: "Nam",
                    };
                }
            });
            return updated;
        });

        setShowModal(false);
    };

    const renderPassengerRows = (type, count, label, allowSingleRoom = false) => {
        return Array.from({ length: count }).map((_, index) => {
            const key = `${type}-${index}`;
            const passenger = details[key];
            const isFirstAdultAutoFilled = isValidAutoFill(key, passenger);

            const hasError = !isFirstAdultAutoFilled && errors[key] && Object.values(errors[key]).some(Boolean);
            const isDone = passenger?.fullName && passenger?.dob;
            const isAutoFilled = isFirstAdultAutoFilled && passenger?.fullName;

            return (
                <div key={key} className="mb-3 flex items-center gap-3" data-error={hasError ? "true" : "false"}>
                    <span className="w-8 text-sm text-slate-500">#{index + 1}</span>

                    <div className="flex flex-1 items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setShowModal(true)}
                            className={`flex flex-1 items-center justify-between rounded-2xl border px-5 py-3 hover:bg-slate-50 transition-colors ${hasError ? "border-red-400 bg-red-50" :
                                    "border-slate-300"
                                }`}
                        >
                            <span className="font-medium text-slate-700">
                                {isAutoFilled ? `${passenger?.fullName}` :
                                    passenger?.fullName || `${label} (*)`}
                            </span>

                            <span className={`text-sm font-medium ${hasError ? "text-red-500" :
                                    isAutoFilled ? "text-emerald-500" :
                                        isDone ? "text-emerald-500" :
                                            "text-orange-500"
                                }`}>
                                {hasError ? "Chưa đủ thông tin" :
                                    isAutoFilled ? "Đã nhập" :
                                        isDone ? "Đã nhập" : "Nhập thông tin"}
                            </span>
                        </button>

                        {allowSingleRoom && (
                            <label className="flex items-center gap-2 cursor-pointer">
                                <span className="text-[12px] text-slate-600">Phòng đơn</span>
                                <input
                                    type="checkbox"
                                    checked={!!singleRooms[key]}
                                    onChange={() => onToggleSingleRoom(key)}
                                    className="sr-only"
                                />
                                <div className={`relative h-6 w-11 rounded-full transition-colors duration-300 ${singleRooms[key] ? "bg-sky-500" : "bg-slate-300"}`}>
                                    <div className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-300 ${singleRooms[key] ? "translate-x-5" : ""}`} />
                                </div>
                            </label>
                        )}
                    </div>
                </div>
            );
        });
    };

    return (
        <>
            <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">
                <h2 className="mb-6 text-xl font-bold">Thông tin hành khách</h2>

                {passengers.adults > 0 && (
                    <div className="mb-6">
                        <h3 className="font-semibold text-sky-600">
                            Người lớn
                            <span className="ml-2 text-sm font-normal text-slate-500">
                                (Từ 12 tuổi trở lên)
                            </span>
                        </h3>
                        <p className="mb-3 mt-1 text-xs text-sky-500">Có thể đăng ký phòng đơn đối với người lớn hoặc gia đình cần không gian riêng</p>
                        {renderPassengerRows("adults", passengers.adults, "Người lớn", true)}
                    </div>
                )}

                {passengers.children > 0 && (
                    <div className="mb-6">
                        <h3 className="mb-3 font-semibold text-sky-600">
                            Trẻ em
                            <span className="ml-2 text-sm font-normal text-slate-500">
                                (5 - 11 tuổi)
                            </span>
                        </h3>
                        {renderPassengerRows("children", passengers.children, "Trẻ em")}
                    </div>
                )}

                {passengers.toddlers > 0 && (
                    <div>
                        <h3 className="mb-3 font-semibold text-sky-600">
                            Trẻ nhỏ
                            <span className="ml-2 text-sm font-normal text-slate-500">
                                (2 - 4 tuổi)
                            </span>
                        </h3>
                        {renderPassengerRows("toddlers", passengers.toddlers, "Trẻ nhỏ")}
                    </div>
                )}
            </div>

            {showModal && createPortal(
                <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 p-4">
                    <div
                        className={`flex w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-xl ${shouldScroll ? "h-[90vh]" : "h-auto"
                            }`}
                    >
                        <div className="flex items-center justify-between border-b border-slate-100 bg-white px-8 py-5">
                            <h2 className="text-xl font-bold text-slate-800">
                                Nhập thông tin chi tiết hành khách
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-3xl text-slate-400 hover:text-slate-600"
                            >
                                &times;
                            </button>
                        </div>

                        <div
                            className={`bg-slate-50 p-6 ${shouldScroll ? "flex-1 overflow-y-auto" : ""
                                }`}
                        >
                            <div className="mb-6 rounded-2xl bg-blue-50 p-4 text-sm text-slate-700 border border-blue-100">
                                Phòng đơn dành cho khách hàng từ 12 tuổi trở lên, giá phụ thu phòng đơn là:
                                <span className="ml-2 font-semibold text-sky-600">
                                    {formatCurrency(bookingData?.gia?.phuThuPhongDon)}
                                </span>
                            </div>

                            <div className="space-y-6">
                                {passengerList.map((passenger) => {
                                    const isFirstAdultAutoFilled = isValidAutoFill(passenger.key, details[passenger.key]);

                                    return (
                                        <div
                                            key={passenger.key}
                                            className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
                                        >
                                            <h3 className="mb-4 text-base font-bold text-sky-600 border-b border-slate-100 pb-2">
                                                {passenger.label}
                                                {isFirstAdultAutoFilled && (
                                                    <span className="ml-2 text-sm font-normal text-emerald-500">
                                                        (Tự động từ thông tin tài khoản)
                                                    </span>
                                                )}
                                            </h3>

                                            <div className="flex flex-col gap-4">
                                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                    <InputField
                                                        label="Họ tên"
                                                        required={!isFirstAdultAutoFilled}
                                                        type="text"
                                                        placeholder={isFirstAdultAutoFilled ? "Tự động từ thông tin tài khoản" : "Ví dụ: Nguyễn Văn A"}
                                                        value={details[passenger.key]?.fullName || ""}
                                                        onChange={(e) =>
                                                            handleChangePassenger(passenger.key, "fullName", e.target.value)
                                                        }
                                                        error={modalErrors[passenger.key]?.fullName}
                                                        disabled={isFirstAdultAutoFilled}
                                                    />

                                                    <DatePicker
                                                        label="Ngày sinh"
                                                        required={!isFirstAdultAutoFilled}
                                                        value={details[passenger.key]?.dob || ""}
                                                        onChange={(value) =>
                                                            handleChangePassenger(passenger.key, "dob", value)
                                                        }
                                                        minDate={new Date(1900, 0, 1)}
                                                        maxDate={new Date()}
                                                        error={modalErrors[passenger.key]?.dob}
                                                        disabled={isFirstAdultAutoFilled}
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 items-end">
                                                    <div>
                                                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                                                            Giới tính
                                                        </label>
                                                        <SelectField
                                                            value={details[passenger.key]?.gender || "Nam"}
                                                            onChange={(value) =>
                                                                handleChangePassenger(passenger.key, "gender", value)
                                                            }
                                                            options={[
                                                                { value: "Nam", label: "Nam" },
                                                                { value: "Nữ", label: "Nữ" },
                                                            ]}
                                                            className="w-full h-[46px] rounded-xl bg-white border border-slate-200"
                                                            error={modalErrors[passenger.key]?.gender}
                                                            disabled={isFirstAdultAutoFilled}
                                                        />
                                                    </div>

                                                    <div className="flex gap-4 items-end">
                                                        <div className="flex-1">
                                                            <InputField
                                                                label="Số điện thoại"
                                                                type="text"
                                                                placeholder={isFirstAdultAutoFilled ? "Tự động từ thông tin tài khoản" : "Ví dụ: 0901234567"}
                                                                value={details[passenger.key]?.phone || ""}
                                                                onChange={(e) =>
                                                                    handleChangePassenger(passenger.key, "phone", e.target.value)
                                                                }
                                                                error={modalErrors[passenger.key]?.phone}
                                                                disabled={isFirstAdultAutoFilled}
                                                            />
                                                        </div>

                                                        {passenger.isAdult && (
                                                            <div className="flex flex-col items-center justify-center bg-slate-50 border border-slate-200 rounded-xl px-4 h-[46px] min-w-[110px]">
                                                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                                                                    Phòng đơn
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => onToggleSingleRoom(passenger.key)}
                                                                    className={`relative h-5 w-11 rounded-full transition-colors ${singleRooms[passenger.key] ? "bg-sky-500" : "bg-slate-300"
                                                                        }`}
                                                                >
                                                                    <span
                                                                        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${singleRooms[passenger.key] ? "left-[22px]" : "left-[2px]"
                                                                            }`}
                                                                    />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 border-t border-slate-100 bg-white p-5">
                            <button
                                type="button"
                                onClick={() => {
                                    const newDetails = {};
                                    if (activeTab === 'me' && contact.fullName && passengers.adults > 0) {
                                        newDetails['adults-0'] = {
                                            fullName: contact.fullName,
                                            phone: contact.phone || "",
                                            email: contact.email || "",
                                            gender: "Nam",
                                            dob: contact.dob || "",
                                            isSaved: true,
                                            isAutoFilled: true
                                        };
                                    }
                                    setDetails(newDetails);
                                    setModalErrors({});
                                }}
                                className="h-11 rounded-xl border border-slate-200 px-6 text-sm font-medium text-slate-600 hover:bg-slate-50"
                            >
                                Đặt lại
                            </button>
                            <button
                                type="button"
                                onClick={handleSaveAll}
                                className="h-11 rounded-xl bg-sky-500 px-6 text-sm font-medium text-white hover:bg-sky-600 shadow-sm"
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}