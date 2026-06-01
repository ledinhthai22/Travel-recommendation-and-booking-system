import { Link } from 'react-router-dom';

export default function MobileMenu({ open, navLinks, isActive, user, onLoginClick }) {
  if (!open) return null;

  return (
    <div className="border-t border-slate-100 bg-white px-4 pb-4 md:hidden">
      <div className="space-y-1 pt-3">
        {navLinks.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              isActive(to)
                ? 'bg-[#0EA5E5]/10 text-[#0EA5E5]'
                : 'text-slate-600 hover:bg-slate-50 hover:text-[#0EA5E5]'
            }`}
          >
            {isActive(to) && (
              <span className="h-1.5 w-1.5 rounded-full bg-[#0EA5E5]" />
            )}
            {label}
          </Link>
        ))}

        {!user && (
          <button
            type="button"
            onClick={onLoginClick}
            className="mt-3 w-full rounded-4xl bg-[#0EA5E5] py-2 text-center text-sm font-semibold text-white transition hover:bg-[#0284c7]"
          >
            Đăng nhập
          </button>
        )}
      </div>
    </div>
  );
}