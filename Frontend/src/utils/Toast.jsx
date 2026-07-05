import toast from "react-hot-toast";
import {
    CheckCircle2,
    XCircle,
    AlertTriangle,
    X,
} from "lucide-react";

export const show = ({
    icon,
    title,
    message,
    borderClass,
}) => {
    toast.custom(
        (t) => (
            <div
                style={{
                    zIndex: 999999999, 
                }}
                className={`
                    relative
                    w-[300px]
                    rounded-[8px]
                    bg-white
                    border
                    ${borderClass}
                    shadow-xl
                    p-4
                    transition-all
                    duration-300
                    ${t.visible
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-95"
                    }
                `}
            >
                <button
                    onClick={() => toast.dismiss(t.id)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-slate-700"
                >
                    <X size={16} />
                </button>

                <div className="flex gap-3">
                    <div className="mt-1">
                        {icon}
                    </div>

                    <div
                        className={`flex-1 ${!message ? "flex flex-col justify-center" : "flex flex-col"
                            }`}
                    >
                        <h4 className="font-semibold text-sm text-slate-700">
                            {title}
                        </h4>

                        {message && (
                            <p className="text-xs text-slate-500 mt-1">
                                {message}
                            </p>
                        )}
                    </div>
                </div>

                <div className="absolute left-0 bottom-[-0.5px] h-1 w-full overflow-hidden  rounded-b-[40px]">
                    <div className="h-full bg-sky-400 animate-progress" />
                </div>
            </div>
        ),
        {
            duration: 3000,
        }
    );
};
export const toastSuccess = (
    title,
    message
) =>
    show({
        icon: (
            <CheckCircle2
                size={22}
                className="text-green-500"
            />
        ),
        title,
        message,
        borderClass: "border-green-100",
    });

export const toastError = (
    title,
    message
) =>
    show({
        icon: (
            <XCircle
                size={22}
                className="text-red-500"
            />
        ),
        title,
        message,
        borderClass: "border-red-100",
    });

export const toastWarning = (
    title,
    message
) =>
    show({
        icon: (
            <AlertTriangle
                size={22}
                className="text-yellow-500"
            />
        ),
        title,
        message,
        borderClass: "border-yellow-100",
    });