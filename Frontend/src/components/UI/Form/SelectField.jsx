import React, {
    useState,
    useRef,
    useEffect,
    useCallback,
} from "react";

import { createPortal } from "react-dom";
import { ChevronDown, Search, Loader2 } from "lucide-react";

export default function SelectField({
    label,
    value,
    onChange,
    options = [],
    valueKey = "value",
    labelKey = "label",
    placeholder = "Chọn...",
    error = "",
    disabled = false,
    searchable = false,
    searchText = "Tìm kiếm...",
    IconComponent = null,

    onSearch = null,
    searchDebounce = 300,
    searching = false,
}) {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const triggerRef = useRef(null);
    const dropdownRef = useRef(null);
    const searchInputRef = useRef(null);
    const debounceTimer = useRef(null);

    const [position, setPosition] = useState({
        top: 0,
        left: 0,
        width: 0,
    });

    const selectedOption = options.find(
        (x) => String(x[valueKey]) === String(value)
    );

    const selectedLabel = selectedOption
        ? selectedOption[labelKey]
        : placeholder;

    const filteredOptions =
        searchable && !onSearch
            ? options.filter((x) =>
                String(x[labelKey] || "")
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
            )
            : options;

    const updatePosition = useCallback(() => {
        if (!triggerRef.current) return;

        const rect =
            triggerRef.current.getBoundingClientRect();

        setPosition({
            top: rect.bottom + 4,
            left: rect.left,
            width: rect.width,
        });
    }, []);

    useEffect(() => {
        if (!open) return;

        updatePosition();

        const handleScrollResize = () => {
            updatePosition();
        };

        window.addEventListener(
            "scroll",
            handleScrollResize,
            true
        );

        window.addEventListener(
            "resize",
            handleScrollResize
        );

        return () => {
            window.removeEventListener(
                "scroll",
                handleScrollResize,
                true
            );

            window.removeEventListener(
                "resize",
                handleScrollResize
            );
        };
    }, [open, updatePosition]);

    useEffect(() => {
        const handleOutsideClick = (e) => {
            const clickedTrigger =
                triggerRef.current?.contains(e.target);

            const clickedDropdown =
                dropdownRef.current?.contains(e.target);

            if (!clickedTrigger && !clickedDropdown) {
                setOpen(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );
        };
    }, []);

    useEffect(() => {
        if (open && searchable) {
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 50);
        }

        if (!open) {
            setSearchTerm("");
        }
    }, [open, searchable]);

    const handleSearch = useCallback(
        (keyword) => {
            setSearchTerm(keyword);

            if (!onSearch) return;

            clearTimeout(debounceTimer.current);

            debounceTimer.current = setTimeout(() => {
                onSearch(keyword);
            }, searchDebounce);
        },
        [onSearch, searchDebounce]
    );

    useEffect(() => {
        if (open && onSearch && searchTerm === "") {
            onSearch("");
        }
    }, [open]);

    const handleSelect = (option) => {
        onChange(option[valueKey]);
        setOpen(false);
    };

    return (
        <>
            <div
                ref={triggerRef}
                className="relative w-full"
            >
                <button
                    type="button"
                    disabled={disabled}
                    onClick={() =>
                        !disabled &&
                        setOpen((prev) => !prev)
                    }
                    className={`group flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all
                    ${error
                            ? "border-red-300 bg-red-50"
                            : disabled
                                ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500"
                                : open
                                    ? "border-sky-500 ring-1 ring-sky-100"
                                    : "border-gray-200 hover:border-sky-300"
                        }`}
                >
                    {IconComponent && (
                        <IconComponent
                            size={20}
                            className="text-sky-500"
                        />
                    )}

                    <div className="flex-1 min-w-0">
                        {label && (
                            <div className="text-[10px] uppercase font-bold text-gray-400">
                                {label}
                            </div>
                        )}

                        <div
                            className={`text-sm truncate ${selectedOption
                                    ? "text-gray-800"
                                    : "text-gray-400"
                                }`}
                        >
                            {selectedLabel}
                        </div>
                    </div>

                    {searching ? (
                        <Loader2
                            size={16}
                            className="animate-spin"
                        />
                    ) : (
                        <ChevronDown
                            size={16}
                            className={`transition ${open
                                    ? "rotate-180"
                                    : ""
                                }`}
                        />
                    )}
                </button>

                {error && (
                    <p className="mt-1 text-xs text-red-500">
                        {error}
                    </p>
                )}
            </div>

            {open &&
                createPortal(
                    <div
                        ref={dropdownRef}
                        className="fixed z-[999999] rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden"
                        style={{
                            top: position.top,
                            left: position.left,
                            width: position.width,
                        }}
                    >
                        {searchable && (
                            <div className="p-3">
                                <div className="relative">
                                    <Search
                                        size={14}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        ref={
                                            searchInputRef
                                        }
                                        value={
                                            searchTerm
                                        }
                                        onChange={(e) =>
                                            handleSearch(
                                                e.target
                                                    .value
                                            )
                                        }
                                        placeholder={
                                            searchText
                                        }
                                        /* Đổi sang border-gray-200 và thêm trạng thái focus mượt mà */
                                        className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm transition-all focus:border-sky-400 focus:ring-1 focus:ring-sky-100 outline-none"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="max-h-60 overflow-y-auto py-1">
                            {searching &&
                                filteredOptions.length ===
                                0 ? (
                                <div className="p-4 text-center text-sm text-gray-400">
                                    Đang tải...
                                </div>
                            ) : filteredOptions.length >
                                0 ? (
                                filteredOptions.map(
                                    (option) => {
                                        const active =
                                            String(
                                                value
                                            ) ===
                                            String(
                                                option[
                                                valueKey
                                                ]
                                            );

                                        return (
                                            <button
                                                key={
                                                    option[
                                                    valueKey
                                                    ]
                                                }
                                                type="button"
                                                onClick={() =>
                                                    handleSelect(
                                                        option
                                                    )
                                                }
                                                className={`block w-full px-4 py-2 text-left text-sm transition
                                                ${active
                                                        ? "bg-sky-50 text-sky-600"
                                                        : "hover:bg-gray-50"
                                                    }`}
                                            >
                                                {
                                                    option[
                                                    labelKey
                                                    ]
                                                }
                                            </button>
                                        );
                                    }
                                )
                            ) : (
                                <div className="p-4 text-center text-sm text-gray-400">
                                    Không có dữ liệu
                                </div>
                            )}
                        </div>
                    </div>,
                    document.body
                )}
        </>
    );
}