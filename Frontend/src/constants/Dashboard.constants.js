// ─── Bar Chart: Doanh thu theo tháng ──────────────────────────────────────
export const revenueData = [
    { month: "T1",  revenue: 320 },
    { month: "T2",  revenue: 410 },
    { month: "T3",  revenue: 380 },
    { month: "T4",  revenue: 520 },
    { month: "T5",  revenue: 610 },
    { month: "T6",  revenue: 490 },
    { month: "T7",  revenue: 720 },
    { month: "T8",  revenue: 680 },
    { month: "T9",  revenue: 590 },
    { month: "T10", revenue: 740 },
    { month: "T11", revenue: 830 },
    { month: "T12", revenue: 950 },
];

// ─── Pie Chart: Trạng thái đơn hàng ───────────────────────────────────────
export const orderStatusData = [
    { name: "Đã thanh toán",  value: 58, color: "#10B981" },
    { name: "Chờ thanh toán", value: 27, color: "#F59E0B" },
    { name: "Đã hủy",         value: 15, color: "#EF4444" },
];

// ─── Line Chart: Khách hàng mới ────────────────────────────────────────────
export const newCustomersData = [
    { month: "T1",  customers: 40  },
    { month: "T2",  customers: 55  },
    { month: "T3",  customers: 48  },
    { month: "T4",  customers: 72  },
    { month: "T5",  customers: 85  },
    { month: "T6",  customers: 63  },
    { month: "T7",  customers: 91  },
    { month: "T8",  customers: 78  },
    { month: "T9",  customers: 66  },
    { month: "T10", customers: 95  },
    { month: "T11", customers: 110 },
    { month: "T12", customers: 130 },
];

// ─── Horizontal Bar Chart: Top tour bán chạy ──────────────────────────────
export const topToursData = [
    { name: "Nha Trang biển xanh", booked: 118, color: "#EF4444" },
    { name: "Sapa Trekking 3N2Đ",  booked: 139, color: "#F59E0B" },
    { name: "Hạ Long 3N2Đ",        booked: 162, color: "#8B5CF6" },
    { name: "Đà Nẵng – Hội An",    booked: 187, color: "#10B981" },
    { name: "Phú Quốc 4N3Đ",       booked: 214, color: "#0EA5E9" },
];

// ─── Pie Chart: Hành vi khách hàng (xem vs đặt vs yêu thích) ─────────────
export const tourEngagementData = [
    { name: "Đã đặt tour",        value: 32, color: "#0EA5E9" },
    { name: "Xem nhưng chưa đặt", value: 48, color: "#CBD5E1" },
    { name: "Thêm yêu thích",     value: 20, color: "#F59E0B" },
];

export const tourEngagementStats = {
    totalViews:     18420,
    totalBooked:    1248,
    conversionRate: "6,8%",
};

// ─── Pie Chart: Độ tuổi khách hàng tham gia tour ──────────────────────────
export const ageGroupData = [
    { name: "Dưới 18",  value: 5,  color: "#818CF8" },
    { name: "18 – 24",  value: 18, color: "#0EA5E9" },
    { name: "25 – 34",  value: 31, color: "#10B981" },
    { name: "35 – 44",  value: 24, color: "#F59E0B" },
    { name: "45 – 54",  value: 14, color: "#F97316" },
    { name: "Trên 55",  value: 8,  color: "#EF4444" },
];

// ─── Table: Giao dịch gần đây ──────────────────────────────────────────────
export const recentTransactions = [
    {
        id: "#TK-00198",
        time: "22/05/2026 · 09:14",
        customer: "Nguyễn Minh Tuấn",
        tour: "Phú Quốc 4N3Đ",
        amount: "12.800.000 đ",
        status: "Đã thanh toán",
    },
    {
        id: "#TK-00197",
        time: "22/05/2026 · 08:47",
        customer: "Trần Thị Lan",
        tour: "Hạ Long 3N2Đ",
        amount: "8.500.000 đ",
        status: "Chờ thanh toán",
    },
    {
        id: "#TK-00196",
        time: "21/05/2026 · 17:30",
        customer: "Lê Văn Hùng",
        tour: "Đà Nẵng – Hội An 5N4Đ",
        amount: "15.200.000 đ",
        status: "Đã thanh toán",
    },
    {
        id: "#TK-00195",
        time: "21/05/2026 · 14:05",
        customer: "Phạm Thanh Hà",
        tour: "Sapa Trekking 3N2Đ",
        amount: "6.700.000 đ",
        status: "Đã hủy",
    },
    {
        id: "#TK-00194",
        time: "20/05/2026 · 11:22",
        customer: "Đỗ Quốc Bảo",
        tour: "Nha Trang biển xanh",
        amount: "9.100.000 đ",
        status: "Đã thanh toán",
    },
    {
        id: "#TK-00193",
        time: "20/05/2026 · 09:58",
        customer: "Vũ Thị Ngọc",
        tour: "Phú Quốc 4N3Đ",
        amount: "12.800.000 đ",
        status: "Chờ thanh toán",
    },
];