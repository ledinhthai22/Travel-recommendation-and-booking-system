import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import SelectField from '~/components/UI/Form/SelectField';
import {
    User,
    Mail,
    Phone,
    MapPin,
    CalendarDays,
    Clock,
    Star,
    Edit3,
    ShieldCheck,
    CheckCircle2,
    AlertTriangle,
    Camera,
    MessageSquareText,
    Plane,
    CreditCard,
    Heart,
    ChevronRight,
    Search,
    BadgeCheck,
    BookOpen,
    Filter
} from 'lucide-react';
import InputField from '~/components/UI/Form/InputField';

const userProfile = {
    id: 1,
    fullName: 'Nguyễn Minh Anh',
    email: 'minhanh@example.com',
    phone: '0901 234 567',
    address: 'Quận 1, TP. Hồ Chí Minh',
    avatar: 'https://i.pravatar.cc/200?img=32',
    joinedAt: '2024-08-15',
    rank: 'Gold Member',
    totalTrips: 8,
    totalReviews: 5,
    totalSpent: 28600000,
};

const tourHistory = [
    {
        id: 101,
        tourName: 'Khám phá Đà Lạt mộng mơ',
        destination: 'Đà Lạt, Lâm Đồng',
        image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
        startDate: '2026-02-10',
        duration: '3 ngày 2 đêm',
        guests: 2,
        status: 'completed',
        paymentStatus: 'paid',
        totalPrice: 6980000,
        bookingCode: 'LR-T00101',
    },
    {
        id: 102,
        tourName: 'Nha Trang biển xanh',
        destination: 'Nha Trang, Khánh Hòa',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
        startDate: '2026-03-18',
        duration: '3 ngày 2 đêm',
        guests: 4,
        status: 'upcoming',
        paymentStatus: 'deposit',
        totalPrice: 15560000,
        bookingCode: 'LR-T00102',
    },
    {
        id: 103,
        tourName: 'Phú Quốc nghỉ dưỡng',
        destination: 'Phú Quốc, Kiên Giang',
        image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=900&q=80',
        startDate: '2025-12-20',
        duration: '4 ngày 3 đêm',
        guests: 2,
        status: 'completed',
        paymentStatus: 'paid',
        totalPrice: 10580000,
        bookingCode: 'LR-T00103',
    },
];

const myReviews = [
    {
        id: 1,
        tourName: 'Khám phá Đà Lạt mộng mơ',
        rating: 5,
        date: '15/02/2026',
        content:
            'Tour tổ chức tốt, hướng dẫn viên nhiệt tình, khách sạn sạch sẽ. Lịch trình hợp lý, không quá gấp.',
        status: 'published',
    },
    {
        id: 2,
        tourName: 'Phú Quốc nghỉ dưỡng',
        rating: 4,
        date: '25/12/2025',
        content:
            'Resort đẹp, biển sạch, đồ ăn ổn. Tuy nhiên thời gian tự do hơi ít so với mong muốn.',
        status: 'published',
    },
];

const realityReports = [
    {
        id: 1,
        tourName: 'Phú Quốc nghỉ dưỡng',
        type: 'Khách sạn',
        title: 'Phòng nhận ban đầu không đúng hướng view đã tư vấn',
        description:
            'Khi nhận phòng, view phòng không giống thông tin tư vấn ban đầu. Sau khi phản ánh, nhân viên đã hỗ trợ đổi phòng.',
        status: 'resolved',
        createdAt: '26/12/2025',
    },
    {
        id: 2,
        tourName: 'Nha Trang biển xanh',
        type: 'Lịch trình',
        title: 'Yêu cầu xác nhận lại thời gian đón trước ngày đi',
        description:
            'Khách muốn kiểm tra lại giờ đón tại điểm hẹn để chủ động chuẩn bị hành lý.',
        status: 'pending',
        createdAt: '10/03/2026',
    },
];

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

function RatingStars({ value = 5 }) {
    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, index) => (
                <Star
                    key={index}
                    size={15}
                    className={
                        index < Math.round(value)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                    }
                />
            ))}
        </div>
    );
}

