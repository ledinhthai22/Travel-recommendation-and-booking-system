// Base URL cho file tĩnh (ảnh...) - KHÔNG có hậu tố /api
const IMAGE_BASE_URL = import.meta.env.VITE_SIGNAL_URL || "https://localhost:7016";

function buildImageUrl(path) {
    if (!path || typeof path !== "string" || !path.trim()) return null;

    if (path.startsWith("http://") || path.startsWith("https://")) {
        return path;
    }

    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${IMAGE_BASE_URL}${normalizedPath}`;
}

// HÀM MAP CHO SEARCH API
export function mapSearchApiTourToCard(tour) {
    return {
        id: tour.maTour,
        maTour: tour.maTour,
        slug: tour.slug,
        name: tour.tenTour,
        image: buildImageUrl(tour.duongDanAnh),
        destination: tour.diemDen || "Đang cập nhật",
        duration: tour.dem > 0 ? `${tour.ngay} ngày ${tour.dem} đêm` : `${tour.ngay} ngày`,
        ngay: tour.ngay,
        dem: tour.dem,
        price: Number(tour.giaTu ?? 0),
        rating: Number(tour.diemDanhGia ?? 0),
        reviewCount: Number(tour.soDanhGia ?? 0),
        tourType: tour.loaiHinhTour || null,
        maLoaiTour: tour.maLoaiTour ?? null,
        isFavorite: Boolean(tour.isFavorite),
        luotDat: tour.luotDat ?? 0,
        featured: false,
        category: "Tất cả",
    };
}

export function mapApiTourToCard(tour) {
    const isLocationShape = tour.hinhAnhChinh !== undefined || Array.isArray(tour.diemDens);

    if (isLocationShape) {
        return {
            id: tour.maTour,
            maTour: tour.maTour,
            slug: tour.slug,
            name: tour.tenTour,
            image: buildImageUrl(tour.hinhAnhChinh),
            destination: Array.isArray(tour.diemDens) ? tour.diemDens.join(", ") : "Đang cập nhật",
            duration: tour.dem > 0 ? `${tour.ngay} ngày ${tour.dem} đêm` : `${tour.ngay} ngày`,
            ngay: tour.ngay,
            dem: tour.dem,
            price: Number(tour.giaTu ?? 0),
            rating: Number(tour.diemDanhGia ?? 0),
            reviewCount: Number(tour.soDanhGia ?? 0), 
            tourType: null,
            isFavorite: false,
            featured: false,
            category: "Tất cả",
        };
    }

    return {
        id: tour.maTour,
        maTour: tour.maTour,
        slug: tour.slug,
        name: tour.tenTour,
        image: buildImageUrl(tour.duongDanAnh),
        destination: tour.diemDen || "Đang cập nhật",
        duration: tour.dem > 0 ? `${tour.ngay} ngày ${tour.dem} đêm` : `${tour.ngay} ngày`,
        ngay: tour.ngay,
        dem: tour.dem,
        price: Number(tour.giaChuyen ?? 0),
        rating: Number(tour.diemDanhGia ?? 0),
        reviewCount: Number(tour.soDanhGia ?? 0), // ⭐ Sửa thành soDanhGia (không phải soLuongDanhGia)
        tourType: tour.tenLoaiTour || null,
        maLoaiTour: tour.maLoaiTour ?? null,
        isFavorite: Boolean(tour.isFavorite),
        luotDat: tour.luotDat ?? 0,
        featured: false,
        category: "Tất cả",
    };
}