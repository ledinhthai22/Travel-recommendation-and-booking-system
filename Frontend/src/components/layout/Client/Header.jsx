import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

import Logo from '~/components/UI/Header/Logo';
import NavMenu from '~/components/UI/Header/NavMenu';
import MobileMenu from '~/components/UI/Header/MobileMenu';
import UserAction from '~/components/UI/Header/UserAction';
import AuthModal from '~/components/Auth/AuthModal';
import { useContext } from 'react';
import { AuthContext } from '~/Context/AuthContext';

const navLinks = [
  { to: '/', label: 'Trang chủ' },
  { to: '/Cac-Chuyen-Di', label: 'Các chuyến đi' },
  { to: '/Lien-He', label: 'Liên hệ' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const { pathname } = useLocation();
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);

    handleScroll();
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (to) => pathname === to || pathname.startsWith(to + '/');

  const handleOpenAuth = () => {
    setOpen(false);
    setAuthOpen(true);
  };

  return (
    <>
      <header
        className={`fixed left-0 top-0 z-40 w-full border-b border-slate-200 bg-white transition-shadow ${scrolled ? 'shadow-md' : ''
          }`}
      >
        <nav>
          <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-4 md:px-8">
            <Logo />

            <NavMenu navLinks={navLinks} isActive={isActive} />

            <div className="flex items-center gap-3">
              <UserAction
                user={user}
                onLoginClick={handleOpenAuth}
                onLogout={logout}
              />
              <button
                type="button"
                className="p-1 text-slate-600 md:hidden"
                onClick={() => setOpen((prev) => !prev)}
              >
                {open ? <X /> : <Menu />}
              </button>
            </div>
          </div>

          <MobileMenu
            open={open}
            navLinks={navLinks}
            isActive={isActive}
            user={user}
            onLoginClick={handleOpenAuth}
          />
        </nav>
      </header>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}