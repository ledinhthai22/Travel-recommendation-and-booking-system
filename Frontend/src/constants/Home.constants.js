import {
    Award, ShieldCheck, Headphones, BadgeDollarSign,
    Users, Compass, Heart, Mountain, Coffee
} from 'lucide-react';
export const destinations = [
    { name: "Phú Quốc", country: "Việt Nam", img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80", tours: 142, rating: "4.9" },
    { name: "Đà Lạt", country: "Việt Nam", img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80", tours: 98, rating: "4.8" },
    { name: "Hội An", country: "Việt Nam", img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80", tours: 87, rating: "4.9" },
    { name: "Maldives", country: "Maldives", img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80", tours: 52, rating: "5.0" },
];

export const bestTours = [
    { id: 1, name: "Phú Quốc 4N3Đ All-Inclusive Resort", destination: "Phú Quốc", duration: "4 Ngày 3 Đêm", groupSize: "12", price: 6990000, originalPrice: 8900000, rating: 4.9, reviewCount: 342, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80", category: "Nghỉ dưỡng" },
    { id: 2, name: "Châu Âu 8N7Đ Pháp & Thụy Sĩ", destination: "Châu Âu", duration: "8 Ngày 7 Đêm", groupSize: "8", price: 68000000, originalPrice: null, rating: 5.0, reviewCount: 128, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80", category: "Cao cấp" },
    { id: 3, name: "Bali 5N4Đ Luxury Escape", destination: "Bali", duration: "5 Ngày 4 Đêm", groupSize: "10", price: 15900000, originalPrice: 19500000, rating: 4.8, reviewCount: 289, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80", category: "Romance" },
    { id: 4, name: "Sapa - Fansipan 3N2Đ", destination: "Sapa", duration: "3 Ngày 2 Đêm", groupSize: "15", price: 3690000, originalPrice: 5200000, rating: 4.7, reviewCount: 167, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80", category: "Mạo hiểm" },
    { id: 5, name: "Đà Nẵng - Hội An 4N3Đ", destination: "Đà Nẵng", duration: "4 Ngày 3 Đêm", groupSize: "20", price: 4500000, originalPrice: 6200000, rating: 4.8, reviewCount: 215, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80", category: "Văn hóa" },
    { id: 6, name: "Nhật Bản 7N6Đ Tokyo & Kyoto", destination: "Nhật Bản", duration: "7 Ngày 6 Đêm", groupSize: "12", price: 42000000, originalPrice: 52000000, rating: 4.9, reviewCount: 98, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80", category: "Khám phá" },
    { id: 7, name: "Nha Trang 3N2Đ Biển Xanh", destination: "Nha Trang", duration: "3 Ngày 2 Đêm", groupSize: "25", price: 2990000, originalPrice: 4200000, rating: 4.6, reviewCount: 410, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80", category: "Biển đảo" },
];

export const hotDeals = bestTours.slice(0, 7);

export const stats = [
    { number: "50,000+", label: "Khách hàng hài lòng" },
    { number: "350+", label: "Tour đa dạng" },
    { number: "45", label: "Quốc gia" },
    { number: "4.9", label: "Đánh giá trung bình" },
];

export const whyUs = [
    { Icon: Award, title: "12 năm kinh nghiệm", desc: "Hơn 50,000 khách hàng tin tưởng đồng hành cùng chúng tôi" },
    { Icon: ShieldCheck, title: "Cam kết hoàn tiền", desc: "100% hoàn tiền nếu hủy tour trước 15 ngày khởi hành" },
    { Icon: Headphones, title: "Hỗ trợ 24/7", desc: "Đội ngũ tư vấn luôn sẵn sàng hỗ trợ bạn mọi lúc mọi nơi" },
    { Icon: BadgeDollarSign, title: "Giá tốt nhất", desc: "Cam kết giá thấp hơn hoặc hoàn tiền bù chênh lệch" },
];

export const travelCategories = [
    { Icon: Heart, label: "Nghỉ dưỡng cao cấp", tours: 84, slug: "resort" },
    { Icon: Mountain, label: "Mạo hiểm & Trekking", tours: 62, slug: "adventure" },
    { Icon: Coffee, label: "Ẩm thực & Văn hóa", tours: 51, slug: "culture" },
    { Icon: Heart, label: "Trăng mật & Lãng mạn", tours: 48, slug: "honeymoon" },
    { Icon: Users, label: "Gia đình & Trẻ em", tours: 73, slug: "family" },
    { Icon: Compass, label: "Khám phá bí ẩn", tours: 39, slug: "explore" },
];

export const testimonials = [
    { name: "Nguyễn Thị Lan", initials: "NL", tour: "Phú Quốc 4N3Đ", rating: 5, text: "Dịch vụ tuyệt vời, hướng dẫn viên nhiệt tình và chuyên nghiệp. Gia đình tôi rất hài lòng với chuyến đi này, sẽ quay lại ngay!" },
    { name: "Trần Minh Khoa", initials: "MK", tour: "Châu Âu 8N7Đ", rating: 5, text: "Lần đầu đi Châu Âu mà không lo lắng gì cả nhờ đội ngũ Lối Riêng sắp xếp chu đáo từ A đến Z. Chắc chắn sẽ book tiếp!" },
    { name: "Phạm Thu Hương", initials: "TH", tour: "Bali 5N4Đ", rating: 5, text: "Giá tốt, khách sạn đẹp hơn mong đợi rất nhiều. Chồng tôi bất ngờ vì honeymoon quá hoàn hảo. Cảm ơn team Lối Riêng!" },
];

export const blogPosts = [
    { id: 1, title: "Top 10 bãi biển đẹp nhất Phú Quốc 2025", category: "Khám phá", date: "02/05/2025", readTime: "5 phút", img: "" },
    { id: 2, title: "Kinh nghiệm du lịch Bali tự túc tiết kiệm nhất", category: "Kinh nghiệm", date: "29/04/2025", readTime: "8 phút", img: "" },
    { id: 3, title: "Mùa nào đẹp nhất để đến Đà Lạt thưởng hoa?", category: "Tư vấn", date: "25/04/2025", readTime: "4 phút", img: "" },
    { id: 4, title: "Top 10 bãi biển đẹp nhất Phú Quốc 2025", category: "Khám phá", date: "02/05/2025", readTime: "5 phút", img: "" },
    { id: 5, title: "Top 10 bãi biển đẹp nhất Phú Quốc 2025", category: "Khám phá", date: "02/05/2025", readTime: "5 phút", img: "" },
];

export const partners = ["Vietnam Airlines", "Vietravel", "Booking.com", "TripAdvisor", "IATA Certified", "ISO 9001"];
export const travelPlaces = {
    domestic: [
        {
            name: 'Đà Nẵng',
            desc: 'Biển đẹp, cầu Rồng, Bà Nà Hills',
            slug: 'da-nang',
        },
        {
            name: 'Đà Lạt',
            desc: 'Khí hậu mát mẻ, săn mây, nghỉ dưỡng',
            slug: 'da-lat',
        },
        {
            name: 'Phú Quốc',
            desc: 'Đảo ngọc, resort, biển xanh',
            slug: 'phu-quoc',
        },
    ],
    international: [
        {
            name: 'Thái Lan',
            desc: 'Bangkok, Phuket, Chiang Mai',
            slug: 'thai-lan',
        },
        {
            name: 'Singapore',
            desc: 'Hiện đại, sạch đẹp, dễ đi',
            slug: 'singapore',
        },
        {
            name: 'Hàn Quốc',
            desc: 'Seoul, Jeju, mùa hoa anh đào',
            slug: 'han-quoc',
        },
    ],
};