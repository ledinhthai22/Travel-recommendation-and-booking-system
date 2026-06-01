// UserLayout.jsx
import { Outlet } from 'react-router-dom';
//  
import Header from '~/components/layout/Client/Header';
import Footer from '~/components/layout/Client/Footer';
import ZaloButton from '../UI/Button/ZaloButton';
import BackToTopButton from '../UI/Button/BackToTopButton';
export default function UserLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1" key={location.pathname}>
        <Outlet />
      </main>

      <Footer />
      <ZaloButton phone="0338683247" />
      <BackToTopButton />
    </div>
  );
}