import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

import CheckoutStep from "~/components/Checkout/CheckoutStep";
import ContactForm from "~/components/Checkout/ContactForm";
import PassengerForm from "~/components/Checkout/PassengerForm";
import PassengerDetailsForm from "~/components/Checkout/PassengerDetailsForm";
import TourSummaryCard from "~/components/Checkout/TourSummaryCard";
import InputField from "~/components/UI/Form/InputField";
import Loading from "~/components/Common/Loading";

export default function CheckoutPage() {
    const [step, setStep] = useState(1);
    const [success, setSuccess] = useState(false);

    const [bookingData, setBookingData] = useState(null);
    const [passengerDetails, setPassengerDetails] = useState({});
    const [singleRooms, setSingleRooms] = useState({});

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
    const [paymentMethod, setPaymentMethod] = useState("ewallet");
    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString("vi-VN");
    }
    useEffect(() => {
        const data = sessionStorage.getItem("bookingData");

        if (data) {
            const parsed = JSON.parse(data);

            setBookingData(parsed);

            setPassengers({
                adults: 1,
                children: 0,
                toddlers: 0,
            });
        }
    }, []);
    const passengerList = Object.entries(passengerDetails).map(
        ([key, passenger]) => ({
            key,
            ...passenger,
            singleRoom: singleRooms[key] || false
        })
    );
    const handleToggleSingleRoom = (key) => {
        setSingleRooms((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const handleContactChange = (e) => {
        const { name, value } = e.target;

        setContact((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePassengerChange = (type, value) => {
        setPassengers((prev) => ({
            ...prev,
            [type]: value,
        }));
    };
    const formatCurrency = (value) =>
        new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            maximumFractionDigits: 0,
        }).format(value || 0);
    const singleRoomCount = Object.values(singleRooms).filter(Boolean).length;

    const totalPrice = useMemo(() => {
        if (!bookingData) return 0;

        const adultPrice =
            bookingData?.gia?.giaNguoiLon || 0;

        const childPrice =
            bookingData?.gia?.giaTreEm || 0;

        const singleRoomFee = bookingData?.gia?.phuThuPhongDon || 0;
        const toddlerPrice = bookingData?.gia?.giaEmBe || 0;

        return (
            passengers.adults * adultPrice +
            passengers.children * childPrice +
            passengers.toddlers * toddlerPrice +
            singleRoomCount * singleRoomFee
        );
    }, [
        bookingData,
        passengers,
        singleRoomCount,
    ]);
    useEffect(() => {
        setSingleRooms((prev) => {
            const cleaned = {};

            for (let i = 0; i < passengers.adults; i++) {
                const key = `adults-${i}`;
                if (prev[key]) cleaned[key] = true;
            }

            for (let i = 0; i < passengers.children; i++) {
                const key = `children-${i}`;
                if (prev[key]) cleaned[key] = true;
            }

            for (let i = 0; i < passengers.toddlers; i++) {
                const key = `toddlers-${i}`;
                if (prev[key]) cleaned[key] = true;
            }

            return cleaned;
        });
    }, [passengers]);
    console.log("singleRooms:", singleRooms);
    console.log("singleRoomCount:", singleRoomCount);
    const handleSubmit = () => {
        if (step === 1) {
            if (
                !contact.fullName ||
                !contact.phone ||
                !contact.email
            ) {
                alert("Vui lòng nhập đầy đủ thông tin");
                return;
            }

            setStep(2);
            return;
        }

        const orderData = {
            bookingData,
            contact,
            passengers,
            singleRooms,
            promoCode,
            note,
            totalPrice,
        };

        console.log(orderData);

        // await bookingApi.create(orderData);
        console.log(passengerDetails);
        setSuccess(true);
    };
    const handleConfirmPayment = async () => {
        const orderData = {
            bookingData,
            contact,
            passengers,
            singleRooms,
            promoCode,
            note,
            totalPrice,
        };

        if (paymentMethod === "cash") {
            console.log(orderData);

            // await bookingApi.create(orderData);

            setShowPaymentModal(false);
            setSuccess(true);
        }

        if (paymentMethod === "ewallet") {
            alert("Tính năng thanh toán MoMo đang phát triển");

            // Sau này:
            // const paymentUrl = await momoApi.create(orderData);
            // window.location.href = paymentUrl;
        }
    };
    if (!bookingData) {
        return (
            <Loading />
        );
    }

    if (success) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle2
                            size={40}
                            className="text-green-600"
                        />
                    </div>

                    <h2 className="mt-5 text-3xl font-bold">
                        Đặt tour thành công
                    </h2>

                    <p className="mt-3 text-slate-500">
                        Chúng tôi sẽ liên hệ với bạn sớm nhất.
                    </p>

                    <Link
                        to="/"
                        className="mt-6 inline-block rounded-xl bg-sky-500 px-6 py-3 text-white"
                    >
                        Về trang chủ
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen ">
            <div className="mx-auto max-w-[1440px] px-7">
                <CheckoutStep step={step} />

                <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
                    <div className="space-y-6 lg:col-span-8">
                        {step === 1 && (
                            <>
                                <ContactForm
                                    contact={contact}
                                    onChange={handleContactChange}
                                />

                                <PassengerForm
                                    passengers={passengers}
                                    onChange={handlePassengerChange}
                                />

                                <PassengerDetailsForm
                                    passengers={passengers}
                                    singleRooms={singleRooms}
                                    onToggleSingleRoom={handleToggleSingleRoom}
                                    bookingData={bookingData}
                                    details={passengerDetails}
                                    setDetails={setPassengerDetails}
                                />

                                <div className="rounded-3xl bg-white p-6 shadow-sm">
                                    <h2 className="mb-4 text-xl font-bold text-slate-900">
                                        Mã ưu đãi
                                    </h2>

                                    <div className="flex items-center gap-3">
                                        <div className="min-w-0 flex-1">
                                            <InputField
                                                value={promoCode}
                                                onChange={(e) =>
                                                    setPromoCode(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Nhập mã giảm giá"
                                            />
                                        </div>

                                        <button className="rounded-2xl bg-sky-500 px-8 py-3 font-medium text-white">
                                            Áp dụng
                                        </button>
                                    </div>
                                </div>

                                <div className="mb-10 rounded-3xl bg-white p-6 shadow-sm">
                                    <h2 className="mb-4 text-xl font-bold text-slate-900">
                                        Ghi chú
                                    </h2>

                                    <textarea
                                        rows={4}
                                        value={note}
                                        onChange={(e) =>
                                            setNote(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Nhập ghi chú cho đơn hàng..."
                                        className="w-full rounded-2xl border border-slate-300 p-4 outline-none"
                                    />
                                </div>
                            </>
                        )}

                        {step === 2 && (
                            <div>
                                <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                                    <h2 className="mb-5 text-xl font-bold">
                                        Thông tin liên lạc
                                    </h2>

                                    <div className="grid grid-cols-3 gap-6">

                                        <div>
                                            <p className="text-sm text-slate-500">
                                                Họ tên
                                            </p>

                                            <p className="font-medium">
                                                {contact.fullName}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-slate-500">
                                                Email
                                            </p>

                                            <p className="font-medium">
                                                {contact.email}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-slate-500">
                                                Số điện thoại
                                            </p>

                                            <p className="font-medium">
                                                {contact.phone}
                                            </p>
                                        </div>

                                    </div>

                                    <div className="mt-4">
                                        <p className="text-sm text-slate-500">
                                            Ghi chú
                                        </p>

                                        <p>
                                            {note || "Không có"}
                                        </p>
                                    </div>

                                </div>
                                <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                                    <h2 className="mb-5 text-xl font-bold">
                                        Chi tiết đơn đặt tour
                                    </h2>

                                    <div className="space-y-3">

                                        <div>
                                            <span className="text-slate-500">
                                                Mã đặt chỗ:
                                            </span>

                                            <span className="ml-2 font-medium">
                                                {bookingData.tenTour}
                                            </span>
                                        </div>

                                        <div>
                                            <span className="text-slate-500">
                                                Ngày tạo:
                                            </span>

                                            <span className="ml-2 font-medium">
                                                {formatDate(bookingData.ngayTao)}
                                            </span>
                                        </div>

                                        <div>
                                            <span className="text-slate-500">
                                                Trị giá đơn đặt:
                                            </span>

                                            <span className="ml-2 font-medium">
                                                {formatCurrency(
                                                    bookingData.totalPrice
                                                )}
                                            </span>
                                        </div>

                                        <div>
                                            <span className="text-slate-500">
                                                Số tiền đã thanh toán:
                                            </span>

                                            <span className="ml-2 font-medium">
                                                {/* {formatCurrency(
                                                    booking.soTienDaThanhToan
                                                )} */}   adssdaf
                                            </span>
                                        </div>

                                        <div>
                                            <span className="text-slate-500">
                                                Số tiền còn lại:
                                            </span>

                                            <span className="ml-2 font-medium">
                                                {/* {formatCurrency(
                                                    booking.soTienConLai
                                                )} */}  dsasdf
                                            </span>
                                        </div>

                                        <div>
                                            <span className="text-slate-500">
                                                Tình trạng:
                                            </span>

                                            <span className="ml-2 font-medium">
                                                {/* {booking.trangThai} */}  sadfsdaf
                                            </span>
                                        </div>

                                        <div>
                                            <span className="text-slate-500">
                                                Thời hạn thanh toán:
                                            </span>

                                            <span className="ml-2 font-medium">
                                                {/* {booking.hanThanhToan} */}   sdafsadf
                                            </span>
                                        </div>

                                        <div>
                                            <span className="text-slate-500">
                                                Hình thức thanh toán:
                                            </span>

                                            <span className="ml-2 font-medium">
                                                {/* {booking.hinhThucThanhToan} */}  ádfasdf
                                            </span>
                                        </div>

                                    </div>

                                </div>
                                <div className="rounded-3xl mb-20 border border-slate-200 bg-white p-6 shadow-sm">

                                    <h2 className="mb-5 text-xl font-bold">
                                        Danh sách hành khách
                                    </h2>

                                    <table className="w-full">

                                        <thead>
                                            <tr className="text-left text-slate-500">
                                                <th>#</th>
                                                <th>Họ tên</th>
                                                <th>Ngày sinh</th>
                                                <th>Giới tính</th>
                                                <th>Phòng đơn</th>
                                            </tr>
                                        </thead>

                                        <tbody>

                                            {passengerList.map((passenger, index) => (
                                                <tr
                                                    key={passenger.key}
                                                    className="border-t border-slate-100"
                                                >
                                                    <td className="py-3">
                                                        #{index + 1}
                                                    </td>

                                                    <td>{passenger.fullName}</td>

                                                    <td>
                                                        {passenger.dob
                                                            ? formatDate(passenger.dob)
                                                            : "-"}
                                                    </td>

                                                    <td>{passenger.gender}</td>

                                                    <td>
                                                        {passenger.singleRoom
                                                            ? "Có"
                                                            : "Không"}
                                                    </td>
                                                </tr>
                                            ))}

                                        </tbody>

                                    </table>

                                </div>
                            </div>
                        )}
                    </div>
                    {
                        showPaymentModal && (
                            <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center">
                                <div className="w-full max-w-3xl rounded-3xl bg-white shadow-xl">

                                    {/* Header */}
                                    <div className="flex items-center justify-between p-6">
                                        <h2 className="text-2xl font-bold">
                                            Các hình thức thanh toán
                                        </h2>

                                        <button
                                            onClick={() => setShowPaymentModal(false)}
                                            className="text-3xl"
                                        >
                                            ×
                                        </button>
                                    </div>

                                    {/* Nội dung */}
                                    <div className="p-6 space-y-5">

                                        {/* Ví điện tử */}
                                        <div
                                            onClick={() =>
                                                setPaymentMethod("ewallet")
                                            }
                                            className={`cursor-pointer rounded-2xl border p-5
                                                ${paymentMethod === "ewallet"
                                                    ? "border-sky-500 bg-sky-50"
                                                    : "border-slate-200"
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="radio"
                                                    checked={
                                                        paymentMethod ===
                                                        "ewallet"
                                                    }
                                                    readOnly
                                                />

                                                <span className="font-medium">
                                                    Ví điện tử MoMo
                                                </span>
                                            </div>

                                            {/* <div className="mt-4 flex gap-5">
                                                <img
                                                    src="/images/momo.png"
                                                    alt="MoMo"
                                                    className="h-8"
                                                />

                                                <img
                                                    src="/images/zalopay.png"
                                                    alt="ZaloPay"
                                                    className="h-8"
                                                />
                                            </div> */}
                                        </div>

                                        {/* Tiền mặt */}
                                        <div
                                            onClick={() =>
                                                setPaymentMethod("cash")
                                            }
                                            className={`cursor-pointer rounded-2xl border p-5
                                                ${paymentMethod === "cash"
                                                    ? "border-sky-500 bg-sky-50"
                                                    : "border-slate-200"
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="radio"
                                                    checked={
                                                        paymentMethod ===
                                                        "cash"
                                                    }
                                                    readOnly
                                                />

                                                <span className="font-medium">
                                                    Tiền mặt
                                                </span>
                                            </div>
                                        </div>

                                    </div>

                                    {/* Footer */}
                                    <div className="flex justify-end  p-6">
                                        <button
                                            onClick={handleConfirmPayment}
                                            className="rounded-full bg-sky-500 px-10 py-3 font-semibold text-white"
                                        >
                                            Xác nhận
                                        </button>
                                    </div>

                                </div>
                            </div>
                        )
                    }
                    <div className="lg:col-span-4">
                        <TourSummaryCard
                            bookingData={{
                                ...bookingData,
                                totalPrice,
                            }}
                            passengers={passengers}
                            singleRoomCount={singleRoomCount}
                            step={step}
                            setShowPaymentModal={setShowPaymentModal}
                            onSubmit={handleSubmit}
                        />

                    </div>
                </div>
            </div>
        </div>
    );
}