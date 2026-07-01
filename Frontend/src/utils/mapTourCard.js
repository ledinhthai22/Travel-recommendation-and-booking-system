export function mapApiTourToCard(tour) {
    const isLocationShape = tour.hinhAnhChinh !== undefined || Array.isArray(tour.diemDens);

    if (isLocationShape) {
        return {
            id: tour.maTour,
            maTour: tour.maTour,
            slug: tour.slug,
            name: tour.tenTour,
            image: `https://localhost:7016${tour.hinhAnhChinh || ""}`,
            destination: Array.isArray(tour.diemDens) ? tour.diemDens.join(", ") : "Đang cập nhật",
            duration: tour.dem > 0 ? `${tour.ngay} ngày ${tour.dem} đêm` : `${tour.ngay} ngày`,
            ngay: tour.ngay,
            dem: tour.dem,
            price: Number(tour.giaTu ?? 0),
            // các field API location KHÔNG trả về -> đặt default rõ ràng, không để undefined
            rating: 0,
            reviewCount: 0,
            tourType: null,
            isFavorite: false,
            featured: false,
            category: "Tất cả",
        };
    }

    // Mặc định: TourCardDTO
    return {
        id: tour.maTour,
        maTour: tour.maTour,
        slug: tour.slug,
        name: tour.tenTour,
        image: `https://localhost:7016${tour.duongDanAnh || ""}`,
        destination: tour.diemDen || "Đang cập nhật",
        duration: tour.dem > 0 ? `${tour.ngay} ngày ${tour.dem} đêm` : `${tour.ngay} ngày`,
        ngay: tour.ngay,
        dem: tour.dem,
        price: Number(tour.giaChuyen ?? 0),
        rating: Number(tour.diemDanhGia ?? 0),
        reviewCount: Number(tour.soLuongDanhGia ?? 0),
        tourType: tour.tenLoaiTour || null,
        maLoaiTour: tour.maLoaiTour ?? null,
        isFavorite: Boolean(tour.isFavorite),
        luotDat: tour.luotDat ?? 0,
        featured: false,
        category: "Tất cả",
    };
}