import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Star, MapPin, Earth, Tag, Phone, Clock3, Users } from 'lucide-react';

export default function ManagerCard({
    item,
    type,
    onView,
    onEdit,
    onDelete,
    onChangeStatus
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownStyle, setDropdownStyle] = useState({});
    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => {
            const filled = i < rating;

            return (
                <Star
                    key={i}
                    size={12}
                    className={
                        filled
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                    }
                    stroke="none"
                />
            );
        });
    };
    const buttonRef = useRef(null);
    const dropdownRef = useRef(null);
    const url = "https://localhost:7016"
    let displayName = '';
    let displayLocation = '';
    let imageUrl = '';
    let subInfo1 = '';
    let subInfo2 = '';
    let statusText = '';
    let statusClass = '';

    const isOnline =
        type === "tour"
            ? item.trangThai === 1
            : item.trangThai;
    if (type === 'location') {
        displayName = item.tenDiaDiem;
        displayLocation = item.tinhThanh;
        imageUrl = item.duongDanAnh;

        subInfo1 = item.tenLoai || item.loaiDiaDiem;
        statusText = isOnline
            ? 'Đang khai thác'
            : 'Ngưng khai thác';
    }

    if (type === 'hotel') {
        displayName = item.tenKhachSan;
        displayLocation = item.diaChi;
        const mainImage =
            item.hinhAnh?.find(img => img.anhChinh);

        imageUrl =
            mainImage?.duongDanAnh ||
            item.hinhAnh?.[0]?.duongDanAnh ||
            item.anhDaiDien ||
            '';

        subInfo1 = `${item.soSao} sao`;
        subInfo2 = item.soDienThoai;

        statusText = isOnline
            ? 'Đang Hợp tác'
            : 'Ngưng hợp tác';
    }
    if (type === "tour") {
        const mainImage =
            item.images?.find(img => img.anhChinh);

        imageUrl =
            mainImage?.duongDanAnh ||
            item.images?.[0]?.duongDanAnh ||
            "";

        displayName = item.tenTour;
        displayLocation = "";

        subInfo1 = item.trongNuoc
            ? "Trong nước"
            : "Nước ngoài";

        subInfo2 = `${item.ngay} ngày ${item.dem} đếm`;

        statusText =
            item.trangThai === 1
                ? "Mở bán"
                : item.trangThai === 2
                    ? "Tạm ngưng"
                    : "Ngừng kinh doanh";
    }
    if (type === "tour") {
        statusClass =
            item.trangThai === 1
                ? "bg-emerald-500/70 text-white"
                : item.trangThai === 2
                    ? "bg-yellow-500/70 text-white"
                    : "bg-red-500/70 text-white";
    }
    else {
        statusClass = isOnline
            ? "bg-emerald-500/70 text-white"
            : "bg-slate-700 text-white";
    }
    const toggleMenu = useCallback(() => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();

            setDropdownStyle({
                top: `${rect.bottom + window.scrollY + 6}px`,
                left: `${rect.left + window.scrollX}px`,
                zIndex: 99999
            });
        }

        setIsOpen(prev => !prev);
    }, []);

    useEffect(() => {
        const handleClickOutside = e => {
            const clickedButton =
                buttonRef.current?.contains(e.target);

            const clickedDropdown =
                dropdownRef.current?.contains(e.target);

            if (!clickedButton && !clickedDropdown) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener(
                'mousedown',
                handleClickOutside
            );
        }

        return () => {
            document.removeEventListener(
                'mousedown',
                handleClickOutside
            );
        };
    }, [isOpen]);

    return (
        <div className="group bg-white rounded-xl mt-[5px] mb-[0px] overflow-hidden border border-slate-200 hover:border-blue-400 transition-all duration-300 flex flex-col shadow-sm hover:shadow-md">

            {/* IMAGE */}
            <div
                className={`relative overflow-hidden ${!isOnline ? 'grayscale' : ''
                    }`}
                style={{ height: '110px' }}
            >
                <img
                    src={
                        imageUrl
                            ? `${url}${imageUrl}`
                            : '/images/no-image.jpg'
                    }
                    alt={displayName}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 "
                    loading="lazy"
                    decoding="async"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300"></div>

                {/* STATUS */}
                <div className="absolute top-0 left-2">
                    <span
                        className={`px-2 py-1 rounded-md text-[8px] font-bold uppercase shadow-sm ${statusClass}`}
                    >
                        {statusText}
                    </span>
                </div>

                {(type === 'location' || type === 'hotel') && (
                    <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5 bg-gradient-to-t from-black/60 to-transparent">
                        <div className="flex justify-between items-center text-white text-[10px]">
                            <span className="font-bold flex items-center gap-1">
                                <MapPin size={14} />
                                {displayLocation}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* CONTENT */}
            <div className="p-3 flex flex-col flex-1">
                <div>
                    <h3 className="text-[13px] font-bold text-slate-800 line-clamp-2 min-h-[15px]">
                        {displayName}
                    </h3>

                    {/* LOCATION */}
                    {type === 'location' && (
                        <>
                            <p className="flex items-center gap-1 text-[10px] font-bold text-slate-600 min-h-[15px]">
                                <Tag size={10} />
                                {subInfo1}
                            </p>

                        </>
                    )}

                    {/* HOTEL */}
                    {type === 'hotel' && (
                        <>
                            <p className="flex items-center gap-1 text-[11px] font-bold text-slate-500 min-h-[15px]">
                                <Phone size={10} className="text-blue-500 stroke-0 fill-blue-500" />
                                {subInfo2}
                            </p>
                            <p className="flex items-center text-[11px] gap-x-1 mt-1 mb-1 leading-none">
                                {renderStars(item.soSao)}
                            </p>


                        </>
                    )}
                    {type === 'tour' && (
                        <>
                            <p className="flex items-center gap-1 text-[10px] font-bold text-slate-600">
                                <Earth size={10} />
                                Phân vùng tour: {subInfo1}
                            </p>

                            <p className="flex items-center gap-1 text-[10px] font-bold text-slate-600">
                                <Clock3 size={10} />
                                Thời gian: {subInfo2}
                            </p>
                        </>
                    )}
                    <div className="mt-auto pt-2 border-t border-slate-100 flex justify-end items-center">
                        <button
                            ref={buttonRef}
                            onClick={toggleMenu}
                            className="flex items-center gap-1 bg-[#0EA5E5] hover:bg-sky-600 text-white
                                   px-2.5 py-1.5 rounded-lg transition-all duration-200 active:scale-95 shadow-sm"
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>settings</span>
                            <span className="text-[11px] font-light">Thao tác</span>
                            <span className={`material-symbols-outlined transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                                style={{ fontSize: '16px' }}>
                                arrow_drop_down
                            </span>
                        </button>
                    </div>
                </div>
                {isOpen && createPortal(
                    <div
                        ref={dropdownRef}
                        className="fixed bg-white rounded-xl shadow-2xl border border-gray-100 py-1.5 overflow-hidden"
                        style={dropdownStyle}
                    >

                        <button onClick={() => { onView?.(item); setIsOpen(false); }}
                            className="w-full px-4 py-2 flex items-center gap-2.5 hover:bg-slate-50 transition-colors">
                            <span className="material-symbols-outlined text-blue-600" style={{ fontSize: '15px' }}>visibility</span>
                            <span className="text-[10px] font-medium text-gray-700">Xem</span>
                        </button>
                        <button onClick={() => { onEdit?.(item); setIsOpen(false); }}
                            className="w-full px-4 py-2 flex items-center gap-2.5 hover:bg-slate-50 transition-colors">
                            <span className="material-symbols-outlined text-amber-500" style={{ fontSize: '15px' }}>edit_square</span>
                            <span className="text-[10px] font-medium text-gray-700">Cập nhật</span>
                        </button>
                        {type === "tour" &&
                            onChangeStatus &&
                            item.trangThai !== 3 && (
                                <>
                                    <div className="h-px bg-gray-100 mx-3 my-1" />

                                    <button
                                        onClick={() => {
                                            onChangeStatus?.(item);
                                            setIsOpen(false);
                                        }}
                                        className="w-full px-4 py-2 flex items-center gap-2.5 hover:bg-yellow-50 transition-colors"
                                    >
                                        <span
                                            className="material-symbols-outlined text-yellow-500"
                                            style={{ fontSize: '15px' }}
                                        >
                                            sync
                                        </span>

                                        <span className="text-[10px] font-medium text-yellow-700">
                                            {
                                                item.trangThai === 1
                                                    ? "Tạm ngưng"
                                                    : item.trangThai === 2
                                                        ? "Mở bán"
                                                        : "Ngừng kinh doanh"
                                            }
                                        </span>
                                    </button>
                                </>
                            )}

                        {onDelete && (
                            <div>
                                <div className="h-px bg-gray-100 mx-3 my-1" />
                                <button
                                    onClick={() => {
                                        onDelete?.(item);
                                        setIsOpen(false);
                                    }}
                                    className="w-full px-4 py-2 flex items-center gap-2.5 hover:bg-red-50 transition-colors"
                                >
                                    <span
                                        className="material-symbols-outlined text-red-500"
                                        style={{ fontSize: '15px' }}
                                    >
                                        delete
                                    </span>
                                    <span className="text-[10px] font-medium text-red-600">
                                        Xóa
                                    </span>
                                </button>
                            </div>
                        )}

                    </div>,
                    document.body
                )}

            </div>
        </div>
    );
}