import React, { useState, useEffect } from 'react';
import InputField from '~/components/UI/Form/InputField';
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
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                            activeTab === 'me'
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
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                            activeTab === 'other'
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
                    onChange={onChange}
                    placeholder="Ví dụ: Nguyễn Văn A"
                    error={errors.fullName} 
                    disabled={activeTab === 'me'}
                />
                
                <InputField
                    label="Số điện thoại"
                    name="phone"
                    value={contact.phone || ''}
                    onChange={onChange}
                    placeholder="Ví dụ: 0123456789"
                    error={errors.phone}
                    disabled={activeTab === 'me'}
                />
                
                <InputField
                    label="Email"
                    name="email"
                    type="email"
                    value={contact.email || ''}
                    onChange={onChange}
                    placeholder="Ví dụ: email@example.com"
                    error={errors.email}
                    disabled={activeTab === 'me'}
                />
                
                <InputField
                    label="Địa chỉ"
                    name="address"
                    value={contact.address || ''}
                    onChange={onChange}
                    placeholder="Ví dụ: 65 huỳnh thúc kháng........"
                    error={errors.address}
                    disabled={activeTab === 'me'}
                />
            </div>
        </div>
    );
}