function StatusBadge({ status }) {
    const config = {
        completed: {
            label: 'Đã hoàn thành',
            className: 'bg-emerald-50 text-emerald-600',
        },
        upcoming: {
            label: 'Sắp khởi hành',
            className: 'bg-blue-50 text-blue-600',
        },
        cancelled: {
            label: 'Đã hủy',
            className: 'bg-red-50 text-red-500',
        },
        paid: {
            label: 'Đã thanh toán',
            className: 'bg-emerald-50 text-emerald-600',
        },
        deposit: {
            label: 'Đã đặt cọc',
            className: 'bg-amber-50 text-amber-600',
        },
        published: {
            label: 'Đã hiển thị',
            className: 'bg-emerald-50 text-emerald-600',
        },
        pending: {
            label: 'Đang xử lý',
            className: 'bg-amber-50 text-amber-600',
        },
        resolved: {
            label: 'Đã xử lý',
            className: 'bg-emerald-50 text-emerald-600',
        },
    };

    const item = config[status] || {
        label: status,
        className: 'bg-slate-100 text-slate-500',
    };

    return (
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${item.className}`}>
            {item.label}
        </span>
    );
}

function StatCard({ icon: Icon, label, value, sub }) {
    return (
        <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <Icon size={23} />
                </div>

                <div>
                    <p className="text-2xl font-black text-slate-900">
                        {value}
                    </p>
                    <p className="text-sm font-semibold text-slate-700">
                        {label}
                    </p>
                    {sub && (
                        <p className="text-xs text-slate-400">
                            {sub}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
function ProfileSidebar({ user, tabs, activeTab, setActiveTab }) {
    return (
        <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-3xl bg-slate-100">
                        <img
                            src={user.avatar}
                            alt={user.fullName}
                            className="h-full w-full object-cover"
                        />

                        <button
                            type="button"
                            className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm transition hover:text-blue-600"
                        >
                            <Camera size={14} />
                        </button>
                    </div>

                    <div className="min-w-0">
                        <h1 className="truncate text-xl font-black text-slate-900">
                            {user.fullName}
                        </h1>

                        <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
                            <BadgeCheck size={14} />
                            {user.rank}
                        </div>
                    </div>
                </div>

                <div className="mt-5 space-y-2 rounded-3xl bg-slate-50 p-4 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                        <Mail size={15} className="text-blue-600" />
                        <span className="truncate">{user.email}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Phone size={15} className="text-blue-600" />
                        <span>{user.phone}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <MapPin size={15} className="text-blue-600" />
                        <span className="truncate">{user.address}</span>
                    </div>
                </div>

                <button
                    type="button"
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                >
                    <Edit3 size={16} />
                    Cập nhật hồ sơ
                </button>
            </div>

            <nav className="mt-5 flex gap-2 overflow-x-auto rounded-[2rem] border border-slate-100 bg-white p-2 shadow-sm lg:block lg:space-y-1 lg:overflow-visible">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const active = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex shrink-0 items-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold transition lg:w-full lg:justify-between ${
                                active
                                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'
                            }`}
                        >
                            <span className="flex items-center gap-2">
                                <Icon size={17} />
                                {tab.label}
                            </span>

                            {active && (
                                <ChevronRight
                                    size={16}
                                    className="hidden lg:block"
                                />
                            )}
                        </button>
                    );
                })}
            </nav>
        </aside>
    );
}

function PageSection({ title, description, action, children }) {
    return (
        <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                        {title}
                    </h2>

                    {description && (
                        <p className="mt-1 text-sm leading-6 text-slate-500">
                            {description}
                        </p>
                    )}
                </div>

                {action}
            </div>

            {children}
        </section>
    );
}

