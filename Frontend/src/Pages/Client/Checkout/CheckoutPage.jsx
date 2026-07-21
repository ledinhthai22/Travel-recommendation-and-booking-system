import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, CreditCard, Banknote, AlertCircle } from "lucide-react";
import CheckoutStep from "~/components/Checkout/CheckoutStep";
import ContactForm from "~/components/Checkout/ContactForm";
import PassengerForm from "~/components/Checkout/PassengerForm";
import PassengerDetailsForm from "~/components/Checkout/PassengerDetailsForm";
import TourSummaryCard from "~/components/Checkout/TourSummaryCard";
import InputField from "~/components/UI/Form/InputField";
import Loading from "~/components/Common/Loading";
import { formatCurrency } from "~/Helper/FormatCurrency";
import { toastError, toastSuccess, toastWarning } from "~/utils/Toast";
import { getErrorMessage } from "~/utils/errorHelper";
import { createBookingClientApi, reserveSeatsApi, releaseReservationApi } from "~/Services/TourBookingService";
import useAuth from "~/Hooks/useAuth";

const PAYMENT_METHOD = { VNPAY: 1, TIEN_MAT: 2, CHUYEN_KHOAN: 3 };
const DEPOSIT_OPTIONS = [30, 50, 100];
const POLL_INTERVAL_MS = 2000;
const POLL_TIMEOUT_MS = 10 * 60 * 1000;

const ORDER_STATUS = {
    CHO_THANH_TOAN_COC: 1,
    CHO_DUYET: 2,
    DA_DUYET: 3,
    DANG_DIEN_RA: 4,
    HOAN_TAT: 5,
    CHO_XU_LY_HUY: 6,
    DA_HUY_DANG_HOAN_TIEN: 7,
    DA_HUY_DA_HOAN_TIEN: 8,
    DA_HUY_MAT_COC: 9,
    HUY_KHONG_HOAN_TIEN: 10
};

function formatDate(dateString) {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("vi-VN");
}

