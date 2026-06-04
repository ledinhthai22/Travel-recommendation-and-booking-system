import React from 'react';
import InputField from '~/components/UI/Form/InputField';

export default function ContactForm({ contact, onChange, errors = {} }) {
    return (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-6 text-slate-900">Thông tin liên lạc</h2>
            
            {/* Giữ nguyên grid 2 cột cho tất cả các ô nhập liệu */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <InputField
                    label="Họ tên"
                    name="fullName"
                    value={contact.fullName}
                    onChange={onChange}
                    placeholder="Ví dụ: Nguyễn Văn A"
                    error={errors.fullName} 
                />
                
                <InputField
                    label="Số điện thoại"
                    name="phone"
                    value={contact.phone}
                    onChange={onChange}
                    placeholder="Ví dụ: 0123456789"
                    error={errors.phone}
                />
                
                <InputField
                    label="Email"
                    name="email"
                    type="email"
                    value={contact.email}
                    onChange={onChange}
                    placeholder="Ví dụ: email@example.com"
                    error={errors.email}
                />
                
                <InputField
                    label="Địa chỉ"
                    name="address"
                    value={contact.address}
                    onChange={onChange}
                    placeholder="Ví dụ: 65 huỳnh thúc kháng........"
                    error={errors.address}
                />
            </div>
        </div>
    );
}