import React, { useState, useEffect } from 'react';
import InputField from '~/components/UI/Form/InputField';
import DatePicker from '~/components/UI/Form/DatePicker';
import { getMeApi } from '~/Services/AuthService';

export default function ContactForm({
    contact,
    onChange,
    onTabChange,
    errors = {},
    onActiveTabChange
}) {
    const [activeTab, setActiveTab] = useState('me');
    const [loading, setLoading] = useState(false);

    const handleTabChange = async (tab) => {
        setActiveTab(tab);

        if (onActiveTabChange) {
            onActiveTabChange(tab);
        }

        if (tab === 'me') {
            try {
                setLoading(true);
                const response = await getMeApi();
                const meData = response?.data || response;

                const newContactData = {
                    fullName: meData?.hoTen || '',
                    phone: meData?.soDienThoai || '',
                    email: meData?.email || '',
                    address: meData?.diaChi || '',
                    dob: meData?.ngaySinh || ''
                };

                if (onTabChange) {
                    onTabChange(newContactData);
                }
            } catch (error) {
                console.error("Lỗi khi lấy thông tin tài khoản:", error);
            } finally {
                setLoading(false);
            }
        } else if (tab === 'other') {
            if (onTabChange) {
                onTabChange({
                    fullName: '',
                    phone: '',
                    email: '',
                    address: '',
                    dob: ''
                });
            }
        }
    };

    useEffect(() => {
        let isMounted = true;
        const initData = async () => {
            if (isMounted) {
                await handleTabChange('me');
            }
        };
        initData();
        return () => {
            isMounted = false;
        };
    }, []);

    // FIX: trước đây có gọi thêm window.fillPassengerFromContact(...) ở đây,
    // nhưng hàm đó không bao giờ được gán vào `window` ở bất kỳ đâu trong code
    // (CheckoutPage chỉ giữ fillPassengerFromContact ở local scope qua useCallback),
    // nên đó là dead code, không làm gì cả. Việc đồng bộ xuống passenger form
    // đã được xử lý đầy đủ ở CheckoutPage thông qua prop `onChange` / `onDateChange`
    // bên dưới, nên bỏ hẳn phần gọi window.* cho gọn và tránh nhầm lẫn khi đọc lại.
    const handleContactChange = (e) => {
        const { name, value } = e.target;
        if (onChange) {
            onChange({
                target: {
                    name,
                    value
                }
            });
        }
    };

    const handleDateChange = (value) => {
        if (onChange) {
            onChange({
                target: {
                    name: 'dob',
                    value: value
                }
            });
        }
    };

    return (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm relative">
            {loading && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-sm rounded-3xl flex items-center justify-center z-10">
                    <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
                        <p className="text-sm text-slate-500">Đang lấy thông tin tài khoản...</p>
                    </div>
                </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-4">
                <h2 className="text-xl font-bold text-slate-900">Thông tin liên lạc</h2>

                <div className="flex p-1 bg-slate-100 rounded-xl self-start sm:self-auto">
                    <button
                        type="button"
                        onClick={() => handleTabChange('me')}
                        disabled={loading}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'me'
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                    >
                        Thông tin tài khoản
                    </button>
                    <button
                        type="button"
                        onClick={() => handleTabChange('other')}
                        disabled={loading}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'other'
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                    >
                        Đặt giúp người khác
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <InputField
                    label="Họ tên"
                    name="fullName"
                    value={contact.fullName || ''}
                    onChange={handleContactChange}
                    placeholder="Ví dụ: Nguyễn Văn A"
                    error={errors.fullName}
                    disabled={activeTab === 'me'}
                    required={activeTab === 'other'}
                />

                <InputField
                    label="Số điện thoại"
                    name="phone"
                    value={contact.phone || ''}
                    onChange={handleContactChange}
                    placeholder="Ví dụ: 0123456789"
                    error={errors.phone}
                    disabled={activeTab === 'me'}
                    required={activeTab === 'other'}
                />

                <InputField
                    label="Email"
                    name="email"
                    type="email"
                    value={contact.email || ''}
                    onChange={handleContactChange}
                    placeholder="Ví dụ: email@example.com"
                    error={errors.email}
                    disabled={activeTab === 'me'}
                    required={activeTab === 'other'}
                />

                <DatePicker
                    label="Ngày sinh"
                    value={contact.dob || ''}
                    onChange={handleDateChange}
                    minDate={new Date(1900, 0, 1)}
                    maxDate={new Date()}
                    placeholderText="Chọn ngày sinh"
                    error={errors.dob}
                    disabled={activeTab === 'me'}
                    required={activeTab === 'other'}
                />

                <div className="md:col-span-2">
                    <InputField
                        label="Địa chỉ"
                        name="address"
                        value={contact.address || ''}
                        onChange={handleContactChange}
                        placeholder="Ví dụ: 65 Huỳnh Thúc Kháng, Phường Sài Gòn, TP.HCM"
                        error={errors.address}
                        disabled={activeTab === 'me'}
                    />
                </div>
            </div>

            {activeTab === 'other' && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                    <p className="text-xs text-blue-600 flex items-center gap-2">
                        Thông tin bạn nhập sẽ tự động được điền vào hành khách đầu tiên (Người lớn 1).
                    </p>
                </div>
            )}
        </div>
    );
}