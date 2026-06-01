import { Bell } from 'lucide-react';

export default function UserActions({ user, onLoginClick }) {
  return (
    <div className="flex items-center gap-3">
      {user ? (
        <button
          type="button"
          className="relative p-1.5 text-slate-600 transition hover:text-[#0EA5E5]"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>
      ) : (
        <button
          type="button"
          onClick={onLoginClick}
          className="hidden rounded-4xl bg-[#0EA5E5] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0284c7] md:block"
        >
          Đăng nhập
        </button>
      )}
    </div>
  );
}