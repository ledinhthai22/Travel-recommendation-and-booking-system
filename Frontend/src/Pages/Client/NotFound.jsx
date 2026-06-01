import { Home } from "lucide-react"
import { Link } from "react-router-dom"
export default function NotFound() {
    return (
        <main className="grid min-h-full place-items-center  px-6 py-24 sm:py-32 lg:px-8">
            <div className="text-center">
                <p className="text-3xl font-semibold text-[#0EA5E5]">404</p>
                <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance sm:text-7xl">Không tìm thấy trang</h1>
                <p className="mt-6 text-lg font-medium text-pretty  sm:text-xl/8">Xin lỗi, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm</p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#0EA5E5] hover:underline"
                    >
                        <Home size={16} className="shrink-0" />
                        <span className="leading-4">Trở về trang chủ</span>
                    </Link>
                </div>
            </div>
        </main>
    )
}