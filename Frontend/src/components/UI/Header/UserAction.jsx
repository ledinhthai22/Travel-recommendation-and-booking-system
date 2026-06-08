import { useState } from "react";
import { Bell } from "lucide-react";
import AvatarDropdown from "./AvatarDropdown";

export default function UserActions({
  user,
  onLoginClick,
  onLogout,
}) {
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);

  if (!user) {
    return (
      <button
        onClick={onLoginClick}
        className="hidden md:block rounded-full bg-[#0EA5E5] px-5 py-2 text-sm font-semibold text-white hover:bg-[#0284c7]"
      >
        Đăng nhập
      </button>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {/* Notification */}
      <div className="relative">
        <button
          onClick={() => setIsNotifyOpen(!isNotifyOpen)}
          className={`relative flex h-11 w-11 items-center justify-center rounded-xl transition
            ${
              isNotifyOpen
                ? "bg-blue-50 text-[#0EA5E5]"
                : "text-slate-600 hover:bg-slate-50"
            }`}
        >
          <Bell size={16} />

          <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {isNotifyOpen && (
          <div className="absolute right-0 mt-3 w-96 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <h3 className="font-semibold text-slate-900">
                Thông báo
              </h3>

              <button className="rounded-xl border border-blue-100 bg-blue-50 px-2.5 py-1 text-[11px] text-[#0EA5E5]">
                Đánh dấu đã đọc
              </button>
            </div>

            <div className="max-h-[320px] overflow-y-auto">
              <div className="border-b border-slate-50 p-4 hover:bg-slate-50">
                <p className="text-sm text-slate-700">
                  Đơn đặt tour Đà Lạt của bạn đã được xác nhận.
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  2 phút trước
                </p>
              </div>

              <div className="border-b border-slate-50 p-4 hover:bg-slate-50">
                <p className="text-sm text-slate-700">
                  Tour Phú Quốc đang giảm giá 20%.
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  1 giờ trước
                </p>
              </div>
            </div>

            <button className="w-full border-t border-slate-100 py-4 text-sm font-medium text-slate-500 hover:bg-slate-50">
              Xem tất cả thông báo
            </button>
          </div>
        )}
      </div>

      <AvatarDropdown
        user={user}
        onLogout={onLogout}
      />
    </div>
  );
}