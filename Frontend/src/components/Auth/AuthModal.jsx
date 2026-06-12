import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
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
    ArrowLeft,
} from 'lucide-react';
import {
    loginApi,
    registerApi,
    forgotPasswordApi,
    resetPasswordApi,
    verifyOtpApi,
} from '~/Services/AuthService';
import useAuth from '~/Hooks/useAuth';
import InputField from '../UI/Form/InputField';
import { useNavigate } from 'react-router-dom';
import { toastSuccess, toastError } from '~/utils/Toast';
import { getErrorMessage } from '~/utils/errorHelper';


const EMPTY_FORM = {
    fullName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    otp: '',
    newPassword: '',
};

const OTP_TTL = 300;

const TITLES = {
    login: 'Chào mừng trở lại',
    register: 'Tạo tài khoản mới',
    forgot: 'Quên mật khẩu',
};

const DESCRIPTIONS = {
    login: 'Đăng nhập để tiếp tục đặt tour và quản lý hành trình của bạn.',
    register: 'Tạo tài khoản để đặt tour nhanh hơn và nhận thông tin ưu đãi.',
    forgot: 'Nhập email tài khoản của bạn. Chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu.',
};


const OtpCountdown = React.memo(function OtpCountdown({ onResend }) {
    const [countdown, setCountdown] = useState(OTP_TTL);
    const timerRef = useRef(null);

    useEffect(() => {
        timerRef.current = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, []);

    const mm = Math.floor(countdown / 60);
    const ss = String(countdown % 60).padStart(2, '0');

    return (
        <div className="flex items-center justify-between text-sm">
            <span>
                Mã otp hết hạn sau:
                <span className="font-medium text-red-500"> {mm}:{ss}</span>
            </span>
            {countdown === 0 && (
                <button
                    type="button"
                    onClick={onResend}
                    className="font-semibold text-[#0EA5E5] hover:underline"
                >
                    Gửi lại OTP
                </button>
            )}
        </div>
    );
});

const PasswordToggle = React.memo(function PasswordToggle({ show, onToggle }) {
    return (
        <button
            type="button"
            onClick={onToggle}
            className="text-slate-400 transition hover:text-[#0EA5E5]"
        >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
    );
});



export default function AuthModal({ open, onClose }) {
    const [mode, setMode] = useState('login');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [forgotSent, setForgotSent] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);

    const { login } = useAuth();
    const navigate = useNavigate();

    const isLogin = mode === 'login';
    const isRegister = mode === 'register';
    const isForgot = mode === 'forgot';

    // ── Reset ──────────────────────────────────────────────────────────────

    const resetModal = useCallback(() => {
        setMode('login');
        setOtpSent(false);
        setOtpVerified(false);
        setShowPassword(false);
        setShowConfirmPassword(false);
        setLoading(false);
        setSubmitted(false);
        setForgotSent(false);
        setForm(EMPTY_FORM);
    }, []);

    const switchMode = useCallback((nextMode) => {
        setMode(nextMode);
        setSubmitted(false);
        setForgotSent(false);
        setShowPassword(false);
        setShowConfirmPassword(false);
        setLoading(false);
        setForm(EMPTY_FORM);
        setOtpSent(false);
        setOtpVerified(false);
    }, []);

    // ── Effects ────────────────────────────────────────────────────────────

    useEffect(() => {
        if (!open) return;
        const handleEsc = (e) => { if (e.key === 'Escape') onClose?.(); };
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleEsc);
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleEsc);
        };
    }, [open, onClose]);

    useEffect(() => {
        if (!open) resetModal();
    }, [open, resetModal]);

    // ── Validation ─────────────────────────────────────────────────────────

    const errors = useMemo(() => ({
        fullName:
            isRegister && submitted && !form.fullName.trim()
                ? 'Vui lòng nhập họ tên'
                : '',

        phone:
            isRegister && submitted && !form.phone.trim()
                ? 'Vui lòng nhập số điện thoại'
                : isRegister && submitted && !/^0\d{9}$/.test(form.phone)
                    ? 'Số điện thoại không hợp lệ'
                    : '',

        email:
            submitted && !form.email.trim()
                ? 'Vui lòng nhập email'
                : submitted && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
                    ? 'Email không hợp lệ'
                    : '',

        password:
            !isForgot && submitted && !form.password
                ? 'Vui lòng nhập mật khẩu'
                : !isForgot && submitted && form.password.length <8
                    ? 'Mật khẩu tối thiểu 8 ký tự'
                    : '',

        confirmPassword:
            isRegister && submitted && !form.confirmPassword
                ? 'Vui lòng xác nhận mật khẩu'
                : isRegister && submitted && form.confirmPassword !== form.password
                    ? 'Mật khẩu xác nhận không khớp'
                    : '',

        otp:
            isForgot && otpSent && !otpVerified && submitted && !form.otp.trim()
                ? 'Vui lòng nhập mã OTP'
                : '',

        newPassword:
            isForgot && otpVerified && submitted && !form.newPassword
                ? 'Vui lòng nhập mật khẩu mới'
                : isForgot && otpVerified && submitted && form.newPassword.length < 8
                    ? 'Mật khẩu tối thiểu 8 ký tự'
                    : '',
    }), [form, submitted, isRegister, isForgot, otpSent, otpVerified]);

    const hasError = useMemo(
        () => Object.values(errors).some(Boolean),
        [errors]
    );

    // ── Handlers ───────────────────────────────────────────────────────────

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (isForgot && forgotSent) setForgotSent(false);
    }, [isForgot, forgotSent]);

    const togglePassword = useCallback(
        () => setShowPassword((p) => !p), []
    );

    const toggleConfirmPassword = useCallback(
        () => setShowConfirmPassword((p) => !p), []
    );

    const handleVerifyOtp = useCallback(async () => {
        if (!form.otp.trim()) {
            toastError('Thiếu OTP', 'Vui lòng nhập mã OTP');
            return;
        }
        try {
            await verifyOtpApi({ email: form.email, otp: form.otp });
            setOtpVerified(true);
            toastSuccess('OTP hợp lệ', 'Bạn có thể đổi mật khẩu');
        } catch {
            toastError('OTP không hợp lệ', 'Vui lòng kiểm tra lại');
        }
    }, [form.otp, form.email]);

    const handleResendOtp = useCallback(async () => {
        try {
            await forgotPasswordApi(form.email);
            toastSuccess('Đã gửi lại OTP', 'Vui lòng kiểm tra email');
        } catch {
            toastError('Lỗi', 'Không thể gửi OTP');
        }
    }, [form.email]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setSubmitted(true);

        if (hasError) {
            toastError('Thông tin không hợp lệ', 'Vui lòng kiểm tra lại dữ liệu.');
            return;
        }

        if (isRegister && form.confirmPassword !== form.password) {
            toastError('Mật khẩu không khớp', 'Vui lòng nhập lại mật khẩu xác nhận.');
            return;
        }

        setLoading(true);
        try {
            if (isForgot && !otpSent) {
                await forgotPasswordApi(form.email);
                toastSuccess('Đã gửi OTP', 'Vui lòng kiểm tra email.');
                setOtpSent(true);
                return;
            }

            if (isForgot && otpVerified) {
                if (form.newPassword !== form.confirmPassword) {
                    toastError('Lỗi', 'Mật khẩu xác nhận không khớp');
                    return;
                }
                await resetPasswordApi({
                    email: form.email,
                    otp: form.otp,
                    newPassword: form.newPassword,
                });
                toastSuccess('Thành công', 'Đổi mật khẩu thành công');
                switchMode('login');
                return;
            }

            if (isLogin) {
                const result = await loginApi({ email: form.email, matKhau: form.password });
                const profile = await login(result);
                toastSuccess('Đăng nhập thành công', 'Chào mừng bạn quay trở lại.');
                onClose?.();
                navigate(profile.maVaiTro === 1 || profile.maVaiTro === 2 ? '/Quan-ly' : '/');
                return;
            }

            if (isRegister) {
                const payload = {
                    hoTen: form.fullName.trim(),
                    email: form.email.trim(),
                    matKhau: form.password,
                    xacNhanMatKhau: form.confirmPassword,
                    soDienThoai: form.phone.trim(),
                };
                await registerApi(payload);
                toastSuccess('Đăng ký thành công', 'Tài khoản của bạn đã được tạo.');
                switchMode('login');
                setForm({ ...EMPTY_FORM, email: payload.email });
                return;
            }
        } catch (error) {
            toastError('Thao tác thất bại', getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    }, [
        hasError, isRegister, isForgot, isLogin,
        form, otpSent, otpVerified,
        login, navigate, onClose, switchMode,
    ]);



    const passwordToggle = useMemo(
        () => <PasswordToggle show={showPassword} onToggle={togglePassword} />,
        [showPassword, togglePassword]
    );

    const confirmPasswordToggle = useMemo(
        () => <PasswordToggle show={showConfirmPassword} onToggle={toggleConfirmPassword} />,
        [showConfirmPassword, toggleConfirmPassword]
    );



    if (!open) return null;



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
                            {TITLES[mode] ?? 'Đặt lại mật khẩu'}
                        </h1>

                        <p className="mx-auto mt-2 max-w-[360px] text-[11px] leading-5 text-slate-500">
                            {DESCRIPTIONS[mode]}
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


                        {!isForgot && (
                            <>
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
                                <InputField
                                    label="Mật khẩu"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Nhập mật khẩu"
                                    error={errors.password}
                                    Icon={Lock}
                                    rightAction={passwordToggle}
                                />
                            </>
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
                                rightAction={confirmPasswordToggle}
                            />
                        )}

                        {/* Forgot — step 1: email */}
                        {isForgot && !otpSent && (
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
                        )}


                        {isForgot && otpSent && !otpVerified && (
                            <>
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                                    <label className="text-sm text-slate-600">
                                        OTP đã được gửi đến:
                                    </label>
                                    <p className="font-semibold text-slate-900">{form.email}</p>
                                </div>

                                <InputField
                                    label="Mã OTP"
                                    name="otp"
                                    value={form.otp}
                                    onChange={handleChange}
                                    placeholder="Nhập mã OTP"
                                />


                                <OtpCountdown onResend={handleResendOtp} />

                                <button
                                    type="button"
                                    onClick={handleVerifyOtp}
                                    className="w-full rounded-2xl bg-[#0EA5E5] py-3 text-sm font-bold text-white"
                                >
                                    Xác nhận OTP
                                </button>
                            </>
                        )}


                        {isForgot && otpVerified && (
                            <>
                                <InputField
                                    label="Mật khẩu mới"
                                    name="newPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.newPassword}
                                    onChange={handleChange}
                                    placeholder="Nhập mật khẩu mới"
                                    Icon={Lock}
                                    rightAction={passwordToggle}
                                />
                                <InputField
                                    label="Xác nhận mật khẩu"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Nhập lại mật khẩu"
                                    Icon={Lock}
                                    rightAction={confirmPasswordToggle}
                                />
                            </>
                        )}

                        {isLogin && (
                            <div className="flex items-center justify-end">
                                <button
                                    type="button"
                                    onClick={() => switchMode('forgot')}
                                    className="text-[10px] font-semibold text-[#0EA5E5] hover:underline"
                                >
                                    Quên mật khẩu?
                                </button>
                            </div>
                        )}

                        {(!isForgot || !otpSent || otpVerified) && (
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0EA5E5] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-100 transition disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Đang xử lý...
                                    </>
                                ) : isLogin ? (
                                    <><LogIn size={16} />Đăng nhập</>
                                ) : isRegister ? (
                                    <><UserPlus size={16} />Đăng ký</>
                                ) : isForgot && !otpSent ? (
                                    <><Mail size={16} />Gửi OTP</>
                                ) : (
                                    <><Lock size={14} />Đổi mật khẩu</>
                                )}
                            </button>
                        )}
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