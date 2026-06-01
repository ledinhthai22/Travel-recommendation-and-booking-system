import React, { useEffect, useState } from 'react';
import {
    X,
    Mail,
    Lock,
    User,
    Phone,
    Eye,
    EyeOff,
    Loader2,
    LogIn,
    UserPlus,
    CheckCircle2,
    ArrowLeft,
} from 'lucide-react';

import InputField from '../UI/Form/InputField';

export default function AuthModal({ open, onClose }) {
    const [mode, setMode] = useState('login');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [forgotSent, setForgotSent] = useState(false);

    const getEmptyForm = () => ({
        fullName: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [form, setForm] = useState(getEmptyForm);

    const resetModal = () => {
        setMode('login');
        setShowPassword(false);
        setShowConfirmPassword(false);
        setLoading(false);
        setSubmitted(false);
        setForgotSent(false);
        setForm(getEmptyForm());
    };

    const isLogin = mode === 'login';
    const isRegister = mode === 'register';
    const isForgot = mode === 'forgot';

    const switchMode = (nextMode) => {
        setMode(nextMode);
        setSubmitted(false);
        setForgotSent(false);
        setShowPassword(false);
        setShowConfirmPassword(false);
        setLoading(false);
        setForm(getEmptyForm());
    };

    useEffect(() => {
        if (!open) return;

        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                onClose?.();
            }
        };

        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleEsc);

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleEsc);
        };
    }, [open, onClose]);

    useEffect(() => {
        if (!open) {
            resetModal();
        }
    }, [open]);

    if (!open) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (isForgot && forgotSent) {
            setForgotSent(false);
        }
    };

    const errors = {
        fullName:
            isRegister && submitted && !form.fullName.trim()
                ? 'Vui lòng nhập họ và tên.'
                : '',

        phone:
            isRegister && submitted && !form.phone.trim()
                ? 'Vui lòng nhập số điện thoại.'
                : '',

        email:
            submitted && !form.email.trim()
                ? 'Vui lòng nhập email.'
                : '',

        password:
            !isForgot && submitted && !form.password.trim()
                ? 'Vui lòng nhập mật khẩu.'
                : '',

        confirmPassword:
            isRegister && submitted && form.confirmPassword !== form.password
                ? 'Mật khẩu xác nhận không khớp.'
                : '',
    };

    const hasError = Object.values(errors).some(Boolean);

    const getTitle = () => {
        if (isLogin) return 'Chào mừng trở lại';
        if (isRegister) return 'Tạo tài khoản mới';
        return 'Quên mật khẩu';
    };

    const getDescription = () => {
        if (isLogin) {
            return 'Đăng nhập để tiếp tục đặt tour và quản lý hành trình của bạn.';
        }

        if (isRegister) {
            return 'Tạo tài khoản để đặt tour nhanh hơn và nhận thông tin ưu đãi.';
        }

        return 'Nhập email tài khoản của bạn. Chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu.';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);

        if (hasError) return;

        if (isRegister && form.confirmPassword !== form.password) return;

        setLoading(true);

        try {
            if (isForgot) {
                const payload = {
                    email: form.email,
                };

                console.log('Forgot password payload:', payload);
                await new Promise((resolve) => setTimeout(resolve, 700));

                setForgotSent(true);
                return;
            }

            const payload = isLogin
                ? {
                    email: form.email,
                    password: form.password,
                }
                : {
                    fullName: form.fullName,
                    phone: form.phone,
                    email: form.email,
                    password: form.password,
                };

            console.log(isLogin ? 'Login payload:' : 'Register payload:', payload);
            await new Promise((resolve) => setTimeout(resolve, 700));

            alert(isLogin ? 'Đăng nhập thành công.' : 'Đăng ký thành công.');
            onClose?.();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center px-4 py-4">
            <button
                type="button"
                aria-label="Đóng modal"
                onClick={onClose}
                className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
            />

            <div className="relative max-h-[92vh] w-full max-w-[430px] overflow-y-auto rounded-[28px] bg-white shadow-2xl">
                <div className="relative p-5 sm:p-6">
                    <div className="relative px-10 text-center">
                        {isForgot && (
                            <button
                                type="button"
                                onClick={() => switchMode('login')}
                                className="absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-500 transition hover:bg-slate-100 hover:text-[#0EA5E5]"
                            >
                                <ArrowLeft size={18} />
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={onClose}
                            className="absolute right-0 top-0 flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-500 transition hover:bg-red-50 hover:text-[#ba1a1a]"
                        >
                            <X size={19} />
                        </button>

                        <h1 className="pt-1 text-2xl font-black leading-tight text-slate-900">
                            {getTitle()}
                        </h1>

                        <p className="mx-auto mt-2 max-w-[320px] text-xs leading-5 text-slate-500">
                            {getDescription()}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
                        {isRegister && (
                            <>
                                <InputField
                                    label="Họ và tên"
                                    name="fullName"
                                    value={form.fullName}
                                    onChange={handleChange}
                                    placeholder="Nhập họ và tên"
                                    error={errors.fullName}
                                    Icon={User}
                                />

                                <InputField
                                    label="Số điện thoại"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    placeholder="Nhập số điện thoại"
                                    error={errors.phone}
                                    Icon={Phone}
                                />
                            </>
                        )}

                        <InputField
                            label="Email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            error={errors.email}
                            Icon={Mail}
                        />

                        {isForgot && forgotSent && (
                            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                                <div className="flex items-start gap-3">
                                    <CheckCircle2
                                        size={20}
                                        className="mt-0.5 shrink-0 text-emerald-600"
                                    />

                                    <div>
                                        <p className="text-sm font-bold text-emerald-700">
                                            Đã gửi hướng dẫn khôi phục
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-emerald-600">
                                            Vui lòng kiểm tra email của bạn để đặt lại mật khẩu.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {!isForgot && (
                            <InputField
                                label="Mật khẩu"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Nhập mật khẩu"
                                error={errors.password}
                                Icon={Lock}
                                rightAction={
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="text-slate-400 transition hover:text-[#0EA5E5]"
                                    >
                                        {showPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>
                                }
                            />
                        )}

                        {isRegister && (
                            <InputField
                                label="Xác nhận mật khẩu"
                                name="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={form.confirmPassword}
                                onChange={handleChange}
                                placeholder="Nhập lại mật khẩu"
                                error={errors.confirmPassword}
                                Icon={Lock}
                                rightAction={
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword((prev) => !prev)
                                        }
                                        className="text-slate-400 transition hover:text-[#0EA5E5]"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>
                                }
                            />
                        )}

                        {isLogin && (
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 text-sm text-slate-500">
                                    <input
                                        type="checkbox"
                                        style={{ color: '#005ea3' }}
                                        className="h-4 w-4 rounded border-slate-300 focus:ring-[#0EA5E5]"
                                    />
                                    Ghi nhớ đăng nhập
                                </label>

                                <button
                                    type="button"
                                    onClick={() => switchMode('forgot')}
                                    className="text-sm font-semibold text-[#0EA5E5] hover:underline"
                                >
                                    Quên mật khẩu?
                                </button>
                            </div>
                        )}

                        {isRegister && (
                            <p className="text-xs leading-5 text-slate-400">
                                Khi đăng ký, bạn đồng ý với điều khoản sử dụng và chính sách bảo mật của chúng tôi.
                            </p>
                        )}

                        {isForgot && (
                            <p className="text-xs leading-5 text-slate-400">
                                Nếu email tồn tại trong hệ thống, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu trong vài phút.
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0EA5E5] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-100 transition  disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Đang xử lý...
                                </>
                            ) : isLogin ? (
                                <>
                                    <LogIn size={18} />
                                    Đăng nhập
                                </>
                            ) : isRegister ? (
                                <>
                                    <UserPlus size={18} />
                                    Đăng ký
                                </>
                            ) : (
                                <>
                                    <Mail size={18} />
                                    Gửi 
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-5 text-center text-sm text-slate-500">
                        {isLogin && (
                            <>
                                Chưa có tài khoản?{' '}
                                <button
                                    type="button"
                                    onClick={() => switchMode('register')}
                                    className="font-bold text-[#0EA5E5] hover:underline"
                                >
                                    Đăng ký ngay
                                </button>
                            </>
                        )}

                        {isRegister && (
                            <>
                                Đã có tài khoản?{' '}
                                <button
                                    type="button"
                                    onClick={() => switchMode('login')}
                                    className="font-bold text-[#0EA5E5] hover:underline"
                                >
                                    Đăng nhập
                                </button>
                            </>
                        )}

                        {isForgot && (
                            <>
                                Nhớ mật khẩu?{' '}
                                <button
                                    type="button"
                                    onClick={() => switchMode('login')}
                                    className="font-bold text-[#0EA5E5] hover:underline"
                                >
                                    Quay lại đăng nhập
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}