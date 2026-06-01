import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Star,MapPin } from 'lucide-react';
export default function ManagerCard({ item, type, onView, onEdit, onDelete }) {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownStyle, setDropdownStyle] = useState({});
    const buttonRef = useRef(null);
    const dropdownRef = useRef(null);

    const isOnline = item.status === 'open';
    const displayName = item.name || item.title || '';
    const displayLocation = item.province || item.location || '';

    const toggleMenu = useCallback(() => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownStyle({
                top: `${rect.bottom + window.scrollY + 6}px`,
                left: `${rect.left + window.scrollX}px`,
                minWidth: '160px',
                zIndex: 99999,
            });
        }
        setIsOpen(prev => !prev);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            const clickedButton = buttonRef.current?.contains(e.target);
            const clickedDropdown = dropdownRef.current?.contains(e.target);
            if (!clickedButton && !clickedDropdown) {
                setIsOpen(false);
            }
        };
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    return (
        <div className="group bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-blue-400 transition-all duration-300 flex flex-col shadow-sm hover:shadow-md">
            {/* Image Section */}
            <div
                className={`relative overflow-hidden ${item.status !== 'open' ? 'grayscale' : ''}`}
                style={{ height: '120px' }}
            >
                <img
                    src={item.image}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    alt={displayName}
                />

                {/* Status Badge
                <div className="absolute top-2 left-2">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase shadow-sm 
                        ${isOnline ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-white'}`}>
                        {isOnline ? 'Online' : item.status === 'maintenance' ? 'Bảo trì' : 'Paused'}
                    </span>
                </div>

                {/* Right Top Info 
                <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-400 shadow-md">
                    <Star size={12} className="text-white fill-white" />
                    <span className="text-xs font-bold text-white">
                        {item.rating}
                    </span>
                </div> */}

                {/* Bottom Info */}
                <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5 bg-gradient-to-t from-black/70 to-transparent">
                    <div className="flex justify-between items-center text-white text-[10px]">
                        <span className="font-bold flex items-center gap-0.5">
                            {/* <span className="material-symbols-outlined text-xs">location_on</span> */}
                            <MapPin size={15} />
                            {displayLocation}
                        </span>
                        {(type === 'location' || type === 'hotel') && item.category && (
                            <span className="bg-white/20 px-2 py-0.5 text-[10px] rounded font-light">{item.category}</span>
                        )}
                        {type === 'tour' && item.duration && (
                            <span className="bg-white/20 px-2 py-0.5 text-[10px] rounded font-light">{item.duration}</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-3 flex flex-col flex-1">
                <h3 className="text-[13px] font-bold text-slate-800 mb-2 line-clamp-2 min-h-[34px]">
                    {displayName}
                </h3>

                <div className="mt-auto pt-2 border-t border-slate-100 flex justify-between items-center">

                    <div className="flex -space-x-1.5">
                    </div>

                    <button
                        ref={buttonRef}
                        onClick={toggleMenu}
                        className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white
                                   px-2.5 py-1 rounded-lg transition-all duration-200 active:scale-95 shadow-sm"
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>settings</span>
                        <span className="text-[11px] font-light">Thao tác</span>
                        <span className={`material-symbols-outlined transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                            style={{ fontSize: '14px' }}>
                            arrow_drop_down
                        </span>
                    </button>
                </div>
            </div>

            {/* Dropdown Portal */}
            {isOpen && createPortal(
                <div
                    ref={dropdownRef}
                    className="fixed bg-white rounded-xl shadow-2xl border border-gray-100 py-1.5 overflow-hidden"
                    style={dropdownStyle}
                >
                    <button onClick={() => { onView?.(item); setIsOpen(false); }}
                        className="w-full px-4 py-2 flex items-center gap-2.5 hover:bg-slate-50 transition-colors">
                        <span className="material-symbols-outlined text-blue-600" style={{ fontSize: '15px' }}>visibility</span>
                        <span className="text-[12px] font-medium text-gray-700">Xem chi tiết</span>
                    </button>
                    <button onClick={() => { onEdit?.(item); setIsOpen(false); }}
                        className="w-full px-4 py-2 flex items-center gap-2.5 hover:bg-slate-50 transition-colors">
                        <span className="material-symbols-outlined text-amber-500" style={{ fontSize: '15px' }}>edit_square</span>
                        <span className="text-[12px] font-medium text-gray-700">Cập nhật</span>
                    </button>
                    <div className="h-px bg-gray-100 mx-3 my-1" />
                    <button onClick={() => { onDelete?.(item); setIsOpen(false); }}
                        className="w-full px-4 py-2 flex items-center gap-2.5 hover:bg-red-50 transition-colors">
                        <span className="material-symbols-outlined text-red-500" style={{ fontSize: '15px' }}>delete</span>
                        <span className="text-[12px] font-medium text-red-600">Xóa</span>
                    </button>
                </div>,
                document.body
            )}
        </div>
    );
}