function OverviewTab({ user }) {
    const nextTour = tourHistory.find((tour) => tour.status === 'upcoming');
    const latestTours = tourHistory.slice(0, 3);

    return (
        <div className="space-y-6">
            <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm md:p-6">
                <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900">
                            Tổng quan tài khoản
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Theo dõi nhanh hành trình, chi tiêu và hoạt động gần đây.
                        </p>
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-3xl bg-slate-50 p-5">
                        <p className="text-sm text-slate-400">Tour đã đặt</p>
                        <p className="mt-2 text-3xl font-black text-slate-900">
                            {user.totalTrips}
                        </p>
                    </div>

                    <div className="rounded-3xl bg-slate-50 p-5">
                        <p className="text-sm text-slate-400">Đánh giá</p>
                        <p className="mt-2 text-3xl font-black text-slate-900">
                            {user.totalReviews}
                        </p>
                    </div>

                    <div className="rounded-3xl bg-blue-50 p-5">
                        <p className="text-sm text-blue-500">Tổng chi tiêu</p>
                        <p className="mt-2 text-2xl font-black text-blue-700">
                            {formatCurrency(user.totalSpent)}
                        </p>
                    </div>

                    <div className="rounded-3xl bg-slate-50 p-5">
                        <p className="text-sm text-slate-400">Ưu đãi hiện có</p>
                        <p className="mt-2 text-3xl font-black text-slate-900">
                            3
                        </p>
                    </div>
                </div>
            </section>

            {nextTour && (
                <section className="overflow-hidden rounded-[2rem] border border-blue-100 bg-white shadow-sm">
                    <div className="grid gap-0 lg:grid-cols-[320px_1fr]">
                        <img
                            src={nextTour.image}
                            alt={nextTour.tourName}
                            className="h-64 w-full object-cover lg:h-full"
                        />

                        <div className="p-5 md:p-6">
                            <div className="mb-3 flex flex-wrap gap-2">
                                <StatusBadge status={nextTour.status} />
                                <StatusBadge status={nextTour.paymentStatus} />
                            </div>

                            <p className="text-sm font-bold uppercase tracking-[2px] text-blue-600">
                                Chuyến đi sắp tới
                            </p>

                            <h3 className="mt-2 text-2xl font-black text-slate-900">
                                {nextTour.tourName}
                            </h3>

                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                <p className="flex items-center gap-2 text-sm text-slate-500">
                                    <MapPin size={16} className="text-blue-600" />
                                    {nextTour.destination}
                                </p>

                                <p className="flex items-center gap-2 text-sm text-slate-500">
                                    <CalendarDays size={16} className="text-blue-600" />
                                    {formatDate(nextTour.startDate)}
                                </p>

                                <p className="flex items-center gap-2 text-sm text-slate-500">
                                    <Clock size={16} className="text-blue-600" />
                                    {nextTour.duration}
                                </p>

                                <p className="flex items-center gap-2 text-sm text-slate-500">
                                    <User size={16} className="text-blue-600" />
                                    {nextTour.guests} khách
                                </p>
                            </div>

                            <Link
                                to={`/tours/${nextTour.id}`}
                                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                            >
                                Xem chi tiết tour
                                <ChevronRight size={16} />
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm md:p-6">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black text-slate-900">
                            Hoạt động gần đây
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Các booking mới nhất của bạn.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => {}}
                        className="hidden text-sm font-bold text-blue-600 hover:text-blue-700 sm:block"
                    >
                        Xem tất cả
                    </button>
                </div>

                <div className="divide-y divide-slate-100">
                    {latestTours.map((tour) => (
                        <CompactTourRow key={tour.id} tour={tour} />
                    ))}
                </div>
            </section>
        </div>
    );
}
function PersonalInfoTab({ user }) {
    const fields = [
        { label: 'Họ và tên', value: user.fullName, icon: User },
        { label: 'Email', value: user.email, icon: Mail },
        { label: 'Số điện thoại', value: user.phone, icon: Phone },
        { label: 'Địa chỉ', value: user.address, icon: MapPin },
        { label: 'Ngày tham gia', value: formatDate(user.joinedAt), icon: CalendarDays },
        { label: 'Hạng thành viên', value: user.rank, icon: ShieldCheck },
    ];

    return (
        <PageSection
            title="Thông tin cá nhân"
            description="Quản lý thông tin liên hệ và thông tin tài khoản."
            action={
                <button className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-blue-500 hover:text-blue-600">
                    Cập nhật
                </button>
            }
        >
            <div className="divide-y divide-slate-100">
                {fields.map((field) => {
                    const Icon = field.icon;

                    return (
                        <div
                            key={field.label}
                            className="flex items-center justify-between gap-4 py-4"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-blue-600">
                                    <Icon size={18} />
                                </div>

                                <p className="text-sm text-slate-500">
                                    {field.label}
                                </p>
                            </div>

                            <p className="text-right text-sm font-bold text-slate-800">
                                {field.value}
                            </p>
                        </div>
                    );
                })}
            </div>
        </PageSection>
    );
}

function CompactTourRow({ tour }) {
    return (
        <div className="grid gap-4 py-5 md:grid-cols-[120px_1fr_auto] md:items-center">
            <img
                src={tour.image}
                alt={tour.tourName}
                className="h-28 w-full rounded-2xl object-cover md:h-24 md:w-32"
            />

            <div>
                <div className="mb-2 flex flex-wrap gap-2">
                    <StatusBadge status={tour.status} />
                    <StatusBadge status={tour.paymentStatus} />
                </div>

                <h3 className="font-bold text-slate-900">
                    {tour.tourName}
                </h3>

                <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5">
                        <MapPin size={14} />
                        {tour.destination}
                    </span>

                    <span className="flex items-center gap-1.5">
                        <CalendarDays size={14} />
                        {formatDate(tour.startDate)}
                    </span>

                    <span className="flex items-center gap-1.5">
                        <User size={14} />
                        {tour.guests} khách
                    </span>
                </div>
            </div>

            <div className="flex flex-col items-start gap-3 md:items-end">
                <p className="font-bold text-blue-600">
                    {formatCurrency(tour.totalPrice)}
                </p>

                <Link
                    to={`/tours/${tour.id}`}
                    className="inline-flex items-center gap-1 text-sm font-bold text-slate-500 transition hover:text-blue-600"
                >
                    Chi tiết
                    <ChevronRight size={14} />
                </Link>
            </div>
        </div>
    );
}

function TourHistoryTab() {
    const STATUS_OPTIONS = [
        { value: 'all', label: 'Tất cả' },
        { value: 'upcoming', label: 'Sắp khởi hành' },
        { value: 'completed', label: 'Đã hoàn thành' },
        { value: 'cancelled', label: 'Đã hủy' },
    ];
    const [status, setStatus] = useState('all');
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        return tourHistory.filter((tour) => {
            const matchSearch =
                !search ||
                tour.tourName.toLowerCase().includes(search.toLowerCase()) ||
                tour.destination.toLowerCase().includes(search.toLowerCase());

            const matchStatus = status === 'all' || tour.status === status;

            return matchSearch && matchStatus;
        });
    }, [status, search]);

    return (
        <PageSection
            title="Lịch sử tour"
            description="Theo dõi các tour đã đi, sắp đi và trạng thái thanh toán."
        >
            <div className="mb-4 flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <Search
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <InputField
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Tìm tour..."
                        className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500"
                    />
                </div>

                <div className="w-full sm:w-56">
                    <SelectField
                        value={status}
                        onChange={setStatus}
                        options={STATUS_OPTIONS}
                        placeholder="Chọn trạng thái"
                    />
                </div>
            </div>

            <div className="divide-y divide-slate-100">
                {filtered.map((tour) => (
                    <CompactTourRow key={tour.id} tour={tour} />
                ))}
            </div>
        </PageSection>
    );
}

