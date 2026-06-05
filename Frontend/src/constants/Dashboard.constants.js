import { Ticket,UserPlus,BadgeCheck,MessageSquare } from "lucide-react";
export const revenueData = {
    labels: [
        "T1",
        "T2",
        "T3",
        "T4",
        "T5",
        "T6",
        "T7",
        "T8",
        "T9",
        "T10",
        "T11",
        "T12",
    ],
    datasets: [
        {
            label: "Doanh thu",
            data: [
                120,
                180,
                250,
                320,
                410,
                520,
                470,
                620,
                700,
                850,
                930,
                1050,
            ],
            backgroundColor: "#0EA5E9",
            maxBarThickness: 36,
        },
    ],
};

export const revenueOptions = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
        legend: {
            display: false,
        },
    },

    scales: {
        x: {
            grid: {
                display: false,
            },
        },

        y: {
            beginAtZero: true,

            ticks: {
                callback: (value) => `${value}tr`,
            },

            grid: {
                color: "#f1f5f9",
            },
        },
    },
};
export const recentTransactions = [
    {
        id: "T20260001",
        customer: "Nguyễn Văn A",
        tour: "Đà Lạt 3N2Đ",
        amount: "4.500.000 ₫",
        status: "Đã thanh toán",
        time: "10 phút trước",
    },
    {
        id: "T20260002",
        customer: "Trần Thị B",
        tour: "Phú Quốc 4N3Đ",
        amount: "8.900.000 ₫",
        status: "Chờ thanh toán",
        time: "25 phút trước",
    },
    {
        id: "T20260003",
        customer: "Lê Văn C",
        tour: "Đà Nẵng 3N2Đ",
        amount: "6.200.000 ₫",
        status: "Đã thanh toán",
        time: "1 giờ trước",
    },
    {
        id: "T20260004",
        customer: "Phạm Thị D",
        tour: "Nha Trang 3N2Đ",
        amount: "5.800.000 ₫",
        status: "Đã hủy",
        time: "2 giờ trước",
    },
    {
        id: "T20260004",
        customer: "Phạm Thị D",
        tour: "Nha Trang 3N2Đ",
        amount: "5.800.000 ₫",
        status: "Đã hủy",
        time: "2 giờ trước",
    }
];
export const activities = [
    {
        id: 1,
        icon: Ticket,
        color: "bg-sky-100 text-sky-600",
        title: "Đơn đặt tour mới",
        description: "Nguyễn Văn A đặt tour Đà Lạt 3N2Đ",
        time: "2 phút trước",
    },
    {
        id: 2,
        icon: UserPlus,
        color: "bg-emerald-100 text-emerald-600",
        title: "Khách hàng mới",
        description: "Tài khoản Trần Thị B vừa đăng ký",
        time: "15 phút trước",
    },
    {
        id: 3,
        icon: BadgeCheck,
        color: "bg-violet-100 text-violet-600",
        title: "Thanh toán thành công",
        description: "Đơn #T20260025 đã thanh toán",
        time: "30 phút trước",
    },
    {
        id: 4,
        icon: MessageSquare,
        color: "bg-amber-100 text-amber-600",
        title: "Liên hệ mới",
        description: "Có yêu cầu tư vấn từ website",
        time: "1 giờ trước",
    },
    {
        id: 5,
        icon: MessageSquare,
        color: "bg-amber-100 text-amber-600",
        title: "Liên hệ mới",
        description: "Có yêu cầu tư vấn từ website",
        time: "1 giờ trước",
    }
];
export const topTours = [
    {
        id: 1,
        name: "Tour Đà Lạt 3N2Đ",
        booked: 221,
        revenue: "234 triệu",
        image: "https://picsum.photos/200?1",
    },
    {
        id: 2,
        name: "Tour Phú Quốc",
        booked: 198,
        revenue: "215 triệu",
        image: "https://picsum.photos/200?2",
    },
    {
        id: 3,
        name: "Tour Nha Trang",
        booked: 175,
        revenue: "180 triệu",
        image: "https://picsum.photos/200?3",
    },
    {
        id: 4,
        name: "Tour Sapa",
        booked: 152,
        revenue: "160 triệu",
        image: "https://picsum.photos/200?4",
    },
    {
        id: 5,
        name: "Tour Sapa",
        booked: 152,
        revenue: "160 triệu",
        image: "https://picsum.photos/200?4",
    },
    {
        id: 6,
        name: "Tour Sapa",
        booked: 152,
        revenue: "160 triệu",
        image: "https://picsum.photos/200?4",
    }

];