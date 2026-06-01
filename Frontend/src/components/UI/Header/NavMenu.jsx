import { Link } from 'react-router-dom';

export default function NavMenu({ navLinks, isActive }) {
  return (
    <div className="hidden md:flex gap-8 font-bold">
      {navLinks.map(({ to, label }) => (
        <Link
          key={to}
          to={to}
          className={`pb-1 transition-colors duration-200 ${
            isActive(to)
              ? 'text-[#0EA5E5] border-b border-[#0EA5E5]'
              : 'text-slate-600 hover:text-[#0EA5E5] border-b border-transparent'
          }`}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}