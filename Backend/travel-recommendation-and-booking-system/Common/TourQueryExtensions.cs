using System.Linq.Expressions;
using travel_recommendation_and_booking_system.DTOs.Tour;
using travel_recommendation_and_booking_system.Models;

namespace travel_recommendation_and_booking_system.Common
{
    public static class TourQueryExtensions
    {
        /// <summary>
        /// Điều kiện "tour hợp lệ để hiển thị cho khách" — dùng chung ở mọi hàm
        /// thay vì lặp lại đoạn Where dài ở 8 chỗ khác nhau trong TourService.
        /// </summary>
        public static IQueryable<Tour> WhereVisible(this IQueryable<Tour> query, DateTime now)
        {
            return query.Where(t => t.TrangThai == 1 && t.NgayXoa == null &&
                t.ChuyenKhoiHanhs.Any(c => c.NgayXoa == null &&
                    c.NgayKhoiHanh >= now &&
                    c.TrangThai != 3 && c.TrangThai != 4 &&
                    c.SoChoToiDa > 0 && (c.SoChoToiDa - c.SoChoDaDat) > 0));
        }

        /// <summary>
        /// Projection dùng chung sang TourCardDTO — sửa công thức 1 lần,
        /// áp dụng cho mọi hàm trả về danh sách card tour.
        /// LƯU Ý: yêu cầu query gốc đã Include đủ LoaiHinhTour, ChuyenKhoiHanhs.GiaChuyens,
        /// HinhAnhTours, DanhGias (hoặc để EF tự dịch sang SQL nếu chưa Include).
        /// </summary>
        public static readonly Expression<Func<Tour, TourCardDTO>> ToCardDTO = t => new TourCardDTO
        {
            MaTour = t.MaTour,
            TenTour = t.TenTour,
            slug = t.Slug,
            Ngay = t.Ngay,
            Dem = t.Dem,
            MaLoaiTour = t.MaLoaiTour,
            TenLoaiTour = t.LoaiHinhTour.TenLoaiTour,
            DiemDen = t.ChuyenKhoiHanhs.FirstOrDefault() != null
                ? t.ChuyenKhoiHanhs.FirstOrDefault().DiemDen
                : "Đang cập nhật",
            DuongDanAnh = t.HinhAnhTours.FirstOrDefault(a => a.AnhChinh == true).DuongDanAnh ?? "default-image.jpg",
            GiaChuyen = t.ChuyenKhoiHanhs.SelectMany(c => c.GiaChuyens).Any()
                ? t.ChuyenKhoiHanhs.SelectMany(c => c.GiaChuyens).Min(g => g.GiaNguoiLon)
                : 0,
            DiemDanhGia = t.DanhGias.Any() ? Math.Round(t.DanhGias.Average(d => (double)d.DiemDanhGia), 1) : 0,
            SoLuongDanhGia = t.DanhGias.Count(),
            LuotDat = t.LuotDat
        };
    }
}