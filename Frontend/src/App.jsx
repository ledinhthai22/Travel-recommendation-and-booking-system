import { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import MainLayout from '~/components/layout/UserLayout';
import AdminLayout from '~/components/layout/AdminLayout';
import RouteReset from '~/components/Common/RouteReset';
import ProtectedRoute from './Routes/ProtectedRoute';

import {
    ContactPage,
    TourDetail,
    HomePage,
    HotelDetail,
    NotFound,
    ToursPage,
    CheckoutPage,
    Profile,
    Wishlist,
} from './Pages/Client';

import {
    DashBoard,
    UserManager,
    TourManager,
    TouristManager,
    HotelManager,
    BookingManager,
    Webinfo,
    ContactManager,
    RevenueByTour,
    ActivityLogManager,
    NewlettersManager,
    BannerManager,
    StaffManager,
    PromotionManager,
    HotelCreatePage,
    HotelEditPage,
    HotelDetailPage,
    TypeLocationManager,
    AmenitiesManager,
    LocationManager
} from './Pages/admin';

function App() {
    return (
        <BrowserRouter>
            <RouteReset />

            <Suspense
                fallback={
                    <div className="flex h-screen w-full items-center justify-center bg-slate-50 text-slate-500 font-bold">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                            <span>Đang tải hệ thống...</span>
                        </div>
                    </div>
                }
            >
                <Toaster position="top-right" reverseOrder={false} gutter={12} />

                <Routes>

                    <Route path="/" element={<MainLayout />}>
                        <Route index element={<HomePage />} />
                        <Route path="Cac-Chuyen-Di" element={<ToursPage />} />
                        <Route path="Cac-Chuyen-Di/:name" element={<TourDetail />} />
                        <Route path="Khach-san/:name" element={<HotelDetail />} />
                        <Route path="Lien-He" element={<ContactPage />} />
                        <Route path="Thanh-Toan" element={<CheckoutPage />} />
                        <Route element={<ProtectedRoute />}>
                            <Route path="Thong-Tin-Ca-Nhan" element={<Profile />} />
                            <Route path="Danh-Sach-Yeu-Thich" element={<Wishlist />} />
                        </Route>
                    </Route>

                    <Route element={<ProtectedRoute allowedRoles={["1", "2"]} />}>
                        <Route path="/Quan-ly" element={<AdminLayout />}>
                            <Route index element={<DashBoard />} />
                            <Route path="Khach-du-lich" element={<TouristManager />} />
                            <Route path="Dia-diem" element={<LocationManager />} />
                            <Route path="Loai-Dia-Diem" element={<TypeLocationManager />} />
                            <Route path="Cac-chuyen-di" element={<TourManager />} />
                            <Route path="Khach-san">
                                <Route index element={<HotelManager />} />
                                <Route path="Them-Khach-San" element={<HotelCreatePage />} />
                                <Route path="Xem-chi-tiet/:id" element={<HotelDetailPage />} />
                                <Route path="Cap-nhat/:id" element={<HotelEditPage />} />
                            </Route>
                            <Route path="Tien-ich" element={<AmenitiesManager />} />
                            <Route path="Don-dat-cac-chuyen-di" element={<BookingManager />} />
                            <Route path="Lien-he" element={<ContactManager />} />
                        </Route>
                    </Route>
                    <Route element={<ProtectedRoute allowedRoles={["1"]} />}>
                        <Route path="/Quan-ly" element={<AdminLayout />}>
                            <Route path="Nhan-vien" element={<StaffManager />} />
                            <Route path="Tai-khoan" element={<UserManager />} />
                            <Route path="Newletter" element={<NewlettersManager />} />
                            <Route path="Banner" element={<BannerManager />} />
                            <Route path="Uu-Dai" element={<PromotionManager />} />
                            <Route path="Thong-tin-trang" element={<Webinfo />} />
                            <Route path="Thong-doanh-thu-theo-cac-chuyen-di" element={<RevenueByTour />} />
                            <Route path="Hoat-dong-he-thong" element={<ActivityLogManager />} />
                        </Route>
                    </Route>

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}

export default App;