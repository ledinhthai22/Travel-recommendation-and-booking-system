import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    CalendarDays,
    Users,
    MapPin,
    Clock,
    Phone,
    Mail,
    User,
    CreditCard,
    Wallet,
    Banknote,
    LockKeyhole,
    Send,
} from 'lucide-react';
import InputField from '~/components/UI/Form/InputField';

const formatCurrency = (value) =>
    new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(value || 0);

const formatDate = (value) => {
    if (!value) return '';

    const [year, month, day] = value.split('-');
    return `${day}/${month}/${year}`;
};

function CheckoutStep({ step }) {
    const steps = [
        {
            number: 1,
            label: 'Kiểm tra tour',
            description: 'Xác nhận lịch trình',
        },
        {
            number: 2,
            label: 'Thông tin khách',
            description: 'Người liên hệ',
        },
        {
            number: 3,
            label: 'Thanh toán',
            description: 'Hoàn tất đặt chỗ',
        },
    ];

    return (
        <div className="rounded-[2rem] border border-slate-100 bg-white p-4 shadow-sm md:p-5">
            <div className="grid grid-cols-3 gap-2">
                {steps.map((item, index) => {
                    const active = step === item.number;
                    const completed = step > item.number;

                    return (
                        <div key={item.number} className="relative">
                            {index !== 0 && (
                                <div
                                    className={`absolute right-1/2 top-5 h-0.5 w-full -translate-y-1/2 ${completed || active
                                        ? 'bg-emerald-600'
                                        : 'bg-slate-200'
                                        }`}
                                />
                            )}

                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition ${completed
                                        ? 'bg-emerald-500 text-white'
                                        : active
                                            ? 'bg-emerald-600 text-white shadow-lg shadow-blue-200'
                                            : 'bg-slate-100 text-slate-400'
                                        }`}
                                >
                                    {completed ? <CheckCircle2 size={18} /> : item.number}
                                </div>

                                <p
                                    className={`mt-2 text-xs font-bold md:text-sm ${active
                                        ? 'text-emerald-600'
                                        : completed
                                            ? 'text-emerald-600'
                                            : 'text-slate-500'
                                        }`}
                                >
                                    {item.label}
                                </p>

                                <p className="mt-0.5 hidden text-[11px] text-slate-400 sm:block">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function SummaryCard({ bookingData }) {
    const depositAmount = Math.round(bookingData.totalPrice * 0.3);

    return (
        <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl shadow-slate-200/60">
                <img
                    src={bookingData.image}
                    alt={bookingData.tourName}
                    className="h-48 w-full object-cover"
                />

                <div className="p-5">
                    <h3 className="line-clamp-2 text-lg font-bold text-slate-900">
                        {bookingData.tourName}
                    </h3>

                    <div className="mt-4 space-y-3 text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-blue-600" />
                            {bookingData.destination}
                        </div>

                        <div className="flex items-center gap-2">
                            <Clock size={16} className="text-blue-600" />
                            {bookingData.duration}
                        </div>

                        <div className="flex items-center gap-2">
                            <CalendarDays size={16} className="text-blue-600" />
                            {formatDate(bookingData.selectedDate)}
                        </div>

                        <div className="flex items-center gap-2">
                            <Users size={16} className="text-blue-600" />
                            {bookingData.totalGuests} khách
                        </div>
                    </div>

                    <div className="my-5 h-px bg-slate-100" />

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-slate-500">
                            <span>Người lớn x {bookingData.adults}</span>
                            <span>
                                {formatCurrency(bookingData.price * bookingData.adults)}
                            </span>
                        </div>

                        {bookingData.children > 0 && (
                            <div className="flex justify-between text-slate-500">
                                <span>Trẻ em x {bookingData.children}</span>
                                <span>
                                    {formatCurrency(
                                        bookingData.childPrice * bookingData.children
                                    )}
                                </span>
                            </div>
                        )}

                        <div className="my-3 h-px bg-slate-200" />

                        <div className="flex justify-between">
                            <span className="font-semibold text-slate-700">
                                Tổng cộng
                            </span>
                            <span className="text-xl font-bold text-blue-600">
                                {formatCurrency(bookingData.totalPrice)}
                            </span>
                        </div>

                        <div className="flex justify-between text-sm text-slate-500">
                            <span>Giữ chỗ 30%</span>
                            <span>{formatCurrency(depositAmount)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}


export default function CheckoutPage() {
    const navigate = useNavigate();

    const [bookingData, setBookingData] = useState(null);
    const [step, setStep] = useState(1);
    const [submitted, setSubmitted] = useState(false);
    const [success, setSuccess] = useState(false);

    const [customer, setCustomer] = useState({
        fullName: '',
        phone: '',
        email: '',
        note: '',
    });

    const [paymentMethod, setPaymentMethod] = useState('pay_later');

    useEffect(() => {
        const raw = sessionStorage.getItem('bookingData');

        if (!raw) {
            navigate('/tours');
            return;
        }

        setBookingData(JSON.parse(raw));
    }, [navigate]);

    const depositAmount = useMemo(() => {
        if (!bookingData) return 0;
        return Math.round(bookingData.totalPrice * 0.3);
    }, [bookingData]);

    const paymentMethods = [
        {
            value: 'pay_later',
            title: 'Thanh toán sau',
            description:
                'Gửi yêu cầu đặt tour. Nhân viên tư vấn sẽ liên hệ xác nhận trước khi thanh toán.',
            icon: Wallet,
        },
        {
            value: 'bank_transfer',
            title: 'Chuyển khoản ngân hàng',
            description:
                'Thanh toán giữ chỗ 30% giá trị tour qua chuyển khoản.',
            icon: Banknote,
        },
        {
            value: 'card',
            title: 'Thẻ thanh toán',
            description:
                'Thanh toán online bằng thẻ nội địa hoặc quốc tế.',
            icon: CreditCard,
        },
    ];

    const handleCustomerChange = (event) => {
        const { name, value } = event.target;

        setCustomer((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const isCustomerValid =
        customer.fullName.trim() &&
        customer.phone.trim() &&
        customer.email.trim();

    const goNext = () => {
        setSubmitted(true);

        if (step === 2 && !isCustomerValid) {
            return;
        }

        setSubmitted(false);
        setStep((prev) => Math.min(3, prev + 1));
    };

    const goBack = () => {
        setSubmitted(false);
        setStep((prev) => Math.max(1, prev - 1));
    };

    const handleConfirmBooking = () => {
        setSubmitted(true);

        if (!isCustomerValid || !paymentMethod) return;

        const payload = {
            ...bookingData,
            customer,
            paymentMethod,
            depositAmount,
            status:
                paymentMethod === 'pay_later'
                    ? 'pending_consultation'
                    : 'pending_payment',
        };

        console.log('Checkout payload:', payload);

        /**
         * Sau này gọi API:
         *
         * await bookingApi.create(payload)
         * hoặc tạo payment URL:
         * await paymentApi.createPayment(payload)
         */

        sessionStorage.removeItem('bookingData');
        setSuccess(true);
    };

    if (!bookingData) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white">
                <p className="text-sm text-slate-400">Đang tải thông tin đặt tour...</p>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-slate-50 pt-24">
                <div className="mx-auto max-w-2xl px-4 py-16 text-center md:px-8">
                    <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
                            <CheckCircle2 size={42} />
                        </div>

                        <h1 className="mt-6 text-3xl font-bold text-slate-900">
                            Đặt tour thành công
                        </h1>

                        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500">
                            Yêu cầu đặt tour của bạn đã được ghi nhận. Nhân viên tư vấn sẽ liên hệ để xác nhận thông tin và hướng dẫn thanh toán.
                        </p>

                        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                            <Link
                                to="/"
                                className="rounded-2xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:border-blue-500 hover:text-blue-600"
                            >
                                Về trang chủ
                            </Link>

                            <Link
                                to="/tours"
                                className="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                            >
                                Xem thêm tour
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-24">
            <div className="mx-auto max-w-7xl px-4 pb-16 md:px-8">
                <div className="mb-6">
                    <div className="mb-4 flex items-center justify-between gap-4">
                        <Link
                            to={`/tours/${bookingData.tourId}`}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
                        >
                            <ArrowLeft size={16} />
                            Quay lại chi tiết tour
                        </Link>

                        <div className="hidden rounded-full bg-blue-50 px-4 py-2 text-xs font-bold text-blue-600 sm:block">
                            Đặt tour an toàn
                        </div>
                    </div>

                    <CheckoutStep step={step} />
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
                    <main className="space-y-6">


                        {step === 1 && (
                            <section className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm">
                                <div className="border-b border-slate-100 px-5 py-5 md:px-6">
                                    <h2 className="mt-2 text-2xl font-bold text-slate-900">
                                        Kiểm tra thông tin tour
                                    </h2>

                                    <p className="mt-2 text-sm leading-6 text-slate-500">
                                        Vui lòng kiểm tra lại ngày khởi hành, điểm đến và số lượng khách trước khi tiếp tục.
                                    </p>
                                </div>

                                <div className="p-5 md:p-6">
                                    <div className="grid gap-5 lg:grid-cols-[290px_1fr]">
                                        <div className="overflow-hidden rounded-3xl bg-slate-100">
                                            <img
                                                src={bookingData.image}
                                                alt={bookingData.tourName}
                                                className="h-64 w-full object-cover lg:h-full"
                                            />
                                        </div>

                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
                                                    Tour đang chọn
                                                </span>

                                                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
                                                    Còn chỗ
                                                </span>
                                            </div>

                                            <h3 className="mt-4 text-2xl font-bold leading-tight text-slate-900">
                                                {bookingData.tourName}
                                            </h3>

                                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                                <div className="rounded-2xl bg-slate-50 p-4">
                                                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                                        <MapPin size={16} className="text-blue-600" />
                                                        Điểm đến
                                                    </div>
                                                    <p className="mt-2 text-sm text-slate-500">
                                                        {bookingData.destination}
                                                    </p>
                                                </div>

                                                <div className="rounded-2xl bg-slate-50 p-4">
                                                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                                        <Clock size={16} className="text-blue-600" />
                                                        Thời gian
                                                    </div>
                                                    <p className="mt-2 text-sm text-slate-500">
                                                        {bookingData.duration}
                                                    </p>
                                                </div>

                                                <div className="rounded-2xl bg-slate-50 p-4">
                                                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                                        <CalendarDays size={16} className="text-blue-600" />
                                                        Ngày khởi hành
                                                    </div>
                                                    <p className="mt-2 text-sm text-slate-500">
                                                        {formatDate(bookingData.selectedDate)}
                                                    </p>
                                                </div>

                                                <div className="rounded-2xl bg-slate-50 p-4">
                                                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                                        <Users size={16} className="text-blue-600" />
                                                        Số khách
                                                    </div>
                                                    <p className="mt-2 text-sm text-slate-500">
                                                        {bookingData.adults} người lớn
                                                        {bookingData.children > 0
                                                            ? `, ${bookingData.children} trẻ em`
                                                            : ''}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                                                <p className="text-sm leading-6 text-blue-700">
                                                    Sau khi gửi yêu cầu, nhân viên tư vấn sẽ xác nhận lại lịch khởi hành, tình trạng chỗ và thông tin thanh toán trước khi hoàn tất booking.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}
                        {step === 2 && (
                            <section className="rounded-[2rem] border border-slate-100 bg-white shadow-sm">
                                <div className="border-b border-slate-100 px-5 py-5 md:px-6">
                                    <h2 className="mt-2 text-2xl font-bold text-slate-900">
                                        Thông tin khách hàng
                                    </h2>

                                    <p className="mt-2 text-sm leading-6 text-slate-500">
                                        Thông tin này dùng để xác nhận booking, gửi thông tin tour và hỗ trợ khi cần thiết.
                                    </p>
                                </div>

                                <div className="p-5 md:p-6">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <InputField
                                            label="Họ và tên"
                                            name="fullName"
                                            value={customer.fullName}
                                            onChange={handleCustomerChange}
                                            placeholder="Nhập họ và tên"
                                            icon={User}
                                            error={
                                                submitted && !customer.fullName.trim()
                                                    ? 'Vui lòng nhập họ và tên.'
                                                    : ''
                                            }
                                        />

                                        <InputField
                                            label="Số điện thoại"
                                            name="phone"
                                            value={customer.phone}
                                            onChange={handleCustomerChange}
                                            placeholder="Nhập số điện thoại"
                                            icon={Phone}
                                            error={
                                                submitted && !customer.phone.trim()
                                                    ? 'Vui lòng nhập số điện thoại.'
                                                    : ''
                                            }
                                        />

                                        <div className="md:col-span-2">
                                            <InputField
                                                label="Email"
                                                name="email"
                                                type="email"
                                                value={customer.email}
                                                onChange={handleCustomerChange}
                                                placeholder="Nhập email"
                                                icon={Mail}
                                                error={
                                                    submitted && !customer.email.trim()
                                                        ? 'Vui lòng nhập email.'
                                                        : ''
                                                }
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="text-sm font-semibold text-slate-700">
                                                Ghi chú thêm
                                            </label>

                                            <textarea
                                                name="note"
                                                value={customer.note}
                                                onChange={handleCustomerChange}
                                                rows={4}
                                                placeholder="Ví dụ: cần phòng gần nhau, ăn chay, có trẻ nhỏ, yêu cầu đón riêng..."
                                                className="mt-2 w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                                        <div className="rounded-2xl bg-slate-50 p-4">
                                            <p className="text-sm font-bold text-slate-800">
                                                Bảo mật thông tin
                                            </p>
                                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                                Thông tin chỉ dùng cho xác nhận đặt tour.
                                            </p>
                                        </div>

                                        <div className="rounded-2xl bg-slate-50 p-4">
                                            <p className="text-sm font-bold text-slate-800">
                                                Tư vấn nhanh
                                            </p>
                                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                                Nhân viên sẽ liên hệ sau khi bạn gửi yêu cầu.
                                            </p>
                                        </div>

                                        <div className="rounded-2xl bg-slate-50 p-4">
                                            <p className="text-sm font-bold text-slate-800">
                                                Không phát sinh
                                            </p>
                                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                                Chi phí được xác nhận rõ trước thanh toán.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {step === 3 && (
                            <section className="rounded-[2rem] border border-slate-100 bg-white shadow-sm">
                                <div className="border-b border-slate-100 px-5 py-5 md:px-6">
                                    <h2 className="mt-2 text-2xl font-bold text-slate-900">
                                        Chọn phương thức thanh toán
                                    </h2>

                                    <p className="mt-2 text-sm leading-6 text-slate-500">
                                        Bạn có thể gửi yêu cầu trước hoặc thanh toán giữ chỗ để được ưu tiên xác nhận.
                                    </p>
                                </div>

                                <div className="p-5 md:p-6">
                                    <div className="grid gap-4">
                                        {paymentMethods.map((method) => {
                                            const Icon = method.icon;
                                            const active = paymentMethod === method.value;

                                            return (
                                                <button
                                                    key={method.value}
                                                    type="button"
                                                    onClick={() => setPaymentMethod(method.value)}
                                                    className={`flex w-full items-start gap-4 rounded-3xl border p-5 text-left transition ${active
                                                        ? 'border-blue-500 bg-blue-50 shadow-sm'
                                                        : 'border-slate-200 bg-white hover:border-blue-300'
                                                        }`}
                                                >
                                                    <div
                                                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${active
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-slate-50 text-slate-500'
                                                            }`}
                                                    >
                                                        <Icon size={22} />
                                                    </div>

                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between gap-3">
                                                            <p
                                                                className={`font-bold ${active ? 'text-blue-700' : 'text-slate-900'
                                                                    }`}
                                                            >
                                                                {method.title}
                                                            </p>

                                                            <span
                                                                className={`h-5 w-5 rounded-full border-2 ${active
                                                                    ? 'border-blue-600 bg-blue-600 ring-4 ring-blue-100'
                                                                    : 'border-slate-300'
                                                                    }`}
                                                            />
                                                        </div>

                                                        <p className="mt-1 text-sm leading-6 text-slate-500">
                                                            {method.description}
                                                        </p>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {paymentMethod !== 'pay_later' && (
                                        <div className="mt-5 rounded-3xl border border-blue-100 bg-blue-50 p-5">
                                            <div className="flex items-start gap-3">
                                                <LockKeyhole
                                                    size={20}
                                                    className="mt-0.5 shrink-0 text-blue-600"
                                                />
                                                <div>
                                                    <p className="text-sm font-bold text-blue-800">
                                                        Thanh toán giữ chỗ
                                                    </p>
                                                    <p className="mt-1 text-sm leading-6 text-blue-700">
                                                        Bạn cần thanh toán trước{' '}
                                                        <b>{formatCurrency(depositAmount)}</b>, tương đương 30% giá trị tour. Phần còn lại sẽ được thanh toán theo hướng dẫn của tư vấn viên.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {paymentMethod === 'pay_later' && (
                                        <div className="mt-5 rounded-3xl border border-emerald-100 bg-emerald-50 p-5">
                                            <div className="flex items-start gap-3">
                                                <CheckCircle2
                                                    size={20}
                                                    className="mt-0.5 shrink-0 text-emerald-600"
                                                />
                                                <p className="text-sm leading-6 text-emerald-700">
                                                    Bạn chưa cần thanh toán ngay. Hệ thống sẽ gửi yêu cầu đặt tour và nhân viên tư vấn sẽ liên hệ xác nhận.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        <div className="flex gap-3 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
                            {step > 1 && (
                                <button
                                    type="button"
                                    onClick={goBack}
                                    className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-blue-500 hover:text-blue-600"
                                >
                                    Quay lại
                                </button>
                            )}

                            {step < 3 ? (
                                <button
                                    type="button"
                                    onClick={goNext}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                                >
                                    Tiếp tục
                                    <ArrowRight size={17} />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleConfirmBooking}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                                >
                                    {paymentMethod === 'pay_later'
                                        ? 'Gửi yêu cầu đặt tour'
                                        : 'Xác nhận thanh toán'}
                                    <Send size={17} />
                                </button>
                            )}
                        </div>
                    </main>

                    <SummaryCard bookingData={bookingData} />
                </div>
            </div>
        </div>
    );
}