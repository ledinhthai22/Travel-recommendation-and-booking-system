import { 
    BadgeDollarSign, 
    ShieldCheck, 
    HeadphonesIcon, 
    CalendarCheck 
} from 'lucide-react';
export const mockHotels = [
    { id: 1, name: 'Vinpearl Resort & Spa Hạ Long', location: 'Hạ Long', stars: 5, price: 2850000, originalPrice: 3500000, rating: 4.9, reviewCount: 842, badge: 'Bestseller', featured: true, amenities: ['Hồ bơi', 'Spa', 'Nhà hàng', 'WiFi', 'Gym', 'Bar'], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80' },
    { id: 2, name: 'InterContinental Đà Nẵng Sun Peninsula', location: 'Đà Nẵng', stars: 5, price: 5200000, originalPrice: null, rating: 4.9, reviewCount: 1023, badge: 'Sang trọng', featured: true, amenities: ['Hồ bơi', 'Spa', 'Nhà hàng', 'WiFi', 'Gym', 'Đưa đón'], image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80' },
    { id: 3, name: 'Mường Thanh Luxury Sapa', location: 'Sapa', stars: 4, price: 1290000, originalPrice: 1800000, rating: 4.7, reviewCount: 456, badge: null, featured: true, amenities: ['WiFi', 'Nhà hàng', 'Spa', 'Bãi đỗ xe'], image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80' },
    { id: 4, name: 'Novotel Phú Quốc Resort', location: 'Phú Quốc', stars: 5, price: 3100000, originalPrice: 3800000, rating: 4.8, reviewCount: 678, badge: null, featured: true, amenities: ['Hồ bơi', 'Nhà hàng', 'WiFi', 'Bar', 'Bãi đỗ xe', 'Đưa đón'], image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80' },
    { id: 5, name: 'Hội An Historic Hotel', location: 'Hội An', stars: 4, price: 980000, originalPrice: null, rating: 4.6, reviewCount: 312, badge: null, featured: false, amenities: ['WiFi', 'Hồ bơi', 'Nhà hàng', 'Spa'], image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80' },
    { id: 6, name: 'Dalat Palace Heritage Hotel', location: 'Đà Lạt', stars: 5, price: 2400000, originalPrice: 2900000, rating: 4.8, reviewCount: 289, badge: 'Di sản', featured: false, amenities: ['WiFi', 'Nhà hàng', 'Spa', 'Gym', 'Bar', 'Bãi đỗ xe'], image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80' },
    { id: 7, name: 'Sheraton Nha Trang Hotel & Spa', location: 'Nha Trang', stars: 5, price: 2650000, originalPrice: null, rating: 4.7, reviewCount: 534, badge: null, featured: false, amenities: ['Hồ bơi', 'Spa', 'Gym', 'WiFi', 'Nhà hàng', 'Bar'], image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80' },
    { id: 8, name: 'Silk Path Grand Huế', location: 'Huế', stars: 4, price: 1150000, originalPrice: 1400000, rating: 4.5, reviewCount: 198, badge: null, featured: false, amenities: ['WiFi', 'Hồ bơi', 'Nhà hàng', 'Bãi đỗ xe'], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80' },
    { id: 9, name: 'Park Hyatt Sài Gòn', location: 'TP. HCM', stars: 5, price: 4500000, originalPrice: 5200000, rating: 4.9, reviewCount: 1245, badge: 'Hot', featured: true, amenities: ['Hồ bơi', 'Spa', 'Gym', 'WiFi', 'Nhà hàng', 'Bar', 'Đưa đón'], image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80' },
    { id: 10, name: 'Sofitel Legend Metropole Hà Nội', location: 'Hà Nội', stars: 5, price: 5800000, originalPrice: null, rating: 4.9, reviewCount: 967, badge: 'Iconic', featured: true, amenities: ['Spa', 'Hồ bơi', 'Nhà hàng', 'WiFi', 'Bar', 'Gym'], image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80' },
    { id: 11, name: 'Anantara Hội An Resort', location: 'Hội An', stars: 5, price: 3750000, originalPrice: 4500000, rating: 4.8, reviewCount: 423, badge: null, featured: false, amenities: ['Hồ bơi', 'Spa', 'Nhà hàng', 'WiFi', 'Đưa đón'], image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80' },
    { id: 12, name: 'Fleur De Lys Boutique Đà Lạt', location: 'Đà Lạt', stars: 3, price: 650000, originalPrice: null, rating: 4.4, reviewCount: 156, badge: null, featured: false, amenities: ['WiFi', 'Nhà hàng', 'Bãi đỗ xe'], image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80' },
];

export const LOCATIONS = ['Tất cả', 'Hà Nội', 'TP. HCM', 'Đà Nẵng', 'Hội An', 'Phú Quốc', 'Sapa', 'Đà Lạt', 'Nha Trang', 'Hạ Long', 'Huế'];
export const STARS_OPTIONS = [
    { value: 'Tất cả', label: 'Hạng sao' },
    { value: '3', label: '3 ★' },
    { value: '4', label: '4 ★' },
    { value: '5', label: '5 ★' },
];
export const AMENITY_LIST = ['Hồ bơi', 'Spa', 'Gym', 'WiFi', 'Nhà hàng', 'Bar', 'Bãi đỗ xe', 'Đưa đón'];
export const SORTS = [
    { value: 'featured', label: 'Nổi bật' },
    { value: 'price_asc', label: 'Giá thấp → cao' },
    { value: 'price_desc', label: 'Giá cao → thấp' },
    { value: 'rating', label: 'Đánh giá cao nhất' },
];
export const PAGE_SIZE = 6;

export const TRUST_ITEMS = [
    { Icon: BadgeDollarSign, title: 'Giá tốt nhất', desc: 'Hoàn tiền nếu tìm được giá rẻ hơn' },
    { Icon: ShieldCheck, title: 'Đã xác minh', desc: 'Mọi khách sạn đều được kiểm duyệt' },
    { Icon: HeadphonesIcon, title: 'Hỗ trợ 24/7', desc: 'Luôn sẵn sàng hỗ trợ bạn' },
    { Icon: CalendarCheck, title: 'Hủy miễn phí', desc: 'Linh hoạt hủy trước giờ nhận phòng' },
];