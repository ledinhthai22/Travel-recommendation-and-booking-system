import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, X, CreditCard, Banknote, ArrowRight, Star } from "lucide-react";
import CheckoutStep from "~/components/Checkout/CheckoutStep";
import ContactForm from "~/components/Checkout/ContactForm";
import PassengerForm from "~/components/Checkout/PassengerForm";
import PassengerDetailsForm from "~/components/Checkout/PassengerDetailsForm";
import TourSummaryCard from "~/components/Checkout/TourSummaryCard";
import InputField from "~/components/UI/Form/InputField";
import Loading from "~/components/Common/Loading";
import { formatCurrency } from "~/Helper/FormatCurrency";
import { toastError, toastSuccess } from "~/utils/Toast";
import { getErrorMessage } from "~/utils/errorHelper";
import {
    createBookingClientApi,
    reserveSeatsApi,
} from "~/Services/TourBookingService";
import useAuth from "~/Hooks/useAuth";

import { useNavigate } from 'react-router-dom';
import { releaseReservationApi } from '~/Services/TourBookingService';
const ORDER_PAYMENT_STATUS = {
    CHUA_THANH_TOAN: 0,
    DA_THANH_TOAN_OFFLINE: 1,
    DA_THANH_TOAN_VNPAY: 2,
};

const PAYMENT_METHOD = {
    VNPAY: 1,
    TIEN_MAT: 2,
    CHUYEN_KHOAN: 3,
};

const TRANSACTION_STATUS = {
    CHO: 0,
    THANH_CONG: 1,
    THAT_BAI: 2,
    HOAN_TIEN: 3,
};


function formatDate(dateString) {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("vi-VN");
}

function renderStars(soSao) {
    if (!soSao) return null;
    return (
        <span className="flex items-center gap-0.5">
            {Array.from({ length: soSao }).map((_, i) => (
                <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
            ))}
        </span>
    );
}