function calcDaysUntilDeparture(ngayKhoiHanh) {
    if (!ngayKhoiHanh) return 0;
    const departure = new Date(ngayKhoiHanh);
    const today = new Date();
    departure.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const diffTime = departure.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export default function CheckoutPage() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [step, setStep] = useState(1);
    const [bookingData, setBookingData] = useState(null);
    const [passengerDetails, setPassengerDetails] = useState({});
    const [singleRooms, setSingleRooms] = useState({});
    const [contactErrors, setContactErrors] = useState({});
    const [passengerErrors, setPassengerErrors] = useState({});
    const [contact, setContact] = useState({ fullName: "", phone: "", email: "", address: "", dob: "" });
    const [passengers, setPassengers] = useState({ adults: 1, children: 0, toddlers: 0 });
    const [promoCode, setPromoCode] = useState("");
    const [note, setNote] = useState("");
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHOD.VNPAY);
    const [depositRate, setDepositRate] = useState(100);
    const [vnpayLoading, setVnpayLoading] = useState(false);
    const [holdId, setHoldId] = useState(null);
    const [vnpayUrl, setVnpayUrl] = useState(null);
    const [txnRef, setTxnRef] = useState(null);
    const [isReserving, setIsReserving] = useState(false);
    const [activeTab, setActiveTab] = useState('me');
    const [showProfileWarning, setShowProfileWarning] = useState(false);
    const [profileMissingFields, setProfileMissingFields] = useState([]);

    useEffect(() => {
        const data = sessionStorage.getItem("bookingData");
        if (data) {
            try {
                const parsed = JSON.parse(data);
                setBookingData(parsed);
                setPassengers(parsed.passengers ?? { adults: 1, children: 0, toddlers: 0 });
            } catch (error) {
                toastError("Lỗi dữ liệu", "Không thể đọc thông tin đặt tour");
                navigate("/");
            }
        } else {
            toastWarning("Chưa có dữ liệu", "Vui lòng chọn tour trước khi đặt");
            navigate("/");
        }
    }, [navigate]);

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

    useEffect(() => {
        return () => {
            if (holdId) {
                releaseReservationApi(holdId).catch(() => {});
            }
        };
    }, [holdId]);

    const fillPassengerFromContact = useCallback((contactData) => {
        if (!contactData) return;

        const firstAdultKey = `adults-0`;
        const dob = contactData.dob || '';
        const fullName = contactData.fullName || '';
        const phone = contactData.phone || '';
        const email = contactData.email || '';

        setPassengerDetails(prev => {
            const existing = prev[firstAdultKey] || {};
            const manuallyEdited = existing.fullName && existing.isFilledFromContact === false;

            if (activeTab === 'other' && !manuallyEdited) {
                return {
                    ...prev,
                    [firstAdultKey]: {
                        ...existing,
                        fullName: fullName,
                        phone: phone,
                        email: email,
                        dob: dob,
                        gender: existing.gender || "Nam",
                        isSaved: true,
                        isAutoFilled: false,
                        isFilledFromContact: true
                    }
                };
            }
            return prev;
        });
    }, [activeTab]);

    const checkProfileComplete = () => {
        const missing = [];
        if (!contact.fullName?.trim()) missing.push("Họ tên");
        if (!contact.phone?.trim()) missing.push("Số điện thoại");
        if (!contact.email?.trim()) missing.push("Email");
        if (!contact.address?.trim()) missing.push("Địa chỉ");
        return missing;
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setContactErrors({});
        if (tab === 'other' && contact.fullName) {
            fillPassengerFromContact(contact);
        }
    };

    const handleContactChange = (e) => {
        const { name, value } = e.target;
        const updatedContact = { ...contact, [name]: value };
        setContact(updatedContact);

        if (contactErrors[name]) {
            setContactErrors((prev) => ({ ...prev, [name]: undefined }));
        }

        if (activeTab === 'other' && name !== 'address') {
            fillPassengerFromContact(updatedContact);
        }
    };

    const handleContactDateChange = (value) => {
        const updatedContact = { ...contact, dob: value };
        setContact(updatedContact);
        if (activeTab === 'other') {
            fillPassengerFromContact(updatedContact);
        }
    };

    const handleContactTabChange = (newContactData) => {
        setContact(newContactData);
        setContactErrors({});
        if (activeTab === 'other' && newContactData.fullName) {
            fillPassengerFromContact(newContactData);
        }
    };

    const handleProceed = () => {
        if (activeTab === 'me' && step === 1) {
            const missingFields = checkProfileComplete();
            if (missingFields.length > 0) {
                setProfileMissingFields(missingFields);
                setShowProfileWarning(true);
                return;
            }
        }

        if (step === 1) {
            if (validate()) {
                onSubmit();
            }
        } else if (step === 2) {
            setPaymentMethod(PAYMENT_METHOD.VNPAY);
            setDepositRate(100);
            setShowPaymentModal(true);
        }
    };

    const handleGoToProfile = () => {
        setShowProfileWarning(false);
        navigate("/Thong-Tin-Ca-Nhan", { state: { activeTab: "profile" } });
    };

    const singleRoomCount = useMemo(
        () => Object.values(singleRooms).filter(Boolean).length,
        [singleRooms]
    );

    const totalPrice = useMemo(() => {
        if (!bookingData) return 0;
        const { giaNguoiLon = 0, giaTreEm = 0, giaEmBe = 0, phuThuPhongDon = 0 } = bookingData?.gia ?? {};
        return (
            passengers.adults * giaNguoiLon +
            passengers.children * giaTreEm +
            passengers.toddlers * giaEmBe +
            singleRoomCount * phuThuPhongDon
        );
    }, [bookingData, passengers, singleRoomCount]);

    const amountDueNow = useMemo(
        () => Math.round((totalPrice * depositRate) / 100),
        [totalPrice, depositRate]
    );

    const passengerList = useMemo(
        () => Object.entries(passengerDetails).map(([key, p]) => ({
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

        if (!contact.fullName?.trim()) {
            contactErr.fullName = "Vui lòng nhập họ tên";
            valid = false;
        }
        if (!contact.phone?.trim()) {
            contactErr.phone = "Vui lòng nhập số điện thoại";
            valid = false;
        } else if (!/^0\d{9}$/.test(contact.phone)) {
            contactErr.phone = "Số điện thoại không hợp lệ";
            valid = false;
        }
        if (!contact.email?.trim()) {
            contactErr.email = "Vui lòng nhập email";
            valid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
            contactErr.email = "Email không hợp lệ";
            valid = false;
        }
        if (!contact.address?.trim()) {
            contactErr.address = "Vui lòng nhập địa chỉ";
            valid = false;
        }

        const checkPassenger = (key) => {
            const p = passengerDetails[key] ?? {};
            const err = {};

            const isFirstAdultAutoFilled = key === 'adults-0' &&
                activeTab === 'me' &&
                p.isAutoFilled === true &&
                !!p.fullName?.trim() &&
                !!p.dob;

            const isFilledFromContact = key === 'adults-0' &&
                activeTab === 'other' &&
                p.isFilledFromContact === true &&
                !!p.fullName?.trim() &&
                !!p.dob;

            if (!isFirstAdultAutoFilled && !isFilledFromContact) {
                if (!p.fullName?.trim()) {
                    err.fullName = "Nhập họ tên";
                    valid = false;
                }
                if (!p.dob) {
                    err.dob = "Chọn ngày sinh";
                    valid = false;
                }
                if (p.phone && !/^0\d{9}$/.test(p.phone)) {
                    err.phone = "SĐT không hợp lệ";
                    valid = false;
                }
            }

            if (Object.keys(err).length > 0) {
                passengerErr[key] = err;
            }
        };

        for (let i = 0; i < passengers.adults; i++) checkPassenger(`adults-${i}`);
        for (let i = 0; i < passengers.children; i++) checkPassenger(`children-${i}`);
        for (let i = 0; i < passengers.toddlers; i++) checkPassenger(`toddlers-${i}`);

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
                hoTen: value.fullName || "",
                soDienThoai: value.phone || "",
                email: contact.email || "",
                ngaySinh: value.dob || new Date().toISOString().split('T')[0],
                gioiTinh: value.gender === "Nam",
                loaiKhach,
                phongDon: singleRooms[key] || false,
            };
        });

    const buildBookingDto = (method) => ({
        maChuyen: bookingData.maChuyen,
        maUuDai: null,
        soNguoiLon: passengers.adults,
        soTreEm: passengers.children,
        soEmBe: passengers.toddlers,
        ghiChu: note || "",
        danhSachHanhKhach: buildPassengerList(),
        hoTenLienHe: contact.fullName || "",
        soDienThoaiLienHe: contact.phone || "",
        emailLienHe: contact.email || "",
        diaChiLienHe: contact.address || "",
        phuongThucThanhToan: method,
    });

    const onSubmit = async () => {
        if (!validate()) return;
        if (isReserving) return;

        setIsReserving(true);
        
        try {
            const reserveDto = {
                maChuyen: bookingData.maChuyen,
                soNguoiLon: passengers.adults || 0,
                soTreEm: passengers.children || 0,
                soEmBe: passengers.toddlers || 0,
            };

            const response = await reserveSeatsApi(reserveDto);

            if (!response || !response.maGiuCho) {
                throw new Error("Không nhận được mã giữ chỗ");
            }

            setHoldId(response.maGiuCho);
            setStep(2);
            
          
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Không thể giữ chỗ";
           
        } finally {
            setIsReserving(false);
        }
    };

    const handleBack = async () => {
        if (step === 2 && holdId) {
            try {
                await releaseReservationApi(holdId);
                toastSuccess("Đã hủy giữ chỗ", "Bạn có thể đặt lại tour sau.");
            } catch {
                console.warn("Release reservation error");
            }
            setHoldId(null);
        }
        if (step === 2) {
            setStep(1);
        } else {
            const slug = bookingData?.slug;
            if (slug) navigate(`/Cac-chuyen-di/${slug}`);
            else navigate(-1);
        }
    };

    const handleConfirmPayment = async () => {
        if (!holdId || !bookingData) {
            toastError("Lỗi phiên làm việc", "Phiên giữ chỗ không hợp lệ. Vui lòng thử lại.");
            return;
        }

        if (paymentMethod === PAYMENT_METHOD.TIEN_MAT || paymentMethod === PAYMENT_METHOD.CHUYEN_KHOAN) {
            try {
                const dto = buildBookingDto(paymentMethod);
                const response = await createBookingClientApi(dto, holdId);

                if (response?.id) {
                    sessionStorage.removeItem("bookingData");
                    const methodName = paymentMethod === PAYMENT_METHOD.TIEN_MAT ? "Tiền mặt" : "Chuyển khoản";

                    toastSuccess(
                        "Đặt tour thành công",
                        `Đơn hàng đã được tạo và đang chờ xác nhận thanh toán ${methodName}.`
                    );

                    navigate("/dat-tour-thanh-cong", {
                        state: {
                            method: paymentMethod === PAYMENT_METHOD.TIEN_MAT ? "cash" : "transfer",
                            hold: holdId,
                            orderId: response.id,
                            status: ORDER_STATUS.CHO_DUYET
                        }
                    });
                } else {
                    toastError("Tạo đơn thất bại", response?.message || "Không nhận được phản hồi.");
                }
            } catch (err) {
                const errorMsg = err.response?.data?.message || err.message || "Không thể tạo đơn";
                toastError("Tạo đơn thất bại", errorMsg);
            }
            return;
        }

        if (paymentMethod === PAYMENT_METHOD.VNPAY) {
            setVnpayLoading(true);
            
            const paymentPayload = {
                maGiuCho: holdId,
                maChuyen: bookingData.maChuyen,
                maCodeChuyen: bookingData.maChuyenCode,
                soNguoiLon: passengers.adults,
                soTreEm: passengers.children,
                soEmBe: passengers.toddlers,
                maUuDai: null,
                ghiChu: note || "",
                tyLeThanhToan: depositRate,
                danhSachHanhKhach: buildPassengerList(),
                hoTenLienHe: contact.fullName || "",
                soDienThoaiLienHe: contact.phone || "",
                emailLienHe: contact.email || "",
                diaChiLienHe: contact.address || "",
            };

            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    toastError("Chưa đăng nhập", "Vui lòng đăng nhập để thanh toán.");
                    setVnpayLoading(false);
                    return;
                }

                const res = await fetch("https://localhost:7016/api/client/payment/create-payment", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(paymentPayload),
                });

                const data = await res.json();

                if (res.ok && data.paymentUrl && data.txnRef) {
                    setShowPaymentModal(false);
                    setTxnRef(data.txnRef);
                    setVnpayUrl(data.paymentUrl);
                    
                    toastSuccess(
                        "Chuyển đến VNPay",
                        "Cửa sổ thanh toán VNPay sẽ được mở."
                    );
                } else {
                    toastError("Lỗi thanh toán VNPay", data.message || "Không tạo được liên kết.");
                    setVnpayLoading(false);
                }
            } catch (error) {
                console.error("VNPay error:", error);
                toastError("Lỗi kết nối", "Không thể kết nối đến cổng thanh toán VNPay.");
                setVnpayLoading(false);
            }
        }
    };

    const handlePaymentSuccess = useCallback(() => {
        setVnpayUrl(null);
        setTxnRef(null);
        setShowPaymentModal(false);
        setVnpayLoading(false);
        setHoldId(null);

        sessionStorage.removeItem("bookingData");

        toastSuccess(
            "Thanh toán thành công",
            "Đơn hàng đã được thanh toán thành công qua VNPay."
        );

        navigate("/dat-tour-thanh-cong", {
            state: {
                method: "vnpay",
                depositRate,
                status: ORDER_STATUS.DA_DUYET
            }
        });
    }, [navigate, depositRate]);

    const handlePaymentFailed = useCallback(() => {
        setVnpayUrl(null);
        setTxnRef(null);
        setVnpayLoading(false);
        setShowPaymentModal(false);

        toastError(
            "Thanh toán thất bại",
            "Giao dịch chưa hoàn tất. Vui lòng thử lại."
        );
    }, []);

    if (!bookingData) return <Loading />;

    return (
        <div>
            <div className="mx-auto max-w-[1440px] px-7 mt-30">
                <CheckoutStep step={step} onBack={handleBack} holdId={holdId} />
                <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
                    <div className="space-y-6 lg:col-span-8">
                        {step === 1 && (
                            <>
                                <ContactForm
                                    contact={contact}
                                    onChange={handleContactChange}
                                    onTabChange={handleContactTabChange}
                                    errors={contactErrors}
                                    onActiveTabChange={handleTabChange}
                                    onDateChange={handleContactDateChange}
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
                                    contact={contact}
                                    activeTab={activeTab}
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
                                        <SummaryRow label="Ngày kết thúc" value={formatDate(bookingData.ngayKetThuc)} />
                                        <SummaryRow
                                            label="Trị giá đơn đặt"
                                            value={<span className="font-bold text-sky-600">{formatCurrency(totalPrice)}</span>}
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
                                        <p className="text-sm italic text-slate-400">Chưa điền thông tin chi tiết hành khách.</p>
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
                                                            <td className="py-3 text-slate-600">{p.dob ? formatDate(p.dob) : "—"}</td>
                                                            <td className="py-3 text-slate-600">{p.gender || "—"}</td>
                                                            <td className="py-3"><PassengerTypeBadge label={typeLabel} /></td>
                                                            <td className="py-3">
                                                                {p.singleRoom
                                                                    ? <span className="text-emerald-600 font-medium">Có</span>
                                                                    : <span className="text-slate-400">Không</span>
                                                                }
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
                            onProceed={handleProceed}
                            isReserving={isReserving}
                        />
                    </div>
                </div>
            </div>

            {showProfileWarning && (
                <ProfileWarningModal
                    missingFields={profileMissingFields}
                    onClose={() => setShowProfileWarning(false)}
                    onUpdate={handleGoToProfile}
                />
            )}

            {showPaymentModal && (
                <PaymentModal
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                    depositRate={depositRate}
                    setDepositRate={setDepositRate}
                    vnpayLoading={vnpayLoading}
                    totalPrice={totalPrice}
                    amountDueNow={amountDueNow}
                    onClose={() => setShowPaymentModal(false)}
                    onConfirm={handleConfirmPayment}
                    bookingData={bookingData}
                />
            )}

            {vnpayUrl && txnRef && (
                <VNPayWaitingModal
                    url={vnpayUrl}
                    txnRef={txnRef}
                    onSuccess={handlePaymentSuccess}
                    onClose={handlePaymentFailed}
                />
            )}
        </div>
    );
}

function ProfileWarningModal({ missingFields, onClose, onUpdate }) {
    return (
        <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-3xl bg-white shadow-xl overflow-hidden">
                <div className="p-6">
                    <div className="flex flex-col items-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 mb-3">
                            <AlertCircle size={32} className="text-amber-500" />
                        </div>
                        <h3 className="text-center text-xl font-bold text-slate-800">Thông tin tài khoản chưa đầy đủ</h3>
                    </div>
                    <p className="text-center text-sm text-slate-500 leading-relaxed mt-3">
                        Bạn đang sử dụng thông tin từ tài khoản nhưng thông tin chưa được cập nhật:
                    </p>
                    <div className="mt-4 space-y-2">
                        {missingFields.map((field, index) => (
                            <div key={index} className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-100">
                                <span className="text-sm font-medium text-slate-700">Thông tin {field} chưa được cập nhật</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 flex flex-row gap-3">
                        <button onClick={onUpdate} className="flex-1 rounded-xl bg-sky-500 py-2 font-semibold text-white shadow-md shadow-sky-500/15 hover:bg-sky-600 transition">
                            Cập nhật ngay
                        </button>
                        <button onClick={onClose} className="flex-1 rounded-xl border border-slate-200 py-2 font-medium text-slate-600 hover:bg-slate-50 transition">
                            Để sau
                        </button>
                    </div>
                </div>
            </div>
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
        <div className="flex justify-between py-1">
            <span className="text-slate-500">{label}</span>
            <span>{value}</span>
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

function PaymentModal({
    paymentMethod, setPaymentMethod,
    depositRate, setDepositRate,
    vnpayLoading, totalPrice, amountDueNow,
    onClose, onConfirm, bookingData
}) {
    const daysUntilDeparture = useMemo(
        () => calcDaysUntilDeparture(bookingData?.ngayKhoiHanh),
        [bookingData]
    );

    const canPayCash = bookingData?.ngayKhoiHanh && daysUntilDeparture > 3;

    const options = [
        {
            value: PAYMENT_METHOD.VNPAY,
            label: "Thanh toán trực tuyến qua VNPay",
            desc: "Hệ thống sẽ mở cửa sổ thanh toán VNPay. Đơn hàng tự động xác nhận sau khi giao dịch thành công.",
            icon: <CreditCard size={20} className="text-sky-500" />,
        },
        canPayCash && {
            value: PAYMENT_METHOD.TIEN_MAT,
            label: "Tiền mặt tại quầy",
            desc: "Thanh toán trực tiếp tại văn phòng công ty. Đơn sẽ được tạo ngay, nhân viên sẽ liên hệ xác nhận.",
            icon: <Banknote size={20} className="text-emerald-500" />,
        },
    ].filter(Boolean);

    return (
        <div className="fixed inset-0 z-[999] bg-black/40 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl rounded-3xl bg-white shadow-xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900">Chọn hình thức thanh toán</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-3">
                    {options.map((opt) => {
                        const isSelected = paymentMethod === opt.value;
                        return (
                            <div
                                key={opt.value}
                                onClick={() => setPaymentMethod(opt.value)}
                                className={`w-full rounded-2xl border p-4 transition-all cursor-pointer flex items-center gap-3
                                    ${isSelected
                                        ? "border-sky-500 bg-sky-50/60 ring-1 ring-sky-200"
                                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                    }`}
                            >
                                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors
                                    ${isSelected ? "bg-white shadow-sm" : "bg-slate-100"}`}
                                >
                                    {opt.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-slate-800 text-sm">{opt.label}</p>
                                    {isSelected && (
                                        <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">{opt.desc}</p>
                                    )}
                                </div>
                                <div className={`w-4 h-4 rounded-full border-2 shrink-0 transition-colors
                                    ${isSelected ? "border-sky-500 bg-sky-500" : "border-slate-300"}`}
                                />
                            </div>
                        );
                    })}

                    {paymentMethod === PAYMENT_METHOD.VNPAY && (
                        <div className="rounded-2xl border border-slate-200 p-4">
                            <p className="mb-3 text-sm font-semibold text-slate-800">Chọn mức thanh toán</p>
                            <div className="grid grid-cols-3 gap-3">
                                {DEPOSIT_OPTIONS.map((rate) => {
                                    const isSelected = depositRate === rate;
                                    return (
                                        <button
                                            key={rate}
                                            type="button"
                                            onClick={() => setDepositRate(rate)}
                                            className={`rounded-xl border py-2.5 text-sm font-semibold transition
                                                ${isSelected
                                                    ? "border-sky-500 bg-sky-50 text-sky-600 ring-1 ring-sky-200"
                                                    : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                                                }`}
                                        >
                                            {rate === 100 ? "Thanh toán 100%" : `Đặt cọc ${rate}%`}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="mt-4 space-y-1.5 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Trị giá đơn đặt</span>
                                    <span className="font-medium">{formatCurrency(totalPrice)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Thanh toán ngay ({depositRate}%)</span>
                                    <span className="font-bold text-sky-600">{formatCurrency(amountDueNow)}</span>
                                </div>
                                {depositRate < 100 && (
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Còn lại (trả sau)</span>
                                        <span className="font-medium text-amber-600">{formatCurrency(totalPrice - amountDueNow)}</span>
                                    </div>
                                )}
                            </div>

                            {depositRate < 100 && (
                                <p className="mt-3 text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-xl px-4 py-2.5">
                                    Sau khi đặt cọc, bạn cần thanh toán phần còn lại trước ngày khởi hành.
                                </p>
                            )}
                        </div>
                    )}

                    {!canPayCash && (
                        <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-xl px-4 py-2.5">
                            Chuyến khởi hành trong vòng 3 ngày — chỉ chấp nhận thanh toán trực tuyến qua VNPay.
                        </p>
                    )}
                </div>

                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-4">
                    <button
                        onClick={onConfirm}
                        disabled={vnpayLoading}
                        className="rounded-full bg-sky-500 px-8 py-3 font-semibold text-white shadow-md hover:bg-sky-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {vnpayLoading ? "Đang xử lý..." : "Xác nhận thanh toán"}
                    </button>
                </div>
            </div>
        </div>
    );
}

function VNPayWaitingModal({ url, txnRef, onSuccess, onClose }) {
    const popupRef = useRef(null);
    const pollRef = useRef(null);
    const timeoutRef = useRef(null);
    const calledRef = useRef(false);

    const stopPolling = useCallback(() => {
        if (pollRef.current) clearInterval(pollRef.current);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }, []);

    const closePopup = useCallback(() => {
        if (popupRef.current && !popupRef.current.closed) {
            popupRef.current.close();
        }
    }, []);

    const openPopup = useCallback(() => {
        try {
            if (popupRef.current && !popupRef.current.closed) {
                popupRef.current.focus();
                return;
            }

            const w = 820;
            const h = 680;
            const left = Math.round(window.screenX + (window.outerWidth - w) / 2);
            const top = Math.round(window.screenY + (window.outerHeight - h) / 2);
            
            popupRef.current = window.open(
                url,
                "vnpay_payment",
                `width=${w},height=${h},left=${left},top=${top},resizable=yes,scrollbars=yes,toolbar=no,menubar=no`
            );

            if (!popupRef.current) {
                toastError("Popup bị chặn", "Vui lòng cho phép popup hoặc bấm vào link để mở.");
                onClose();
            } else {
                popupRef.current.focus();
            }
        } catch (error) {
            console.error("Open popup error:", error);
            toastError("Lỗi mở popup", "Không thể mở cửa sổ thanh toán.");
            onClose();
        }
    }, [url, onClose]);

    const startPolling = useCallback(() => {
        stopPolling();
        
        pollRef.current = setInterval(async () => {
            if (calledRef.current) return;
            try {
                const res = await fetch(`https://localhost:7016/api/client/payment/status/${txnRef}`);
                const data = await res.json();
                
                if (data.status === "SUCCESS") {
                    calledRef.current = true;
                    stopPolling();
                    closePopup();
                    onSuccess();
                } else if (data.status === "FAILED") {
                    calledRef.current = true;
                    stopPolling();
                    closePopup();
                    onClose();
                }
            } catch (error) {
                console.error("Polling error:", error);
            }
        }, POLL_INTERVAL_MS);

        timeoutRef.current = setTimeout(() => {
            if (calledRef.current) return;
            stopPolling();
            closePopup();
            onClose();
        }, POLL_TIMEOUT_MS);
    }, [txnRef, onSuccess, onClose, stopPolling, closePopup]);

    useEffect(() => {
        const handleMessage = (event) => {
            if (event.origin !== window.location.origin) return;
            if (event.data?.type === "VNPAY_RETURN" && event.data.success) {
                if (calledRef.current) return;
                calledRef.current = true;
                stopPolling();
                closePopup();
                onSuccess();
            }
        };
        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [onSuccess, stopPolling, closePopup]);

    const checkPopupClosed = useCallback(() => {
        if (popupRef.current && popupRef.current.closed) {
            stopPolling();
            onClose();
        }
    }, [stopPolling, onClose]);

    useEffect(() => {
        const interval = setInterval(checkPopupClosed, 1000);
        return () => clearInterval(interval);
    }, [checkPopupClosed]);

    useEffect(() => {
        if (url) {
            const timer = setTimeout(() => {
                openPopup();
                startPolling();
            }, 500);
            
            return () => {
                clearTimeout(timer);
                stopPolling();
            };
        }
    }, [url, openPopup, startPolling, stopPolling]);

    return (
        <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center">
                            <CreditCard size={16} className="text-sky-500" />
                        </div>
                        <span className="font-bold text-slate-800">Thanh toán qua VNPay</span>
                    </div>
                    <button
                        onClick={() => { stopPolling(); closePopup(); onClose(); }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                    >
                        <X size={18} />
                    </button>
                </div>
                <div className="px-6 py-8 text-center space-y-5">
                    <div className="relative mx-auto w-20 h-20">
                        <div className="absolute inset-0 rounded-full bg-sky-50" />
                        <div className="absolute inset-0 rounded-full border-4 border-sky-100" />
                        <div className="absolute inset-0 rounded-full border-4 border-sky-500 border-t-transparent animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <CreditCard size={22} className="text-sky-400" />
                        </div>
                    </div>
                    <div>
                        <p className="font-bold text-slate-800 text-lg">Đang chờ thanh toán...</p>
                        <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
                            Cửa sổ VNPay đã được mở.<br />Vui lòng hoàn tất thanh toán.
                        </p>
                        <p className="text-xs text-slate-400 mt-2">
                            Mã giao dịch: <span className="font-mono font-medium">{txnRef}</span>
                        </p>
                    </div>
                    <div className="bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3 text-xs text-amber-700 text-left flex gap-2">
                        <span className="shrink-0 mt-0.5">⚠️</span>
                        <span>Không đóng trang này trong khi thanh toán. Đơn hàng sẽ tự động cập nhật sau khi giao dịch hoàn tất.</span>
                    </div>
                    <button
                        onClick={openPopup}
                        className="inline-flex items-center gap-1.5 text-sm text-sky-500 hover:text-sky-600 hover:underline transition"
                    >
                        Cửa sổ bị đóng? <span className="font-semibold">Mở lại tại đây →</span>
                    </button>
                </div>
            </div>
        </div>
    );
}