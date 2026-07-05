using System.Linq.Expressions;
using travel_recommendation_and_booking_system.DTOs.Tour;
using travel_recommendation_and_booking_system.DTOs.TypeTour;
using travel_recommendation_and_booking_system.Models;

namespace travel_recommendation_and_booking_system.Common
{
    public static class TourQueryExtensions
    {

        public static IQueryable<Tour> WhereVisible(this IQueryable<Tour> query, DateTime now)
        {
            return query.Where(t => t.TrangThai == 1 && t.NgayXoa == null &&
                t.ChuyenKhoiHanhs.Any(c => c.NgayXoa == null &&
                    c.NgayKhoiHanh >= now &&
                    c.TrangThai != 3 && c.TrangThai != 4 &&
                    c.SoChoToiDa > 0 && (c.SoChoToiDa - c.SoChoDaDat) > 0));
        }

       
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

     
        public static readonly Expression<Func<Tour, TourCardResponseDTO>> ToCardResponseDTO = t => new TourCardResponseDTO
        {
            MaTour = t.MaTour,
            TenTour = t.TenTour,
            Slug = t.Slug,
            MoTa = t.MoTa,
            Ngay = t.Ngay,
            Dem = t.Dem,
            TenLoaiTour = t.LoaiHinhTour.TenLoaiTour,

            GiaTu = t.ChuyenKhoiHanhs.SelectMany(c => c.GiaChuyens).Any()
                ? t.ChuyenKhoiHanhs.SelectMany(c => c.GiaChuyens).Min(g => g.GiaNguoiLon)
                : 0,

            HinhAnhChinh = t.HinhAnhTours
                .Where(i => i.NgayXoa == null)
                .OrderByDescending(i => i.AnhChinh)
                .Select(i => i.DuongDanAnh)
                .FirstOrDefault() ?? "default-image.jpg",

            DiemDens = t.ChuyenKhoiHanhs
                .Where(c => c.NgayXoa == null)
                .Select(c => c.DiemDen)
                .Distinct()
                .ToList(),

            SoDanhGia = t.DanhGias.Count(),
            DiemDanhGia = t.DanhGias.Any() ? Math.Round(t.DanhGias.Average(d => (double)d.DiemDanhGia), 1) : 0,

            LuotDat = t.LuotDat,
            LuotXem = t.LuotXem
        };
    }
}