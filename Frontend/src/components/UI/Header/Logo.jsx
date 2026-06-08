import { useNavigate, useLocation } from 'react-router-dom';
import LogoImg from '~/assets/Image/Logo.png';

export default function Logo() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    if (location.pathname === "/") {
      window.location.reload(); 
    } else {
      navigate("/"); 
    }
  };

  return (
    <div onClick={handleClick} className="flex items-center gap-2 cursor-pointer">
      <img src={LogoImg} className="h-9 w-auto" alt="Logo" />
      <span className="text-lg md:text-xl font-bold text-slate-600 transition-colors duration-200 hover:text-[#0EA5E5]">
        Lối Riêng Travel
      </span>
    </div>
  );
}