export default function CheckoutPage() {
    const [step, setStep] = useState(1);
    const [success, setSuccess] = useState(false);

    const [bookingData, setBookingData] = useState(null);
    const [passengerDetails, setPassengerDetails] = useState({});
    const [singleRooms, setSingleRooms] = useState({});
    const [contactErrors, setContactErrors] = useState({});
    const [passengerErrors, setPassengerErrors] = useState({});
    const navigate = useNavigate();
    const [contact, setContact] = useState({
        fullName: "",
        phone: "",
        email: "",
        address: "",
    });

    const [passengers, setPassengers] = useState({
        adults: 1,
        children: 0,
        toddlers: 0,
    });

    const [promoCode, setPromoCode] = useState("");
    const [note, setNote] = useState("");
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHOD.VNPAY);
    const [vnpayLoading, setVnpayLoading] = useState(false);
    const [holdId, setHoldId] = useState(null);

    const { user } = useAuth();


    useEffect(() => {
        const data = sessionStorage.getItem("bookingData");
        if (data) {
            const parsed = JSON.parse(data);
            setBookingData(parsed);
            setPassengers(parsed.passengers ?? { adults: 1, children: 0, toddlers: 0 });
        }
    }, []);

    useEffect(() => {
        setSingleRooms((prev) => {
            const next = {};
            ["adults", "children", "toddlers"].forEach((type) => {
                for (let i = 0; i < passengers[type]; i++) {
                    const key = `${type}-${i}`;
                    if (prev[key]) next[key] = true;
                }
            });
            const unchanged =
                Object.keys(prev).length === Object.keys(next).length &&
                Object.keys(next).every((k) => prev[k] === next[k]);
            return unchanged ? prev : next;
        });
    }, [passengers]);


    const singleRoomCount = useMemo(
        () => Object.values(singleRooms).filter(Boolean).length,
        [singleRooms]
    );

    const totalPrice = useMemo(() => {
        if (!bookingData) return 0;
        const { giaNguoiLon = 0, giaTreEm = 0, giaEmBe = 0, phuThuPhongDon = 0 } =
            bookingData?.gia ?? {};
        return (
            passengers.adults * giaNguoiLon +
            passengers.children * giaTreEm +
            passengers.toddlers * giaEmBe +
            singleRoomCount * phuThuPhongDon
        );
    }, [bookingData, passengers, singleRoomCount]);

    const passengerList = useMemo(
        () =>
            Object.entries(passengerDetails).map(([key, p]) => ({
                key,
                ...p,
                singleRoom: singleRooms[key] || false,
            })),
        [passengerDetails, singleRooms]
    );




    const validate = () => {
        let valid = true;
        const contactErr = {};
        const passengerErr = {};

        if (!contact.fullName.trim()) contactErr.fullName = "Vui lòng nhập họ tên";
        if (!contact.phone.trim()) contactErr.phone = "Vui lòng nhập số điện thoại";
        else if (!/^0\d{9}$/.test(contact.phone)) contactErr.phone = "Số điện thoại không hợp lệ";
        if (!contact.email.trim()) contactErr.email = "Vui lòng nhập email";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) contactErr.email = "Email không hợp lệ";
        if (!contact.address.trim()) contactErr.address = "Vui lòng nhập địa chỉ";

        const checkPassenger = (key) => {
            const p = passengerDetails[key] ?? {};
            const err = {};
            if (!p.fullName?.trim()) err.fullName = "Nhập họ tên";
            if (!p.dob) err.dob = "Chọn ngày sinh";
            if (p.phone && !/^0\d{9}$/.test(p.phone)) err.phone = "SĐT không hợp lệ";
            if (Object.keys(err).length > 0) {
                passengerErr[key] = err;
                valid = false;
            }
        };

        for (let i = 0; i < passengers.adults; i++) checkPassenger(`adults-${i}`);
        for (let i = 0; i < passengers.children; i++) checkPassenger(`children-${i}`);
        for (let i = 0; i < passengers.toddlers; i++) checkPassenger(`toddlers-${i}`);

        if (Object.keys(contactErr).length > 0) valid = false;

        setContactErrors(contactErr);
        setPassengerErrors(passengerErr);

        if (!valid) {
            setTimeout(() => {
                const el = document.querySelector("[data-error='true']");
                if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 50);
        }

        return valid;
    };



    const buildPassengerList = () =>
        Object.entries(passengerDetails).map(([key, value]) => {
            let loaiKhach = 1;
            if (key.startsWith("children")) loaiKhach = 2;
            if (key.startsWith("toddlers")) loaiKhach = 3;
            return {
                hoTen: value.fullName,
                soDienThoai: value.phone || "",
                email: contact.email,
                ngaySinh: value.dob,
                gioiTinh: value.gender === "Nam",
                loaiKhach,
                phongDon: singleRooms[key] || false,
            };
        });

    const buildBookingDto = () => ({
        maChuyen: bookingData.maChuyen,
        maUuDai: null,
        soNguoiLon: passengers.adults,
        soTreEm: passengers.children,
        soEmBe: passengers.toddlers,
        ghiChu: note,
        danhSachHanhKhach: buildPassengerList(),
    });



    const handleSubmit = async () => {
        if (!validate()) return;
        try {
            const storedUser = JSON.parse(localStorage.getItem("user"));
            const reserve = await reserveSeatsApi(storedUser.maNguoiDung, {
                maChuyen: bookingData.maChuyen,
                soNguoiLon: passengers.adults,
                soTreEm: passengers.children,
                soEmBe: passengers.toddlers,
            });
            setHoldId(reserve.data.maGiuCho);
            setStep(2);
        } catch {
            toastError("Không thể giữ chỗ", getErrorMessage(err));
        }
    };


    const handleBack = async () => {
        if (step === 2) {
            // Hủy chỗ giữ rồi về step 1
            if (holdId) {
                try {
                    const storedUser = JSON.parse(localStorage.getItem("user"));
                    await releaseReservationApi(storedUser.maNguoiDung, holdId);
                } catch {

                }
                setHoldId(null);
            }
            setStep(1);
        } else {
            const slug = bookingData?.slug;
            if (slug) navigate(`/Cac-chuyen-di/${slug }`);
            else navigate(-1);
        }
    };
    const handleConfirmPayment = async () => {
        if (!holdId || !bookingData) {
            toastError("Phiên giữ chỗ không hợp lệ. Vui lòng thử lại từ đầu.");
            return;
        }

        if (paymentMethod === PAYMENT_METHOD.TIEN_MAT || paymentMethod === PAYMENT_METHOD.CHUYEN_KHOAN) {
            try {
                const storedUser = JSON.parse(localStorage.getItem("user"));
                await createBookingClientApi(storedUser.maNguoiDung, buildBookingDto(), holdId);
                setShowPaymentModal(false);
                setSuccess(true);
                toastSuccess("Đặt tour thành công", "Chúng tôi sẽ liên hệ xác nhận với bạn sớm nhất.");
            } catch {
                toastError("Tạo đơn thất bại", getErrorMessage(err));
            }
            return;
        }

        if (paymentMethod === PAYMENT_METHOD.VNPAY) {
            setVnpayLoading(true);
            const paymentPayload = {
                maGiuCho: holdId,
                maChuyen: bookingData.maChuyen,
                maCodeChuyen: bookingData.maCodeChuyen,
                soNguoiLon: passengers.adults,
                soTreEm: passengers.children,
                soEmBe: passengers.toddlers,
                maUuDai: null,
                ghiChu: note,
                danhSachHanhKhach: buildPassengerList(),
            };
            try {
                const res = await fetch(
                    "https://localhost:7016/api/client/payment/create-payment",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(paymentPayload),
                    }
                );
                const data = await res.json();
                if (!data.paymentUrl) {
                    toastError("Lỗi cổng thanh toán VNPay", "Không tạo được liên kết thanh toán. Vui lòng thử lại.");
                    return;
                }
                window.location.href = data.paymentUrl;
            } catch {
                toastError("Lỗi kết nối", "Không thể kết nối tới cổng thanh toán VNPay.");
            } finally {
                setVnpayLoading(false);
            }
        }
    };

    if (!bookingData) return <Loading />;

    if (success) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle2 size={40} className="text-green-600" />
                    </div>
                    <h2 className="mt-5 text-3xl font-bold">Đặt tour thành công!</h2>
                    <p className="mt-3 text-slate-500">Chúng tôi sẽ liên hệ xác nhận với bạn sớm nhất.</p>
                    <Link
                        to="/"
                        className="mt-6 inline-block rounded-xl bg-sky-500 px-6 py-3 font-semibold text-white hover:bg-sky-600 transition"
                    >
                        Về trang chủ
                    </Link>
                </div>
            </div>
        );
    }


    return (
        <div>
            <div className="mx-auto max-w-[1440px] px-7 mt-30">
                <CheckoutStep step={step} onBack={handleBack} />

                <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
                    <div className="space-y-6 lg:col-span-8">
                        {step === 1 && (
                            <>
                                <ContactForm
                                    contact={contact}
                                    onChange={(e) => {
                                        const { name, value } = e.target;
                                        setContact((prev) => ({ ...prev, [name]: value }));
                                    }}
                                    errors={contactErrors}
                                />
                                <PassengerForm
                                    passengers={passengers}
                                    onChange={(type, value) =>
                                        setPassengers((prev) => ({ ...prev, [type]: value }))
                                    }
                                />
                                <PassengerDetailsForm
                                    passengers={passengers}
                                    singleRooms={singleRooms}
                                    onToggleSingleRoom={(key) =>
                                        setSingleRooms((prev) => ({ ...prev, [key]: !prev[key] }))
                                    }
                                    bookingData={bookingData}
                                    details={passengerDetails}
                                    setDetails={setPassengerDetails}
                                    errors={passengerErrors}
                                />

                                <div className="rounded-3xl bg-white p-6 shadow-sm">
                                    <h2 className="mb-4 text-xl font-bold text-slate-900">Mã ưu đãi</h2>
                                    <div className="flex items-center gap-3">
                                        <div className="min-w-0 flex-1">
                                            <InputField
                                                value={promoCode}
                                                onChange={(e) => setPromoCode(e.target.value)}
                                                placeholder="Nhập mã giảm giá"
                                            />
                                        </div>
                                        <button className="rounded-2xl bg-sky-500 px-8 py-3 font-medium text-white hover:bg-sky-600 transition">
                                            Áp dụng
                                        </button>
                                    </div>
                                </div>

                                <div className="mb-10 rounded-3xl bg-white p-6 shadow-sm">
                                    <h2 className="mb-4 text-xl font-bold text-slate-900">Ghi chú</h2>
                                    <textarea
                                        rows={4}
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        placeholder="Nhập ghi chú cho đơn hàng..."
                                        className="w-full rounded-2xl border border-slate-300 p-4 outline-none focus:border-sky-400 resize-none"
                                    />
                                </div>
                            </>
                        )}

                        {step === 2 && (
                            <div className="space-y-6">
                                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                                    <div className="flex items-center justify-between mb-5">
                                        <h2 className="text-xl font-bold">Thông tin liên lạc</h2>
                                        <button
                                            onClick={() => setStep(1)}
                                            className="text-sm font-medium text-sky-500 hover:underline"
                                        >
                                            Chỉnh sửa
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-3 gap-6">
                                        <InfoCell label="Họ tên" value={contact.fullName} />
                                        <InfoCell label="Email" value={contact.email} />
                                        <InfoCell label="Số điện thoại" value={contact.phone} />
                                    </div>
                                    {note && (
                                        <div className="mt-4">
                                            <InfoCell label="Ghi chú" value={note} />
                                        </div>
                                    )}
                                </div>

                                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                                    <h2 className="mb-5 text-xl font-bold">Chi tiết đơn đặt tour</h2>
                                    <div className="space-y-3 text-sm">
                                        <SummaryRow label="Tên tour" value={bookingData.tenTour || "—"} />
                                        <SummaryRow label="Mã chuyến đi" value={bookingData.maChuyenCode || "—"} />
                                        <SummaryRow label="Ngày khởi hành" value={formatDate(bookingData.ngayKhoiHanh)} />
                                        <SummaryRow label="Ngày Kết thúc" value={formatDate(bookingData.ngayKetThuc)} />
                                        <SummaryRow
                                            label="Trị giá đơn đặt"
                                            value={
                                                <span className="font-bold text-sky-600">
                                                    {formatCurrency(totalPrice)}
                                                </span>
                                            }
                                        />
                                        <SummaryRow
                                            label="Tình trạng thanh toán"
                                            value={
                                                <span className="inline-block rounded-md bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                                                    Chờ thanh toán
                                                </span>
                                            }
                                        />
                                    </div>
                                </div>


                                <div className="rounded-3xl mb-20 border border-slate-200 bg-white p-6 shadow-sm">
                                    <h2 className="mb-5 text-xl font-bold">Danh sách hành khách</h2>
                                    {passengerList.length === 0 ? (
                                        <p className="text-sm italic text-slate-400">
                                            Chưa điền thông tin chi tiết hành khách.
                                        </p>
                                    ) : (
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-slate-100 text-left text-slate-500">
                                                    <th className="pb-2 font-medium">#</th>
                                                    <th className="pb-2 font-medium">Họ tên</th>
                                                    <th className="pb-2 font-medium">Ngày sinh</th>
                                                    <th className="pb-2 font-medium">Giới tính</th>
                                                    <th className="pb-2 font-medium">Loại khách</th>
                                                    <th className="pb-2 font-medium">Phòng đơn</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {passengerList.map((p, index) => {
                                                    const typeLabel = p.key.startsWith("adults")
                                                        ? "Người lớn"
                                                        : p.key.startsWith("children")
                                                            ? "Trẻ em"
                                                            : "Em bé";
                                                    return (
                                                        <tr key={p.key} className="border-t border-slate-100">
                                                            <td className="py-3 text-slate-400">#{index + 1}</td>
                                                            <td className="py-3 font-medium">{p.fullName || "—"}</td>
                                                            <td className="py-3 text-slate-600">
                                                                {p.dob ? formatDate(p.dob) : "—"}
                                                            </td>
                                                            <td className="py-3 text-slate-600">{p.gender || "—"}</td>
                                                            <td className="py-3">
                                                                <PassengerTypeBadge label={typeLabel} />
                                                            </td>
                                                            <td className="py-3">
                                                                {p.singleRoom ? (
                                                                    <span className="text-emerald-600 font-medium">Có</span>
                                                                ) : (
                                                                    <span className="text-slate-400">Không</span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-4">
                        <TourSummaryCard
                            bookingData={{ ...bookingData, totalPrice }}
                            passengers={passengers}
                            singleRoomCount={singleRoomCount}
                            step={step}
                            setShowPaymentModal={setShowPaymentModal}
                            onSubmit={handleSubmit}
                        />
                    </div>
                </div>
            </div>

            {showPaymentModal && (
                <PaymentModal
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                    vnpayLoading={vnpayLoading}
                    totalPrice={totalPrice}
                    onClose={() => setShowPaymentModal(false)}
                    onConfirm={handleConfirmPayment}
                />
            )}
        </div>
    );
}


function InfoCell({ label, value }) {
    return (
        <div>
            <p className="text-sm text-slate-500">{label}</p>
            <p className="font-medium text-slate-800">{value || "—"}</p>
        </div>
    );
}

function SummaryRow({ label, value }) {
    return (
        <div className=" gap-4">
            <span className="text-slate-500 shrink-0">{label}:</span>
            <span> {value}</span>
        </div>
    );
}

function PassengerTypeBadge({ label }) {
    const styles = {
        "Người lớn": "bg-slate-100 text-slate-700",
        "Trẻ em": "bg-orange-50 text-orange-700",
        "Em bé": "bg-pink-50 text-pink-700",
    };
    return (
        <span className={`rounded px-2 py-0.5 text-xs font-semibold ${styles[label] ?? "bg-slate-100 text-slate-600"}`}>
            {label}
        </span>
    );
}

function PaymentModal({ paymentMethod, setPaymentMethod, vnpayLoading, totalPrice, onClose, onConfirm }) {
    const options = [
        {
            value: PAYMENT_METHOD.VNPAY,
            label: "Thanh toán trực tuyến qua VNPay",
            desc: "Hệ thống sẽ chuyển hướng bạn sang cổng thanh toán an toàn của VNPay để hoàn tất giao dịch.",
            icon: <CreditCard size={20} className="text-sky-500" />,
        },
        {
            value: PAYMENT_METHOD.TIEN_MAT,
            label: "Tiền mặt tại quầy",
            desc: "Thanh toán trực tiếp tại văn phòng công ty. Đơn sẽ được tạo ngay sau khi xác nhận.",
            icon: <Banknote size={20} className="text-emerald-500" />,
        },
    ];

    return (
        <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl rounded-3xl bg-white shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900">Chọn hình thức thanh toán</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-3">
                    {options.map((opt) => {
                        const isSelected = paymentMethod === opt.value;
                        return (
                            <label
                                key={opt.value}
                                className={`w-full text-left rounded-2xl border p-4 transition-all cursor-pointer flex items-center gap-3 ${isSelected
                                    ? "border-sky-500 bg-sky-50/60 ring-1 ring-sky-200"
                                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value={opt.value}
                                    checked={isSelected}
                                    onChange={() => setPaymentMethod(opt.value)}
                                    className="w-3 h-3 shrink-0 appearance-none rounded-full border-2 border-slate-300 checked:border-sky-500 checked:bg-sky-500 transition-colors cursor-pointer
                                    relative after:content-[''] after:absolute after:inset-0 after:m-auto after:w-1.5 after:h-1.5 after:rounded-full after:bg-white"
                                />


                                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${isSelected ? "bg-white shadow-sm" : "bg-slate-100"
                                    }`}>
                                    {opt.icon}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-slate-800 text-sm">{opt.label}</p>
                                    {isSelected && (
                                        <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">
                                            {opt.desc}
                                        </p>
                                    )}
                                </div>
                            </label>
                        );
                    })}
                </div>

                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4">
                    <div>
                        <p className="text-xs text-slate-400">Tổng thanh toán</p>
                        <p className="text-lg font-extrabold text-sky-600">{formatCurrency(totalPrice)}</p>
                        {vnpayLoading && (
                            <p className="text-xs text-slate-400 animate-pulse mt-0.5">
                                Đang kết nối VNPay...
                            </p>
                        )}
                    </div>
                    <button
                        onClick={onConfirm}
                        disabled={vnpayLoading}
                        className="rounded-full bg-sky-500 px-8 py-3 font-semibold text-white shadow-md hover:bg-sky-600 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {vnpayLoading ? "Đang xử lý..." : "Xác nhận thanh toán"}
                        {!vnpayLoading}
                    </button>
                </div>
            </div>
        </div>
    );
}   