function ReviewsTab() {
    return (
        <PageSection
            title="Đánh giá của tôi"
            description="Các đánh giá bạn đã gửi sau khi trải nghiệm tour."
        >
            <div className="divide-y divide-slate-100">
                {myReviews.map((review) => (
                    <div key={review.id} className="py-5">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <h3 className="font-bold text-slate-900">
                                    {review.tourName}
                                </h3>
                                <p className="mt-1 text-xs text-slate-400">
                                    {review.date}
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <RatingStars value={review.rating} />
                                <StatusBadge status={review.status} />
                            </div>
                        </div>

                        <p className="mt-3 text-sm leading-6 text-slate-600">
                            {review.content}
                        </p>

                        <div className="mt-3 flex gap-4">
                            <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                                Chỉnh sửa
                            </button>
                            <button className="text-sm font-semibold text-red-500 hover:text-red-600">
                                Xóa
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </PageSection>
    );
}

function RealityReportsTab() {
    return (
        <PageSection
            title="Phản hồi thực tế"
            description="Theo dõi phản ánh về chất lượng dịch vụ so với thông tin đã tư vấn."
            action={
                <button className="inline-flex w-fit items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700">
                    Gửi phản hồi mới
                    <MessageSquareText size={16} />
                </button>
            }
        >
            <div className="divide-y divide-slate-100">
                {realityReports.map((report) => (
                    <div key={report.id} className="py-5">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <div className="mb-2 flex flex-wrap gap-2">
                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                                        {report.type}
                                    </span>
                                    <StatusBadge status={report.status} />
                                </div>

                                <h3 className="font-bold text-slate-900">
                                    {report.title}
                                </h3>

                                <p className="mt-1 text-xs text-slate-400">
                                    {report.tourName} • {report.createdAt}
                                </p>
                            </div>

                            {report.status === 'resolved' ? (
                                <CheckCircle2 className="text-emerald-500" size={22} />
                            ) : (
                                <AlertTriangle className="text-amber-500" size={22} />
                            )}
                        </div>

                        <p className="mt-3 text-sm leading-6 text-slate-600">
                            {report.description}
                        </p>

                        <button className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-700">
                            Xem chi tiết xử lý
                        </button>
                    </div>
                ))}
            </div>
        </PageSection>
    );
}

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState('overview');

    const tabs = [
        { id: 'overview', label: 'Tổng quan', icon: BookOpen },
        { id: 'personal', label: 'Thông tin cá nhân', icon: User },
        { id: 'history', label: 'Lịch sử tour', icon: Plane },
        { id: 'reviews', label: 'Đánh giá', icon: Star },
        { id: 'reports', label: 'Phản hồi thực tế', icon: AlertTriangle },
    ];

    return (
        <div className="min-h-screen bg-slate-50 pt-24">
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 pb-10 md:px-8 lg:grid-cols-[320px_1fr]">
                <ProfileSidebar
                    user={userProfile}
                    tabs={tabs}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />

                <main>
                    {activeTab === 'overview' && <OverviewTab user={userProfile} />}
                    {activeTab === 'personal' && <PersonalInfoTab user={userProfile} />}
                    {activeTab === 'history' && <TourHistoryTab />}
                    {activeTab === 'reviews' && <ReviewsTab />}
                    {activeTab === 'reports' && <RealityReportsTab />}
                </main>
            </div>
        </div>
    );
}