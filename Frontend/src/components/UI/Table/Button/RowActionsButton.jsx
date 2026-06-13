import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Trash, Eye,KeyRound,Lock,Unlock } from 'lucide-react';

export default function RowActionsButton({
    row,
    onView,
    onEdit,
    onDelete,
    onLock,
    onUnlock,
    onResetPass,
    showView = true,
    showEdit = true,
    showDelete = true,
    showLock = true,
    showUnlock = true,
    showResetPass = true
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownStyle, setDropdownStyle] = useState({});
    const buttonRef = useRef(null);
    const dropdownRef = useRef(null);

    const toggleMenu = useCallback(() => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();

            setDropdownStyle({
                position: 'fixed',
                top: rect.bottom + 8,
                left: rect.left,
                zIndex: 99999
            });
        }

        setIsOpen(prev => !prev);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            const inButton = buttonRef.current?.contains(e.target);
            const inDropdown = dropdownRef.current?.contains(e.target);

            if (!inButton && !inDropdown) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleAction = useCallback((cb) => {
        cb?.(row);
        setIsOpen(false);
    }, [row]);

    if (!showView && !showEdit && !showDelete && !showLock && !showUnlock  &&!showResetPass) {
        return null;
    }

    const actionCount = [
        showView && onView,
        showEdit && onEdit,
        showDelete && onDelete,
        showLock && onLock,
        showUnlock && onUnlock,
        showResetPass && onResetPass
    ].filter(Boolean).length;

    const dropdown = isOpen ? (
        <div
            ref={dropdownRef}
            className="bg-white rounded-md shadow-2xl border border-gray-100 py-2"
            style={dropdownStyle}
        >

            {showView && onView && (
                <button
                    onClick={() => handleAction(onView)}
                    className="w-full px-3 py-2 flex items-center gap-2 hover:bg-slate-50 text-left text-xs font-medium"
                >
                    <Eye size={12} className="text-blue-600" />
                    xem
                </button>
            )}
            {showResetPass && onResetPass && (
                <button
                    onClick={() => handleAction(onResetPass)}
                    className="w-full px-3 py-2 flex items-center gap-2 hover:bg-slate-50 text-left text-xs font-medium"
                >
                    <KeyRound size={12} className="text-amber-600" />
                    Cấp lại mật khẩu
                </button>
            )}

  
            {showEdit && onEdit && (
                <button
                    onClick={() => handleAction(onEdit)}
                    className="w-full px-3 py-2 flex items-center gap-2 hover:bg-slate-50 text-left text-xs font-medium"
                >
                    <span className="material-symbols-outlined text-amber-600" style={{ fontSize: '12px' }}>
                        {row?.isLocked ? 'restore' : 'edit_square'}
                    </span>
                    <span className="text-gray-900">
                        {row?.isLocked ? 'Khôi phục' : 'Chỉnh sửa'}
                    </span>
                </button>
            )}

            {showLock && onLock && (
                <button
                    onClick={() => handleAction(onLock)}
                    className="w-full px-3 py-2 flex items-center gap-2 hover:bg-orange-50 text-left text-xs font-medium text-orange-600"
                >
                    <Lock size={12} />
                    <span>Khóa tài khoản</span>
                </button>
            )}

            {showUnlock && onUnlock && (
                <button
                    onClick={() => handleAction(onUnlock)}
                    className="w-full px-3 py-2 flex items-center gap-2 hover:bg-emerald-50 text-left text-xs font-medium text-emerald-600"
                >
                    <Unlock size={12} />
                    <span>Mở khóa</span>
                </button>
            )}

            {actionCount > 1 && (
                <div className="h-px bg-gray-100 mx-4 my-1" />
            )}

            {showDelete && onDelete && (
                <button
                    onClick={() => handleAction(onDelete)}
                    className="w-full px-3 py-2 flex items-center gap-2 hover:bg-red-50 text-left text-xs font-medium text-red-600"
                >
                    <Trash size={12} />
                    Xóa
                </button>
            )}
        </div>
    ) : null;

    return (
        <>
            <button
                ref={buttonRef}
                onClick={toggleMenu}
                className="flex items-center gap-1 bg-[#0EA5E5] hover:bg-sky-600 
                text-white px-3 py-1.5 rounded-xl transition-all 
                duration-200 active:scale-95 shadow-sm"
            >
                <span className="material-symbols-outlined text-base" style={{ fontSize: '12px' }}>
                    settings
                </span>
                <span className="font-light text-xs">Thao tác</span>
                <span
                    className={`material-symbols-outlined transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    style={{ fontSize: '16px' }}
                >
                    arrow_drop_down
                </span>
            </button>

            {createPortal(dropdown, document.body)}
        </>
    );
}