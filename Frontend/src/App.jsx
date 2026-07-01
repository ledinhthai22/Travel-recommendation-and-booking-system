import { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import MainLayout from '~/components/layout/UserLayout';
import AdminLayout from '~/components/layout/AdminLayout';
import RouteReset from '~/components/Common/RouteReset';
import ProtectedRoute from './Routes/ProtectedRoute';
import { useContext } from 'react'; // them moi 
import { AuthContext } from '~/Context/AuthContext'; // them moi 
import AuthModal from './components/Auth/AuthModal'; // them moi 

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
    PaymentReturnPage,
    BookingSuccessPage,
} from './Pages/Client';


import {
    DashBoard,
    UserManager,
    TourManager,
    HotelManager,
    BookingManager,
    Webinfo,
    ContactManager,
    ActivityLogManager,
    NewlettersManager,
    BannerManager,
    StaffManager,
    PromotionManager,
    TypeLocationManager,
    AmenitiesManager,
    LocationManager,
    ReviewManager, // them moi
    TourFormPage,
    TypeTourManager,
} from './Pages/admin';

function App() {
    const { showLoginModal, setShowLoginModal } = useContext(AuthContext);
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
                <AuthModal
                    open={showLoginModal}
                    onClose={() => setShowLoginModal(false)}
                />
                <Routes>
                    {/* ── Client routes ── */}
                    <Route path="/" element={<MainLayout />}>
                        <Route index element={<HomePage />} />
                        <Route path="Cac-Chuyen-Di" element={<ToursPage />} />
                        <Route path="/Cac-Chuyen-Di/:slug" element={<TourDetail />} />
                        <Route path="Khach-san/:slug" element={<HotelDetail />} />
                        <Route path="Lien-He" element={<ContactPage />} />
                        <Route element={<ProtectedRoute />}>
                            <Route path="Thong-Tin-Ca-Nhan" element={<Profile />} />
                            <Route path="Danh-Sach-Yeu-Thich" element={<Wishlist />} />
                            <Route path="Thanh-Toan" element={<CheckoutPage />} />
                            <Route path="/payment-return" element={<PaymentReturnPage />} />
                            <Route path="dat-tour-thanh-cong" element={<BookingSuccessPage />} />
                        </Route>
                    </Route>

                    {/* ── Admin routes (role 1 & 2) ── */}
                    <Route element={<ProtectedRoute allowedRoles={['1', '2']} />}>
                        <Route path="/Quan-ly" element={<AdminLayout />}>
                            <Route index element={<DashBoard />} />
                            <Route path="Dia-diem" element={<LocationManager />} />
                            <Route path="Loai-Dia-Diem" element={<TypeLocationManager />} />
                            <Route path="Loai-Tour" element={<TypeTourManager />} />
                            <Route path="Danh-gia" element={<ReviewManager />} /> // them moi
                            <Route path="Cac-chuyen-di">
                                <Route index element={<TourManager />} />
                                <Route path="Them-Tour" element={<TourFormPage mode="add" />} />
                                <Route path="Xem-chi-tiet/:id" element={<TourFormPage mode="view" />} />
                                <Route path="Cap-nhat/:id" element={<TourFormPage mode="edit" />} />
                            </Route>
                            <Route path="Khach-san" element={<HotelManager />} />
                            <Route path="Tien-ich" element={<AmenitiesManager />} />
                            <Route path="Don-dat-cac-chuyen-di" element={<BookingManager />} />
                            <Route path="Lien-he" element={<ContactManager />} />
                        </Route>
                    </Route>

                    {/* ── Admin routes (role 1 only) ── */}
                    <Route element={<ProtectedRoute allowedRoles={['1']} />}>
                        <Route path="/Quan-ly" element={<AdminLayout />}>
                            <Route path="Nhan-vien" element={<StaffManager />} />
                            <Route path="Tai-khoan" element={<UserManager />} />
                            <Route path="Newletter" element={<NewlettersManager />} />
                            <Route path="Banner" element={<BannerManager />} />

                            <Route path="Uu-Dai" element={<PromotionManager />} />
                            <Route path="Thong-tin-trang" element={<Webinfo />} />
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