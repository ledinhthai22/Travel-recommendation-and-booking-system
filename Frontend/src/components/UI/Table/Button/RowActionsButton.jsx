import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Trash, Eye,Lock } from 'lucide-react';
export default function RowActionsButton({
    row,
    onView,
    onEdit,
    onDelete,
    onLock,
    onUnlock,
    onApproval,
    onReject,
    showView = true,
    showEdit = true,
    showDelete = true,
    showLock = true,
    showUnlock = true,
    showApproval = true,
    showReject = true
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownStyle, setDropdownStyle] = useState({});
    const buttonRef = useRef(null);

    const toggleMenu = useCallback(() => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();

            setDropdownStyle({
                top: `${rect.bottom + window.scrollY + 8}px`,
                left: `${rect.left + window.scrollX}px`,
                width: `${rect.width}px`,
                zIndex: 99999,
            });
        }
        setIsOpen(prev => !prev);
    }, []);

    // Đóng menu khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (buttonRef.current && !buttonRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const handleView = () => {
        onView?.(row);
        setIsOpen(false);
    };

    const handleEdit = () => {
        onEdit?.(row);
        setIsOpen(false);
    };

    const handleDelete = () => {
        onDelete?.(row);
        setIsOpen(false);
    };
    const handleLock = () => {
        onLock?.(row)
        setIsOpen(false)
    }

    const handleUnlock = () => {
        onUnlock?.(row)
        setIsOpen(false)
    }
    const handleApproval = () => {
        onApproval?.(row)
        setIsOpen(false)
    }
    const handleReject = () => {
        onReject?.(row)
        setIsOpen(false)
    }
    if (!showView && !showEdit && !showDelete && !showLock && !showUnlock && !showApproval && !showReject) {
        return null;
    }
    const actionCount = [
        showView && onView,
        showEdit && onEdit,
        showDelete && onDelete,
        showLock && onLock,
        showUnlock && onUnlock,
        showApproval && onApproval,
        showReject && onReject,
    ].filter(Boolean).length;
    return (
        <>
            <button
                ref={buttonRef}
                onClick={toggleMenu}
                className="flex items-center gap-1 bg-[#0EA5E5] hover:bg-sky-600 
             text-white px-3 py-1.5 rounded-xl transition-all 
             duration-200 active:scale-95 shadow-sm"
            >
                <span className="material-symbols-outlined text-base" style={{ fontSize: '12px' }}>settings</span>
                <span className="font-light text-xs">Thao tác</span>
                <span className={`material-symbols-outlined transition-transform ${isOpen ? 'rotate-180' : ''}`} style={{ fontSize: '16px' }}>
                    arrow_drop_down
                </span>
            </button>
            {isOpen && createPortal(
                <div
                    className="fixed bg-white rounded-md shadow-2xl border border-gray-100 py-2 overflow-hidden"
                    style={dropdownStyle}
                >
                    {/* 1. Xem chi tiết */}
                    {showView && onView && (
                        <button
                            onClick={handleView}
                            className="w-full px-3 py-2 flex items-center gap-2 hover:bg-slate-50 
                            text-left transition-colors text-xs font-medium"
                        >
                            <Eye size={12} className="text-blue-600" /> xem
                        </button>
                    )}

                    {/* 2. Chỉnh sửa */}
                    {showEdit && onEdit && (
                        <button
                            onClick={handleEdit}
                            className="w-full px-3 py-2 flex items-center gap-2 hover:bg-slate-50 
                            text-left transition-colors text-xs font-medium"
                        >
                            <span className="material-symbols-outlined text-amber-600" style={{ fontSize: '12px' }}>
                                {row.isLocked ? 'restore' : 'edit_square'}
                            </span>
                            <span className="text-gray-700">{row.isLocked ? 'Khôi phục' : 'Chỉnh sửa'}</span>
                        </button>
                    )}

                    {/* Divider - chỉ hiện nếu có cả 2 nhóm nút */}
                    {actionCount > 1 && (
                        <div className="h-px bg-gray-100 mx-4 my-1" />
                    )}

                    {/* 3. Xóa */}
                    {showDelete && onDelete && (
                        <button
                            onClick={handleDelete}
                            className="w-full px-3 py-2 flex items-center gap-2 hover:bg-red-50 
                            text-left transition-colors text-xs font-medium text-red-600"
                        >
                            <Trash size={12} />Xóa
                        </button>
                    )}
                    {/* 3. Xóa
                    {showLock && onLock && (
                        <button
                            onClick={handleDelete}
                            className="w-full px-3 py-2 flex items-center gap-2 hover:bg-red-50 
                            text-left transition-colors text-xs font-medium text-red-600"
                        >
                            <Lock size={12} /> Khóa
                        </button>
                    )} */}
                </div>,
                document.body
            )}
        </>
    );
}