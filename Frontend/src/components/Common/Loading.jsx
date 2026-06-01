export default function Loading() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-white">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            <p className="text-sm text-slate-400">Đang tải điểm đến...</p>
        </div>
    )
}