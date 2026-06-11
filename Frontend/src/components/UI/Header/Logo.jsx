import { useNavigate, useLocation } from 'react-router-dom';
import LogoImg from '~/assets/Image/Logo.png';
import { useWebInfo } from '~/Hooks/useWebInfo';
export default function Logo() {
  const navigate = useNavigate();
  const location = useLocation();
  const {webInfo} = useWebInfo();
  const url = 'https://localhost:7016'
  const handleClick = () => {
    if (location.pathname === "/") {
      window.location.reload(); 
    } else {
      navigate("/"); 
    }
  };

  return (
    <div onClick={handleClick} className="flex items-center gap-2 cursor-pointer">
      <img src={`${url}${webInfo.logo_url}`} className="h-9 w-auto" alt={`${webInfo.ten_trang}`} />
      <span className="text-lg md:text-xl font-bold text-slate-600 transition-colors duration-200 hover:text-[#0EA5E5]">
        {webInfo.ten_trang}
      </span>
    </div>
  );
}