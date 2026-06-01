import { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import MainLayout from '~/components/layout/UserLayout';
import AdminLayout from '~/components/layout/AdminLayout';
import RouteReset from '~/components/Common/RouteReset';

import {
  ContactPage,
  TourDetail,
  HomePage,
  NotFound,
  ToursPage,
  CheckoutPage,
  Profile,
} from './Pages/Client';

import {
  DashBoard,
  UserManager,
  TourManager,
  TouristManager,
  LocationManager,
  EmployeeManager,
  HotelManager,
  BookingManager,
  Webinfo,
  ContactManager,
  RevenueByTour,
  ReviewManager,
  CustomerChatManager,
  BlogManager,
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
        <Toaster position="top-right" reverseOrder={false} />

        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="Cac-Chuyen-Di" element={<ToursPage />} />
            <Route path="Cac-Chuyen-Di/:name" element={<TourDetail />} />
            <Route path="Lien-He" element={<ContactPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashBoard />} />
            <Route path="users" element={<UserManager />} />
            <Route path="tours" element={<TourManager />} />
            <Route path="locations" element={<LocationManager />} />
            <Route path="hotels" element={<HotelManager />} />
            <Route path="staff" element={<EmployeeManager />} />
            <Route path="tourists" element={<TouristManager />} />
            <Route path="booking" element={<BookingManager />} />
            <Route path="blog" element={<BlogManager />} />
            <Route path="review" element={<ReviewManager />} />
            <Route path="contact" element={<ContactManager />} />
            <Route path="webinfo" element={<Webinfo />} />
            <Route path="chat" element={<CustomerChatManager />} />
            <Route path="report" element={<RevenueByTour />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;