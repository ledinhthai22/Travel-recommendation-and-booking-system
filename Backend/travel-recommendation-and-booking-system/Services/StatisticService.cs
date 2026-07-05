using Microsoft.EntityFrameworkCore;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.Dtos.Statistics;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Models;

namespace travel_recommendation_and_booking_system.Services
{
    public class StatisticService : IStatisticService
    {
        private readonly AppDbContext _context;

        public StatisticService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<DashboardOverviewDTO> GetDashboardOverviewAsync(int? year = null, int? month = null)
        {
            var currentDate = DateTime.Now;
            var targetYear = year ?? currentDate.Year;
            var targetMonth = month ?? currentDate.Month;

            var startOfCurrentMonth = new DateTime(targetYear, targetMonth, 1);
            var endOfCurrentMonth = startOfCurrentMonth.AddMonths(1);
            var startOfPreviousMonth = startOfCurrentMonth.AddMonths(-1);

            bool isCurrentMonthInProgress = targetYear == currentDate.Year
                                             && targetMonth == currentDate.Month;

            var currentPeriodEnd = isCurrentMonthInProgress
                ? currentDate
                : endOfCurrentMonth;

            var previousPeriodEnd = isCurrentMonthInProgress
                ? startOfPreviousMonth.AddDays((currentDate - startOfCurrentMonth).Days)
                : startOfCurrentMonth;

            // Bookings
            var bookingStats = await _context.DonDatTours
                .Where(d => (d.NgayDat >= startOfCurrentMonth && d.NgayDat < currentPeriodEnd)
                         || (d.NgayDat >= startOfPreviousMonth && d.NgayDat < previousPeriodEnd))
                .GroupBy(d => d.NgayDat >= startOfCurrentMonth)
                .Select(g => new { IsCurrent = g.Key, Count = g.Count() })
                .ToListAsync();

            var totalBookings = bookingStats.FirstOrDefault(x => x.IsCurrent)?.Count ?? 0;
            var prevBookings = bookingStats.FirstOrDefault(x => !x.IsCurrent)?.Count ?? 0;

            //  Revenue
            var revenueStats = await _context.ThanhToans
                .Where(t => t.TrangThaiThanhToan == 1 &&
                            ((t.NgayThanhToan >= startOfCurrentMonth && t.NgayThanhToan < currentPeriodEnd)
                          || (t.NgayThanhToan >= startOfPreviousMonth && t.NgayThanhToan < previousPeriodEnd)))
                .GroupBy(t => t.NgayThanhToan >= startOfCurrentMonth)
                .Select(g => new { IsCurrent = g.Key, Revenue = g.Sum(t => t.TongTienThanhToan) })
                .ToListAsync();

            var totalRevenue = revenueStats.FirstOrDefault(x => x.IsCurrent)?.Revenue ?? 0m;
            var prevRevenue = revenueStats.FirstOrDefault(x => !x.IsCurrent)?.Revenue ?? 0m;

            // New customers
            var customerStats = await _context.KhachHangs
                .Where(k => k.LoaiKhach == 1
                         && k.DonDatTour.TrangThaiDon != 4
                         && ((k.DonDatTour.NgayDat >= startOfCurrentMonth && k.DonDatTour.NgayDat < currentPeriodEnd)
                          || (k.DonDatTour.NgayDat >= startOfPreviousMonth && k.DonDatTour.NgayDat < previousPeriodEnd)))
                .GroupBy(k => k.DonDatTour.NgayDat >= startOfCurrentMonth)
                .Select(g => new { IsCurrent = g.Key, Count = g.Count() })
                .ToListAsync();

            var newCustomers = customerStats.FirstOrDefault(x => x.IsCurrent)?.Count ?? 0;
            var prevNewCustomers = customerStats.FirstOrDefault(x => !x.IsCurrent)?.Count ?? 0;

            // Active tours
            var tourWindows = await _context.ChuyenKhoiHanhs
                .Where(c => c.NgayXoa == null &&
                            ((c.NgayKhoiHanh < endOfCurrentMonth && c.NgayKetThuc >= startOfCurrentMonth)
                          || (c.NgayKhoiHanh < startOfCurrentMonth && c.NgayKetThuc >= startOfPreviousMonth)))
                .Select(c => new { c.NgayKhoiHanh, c.NgayKetThuc })
                .ToListAsync();

            var activeTours = tourWindows.Count(c => c.NgayKhoiHanh < endOfCurrentMonth && c.NgayKetThuc >= startOfCurrentMonth);
            var prevActiveTours = tourWindows.Count(c => c.NgayKhoiHanh < startOfCurrentMonth && c.NgayKetThuc >= startOfPreviousMonth);

            return new DashboardOverviewDTO
            {
                TotalBookings = totalBookings,
                TotalRevenue = totalRevenue,
                NewCustomersThisMonth = newCustomers,
                ActiveTours = activeTours,
                RevenueGrowthPercent = CalculateGrowthPercent(totalRevenue, prevRevenue),
                BookingGrowthPercent = CalculateGrowthPercent(totalBookings, prevBookings),
                NewCustomersGrowthPercent = CalculateGrowthPercent(newCustomers, prevNewCustomers),
                ActiveToursGrowthPercent = CalculateGrowthPercent(activeTours, prevActiveTours)
            };
        }

        private static decimal? CalculateGrowthPercent(decimal current, decimal previous)
        {
            if (previous == 0)
                return current == 0 ? 0m : (decimal?)null;

            return Math.Round((current - previous) * 100m / previous, 1);
        }

        private static decimal? CalculateGrowthPercent(int current, int previous)
            => CalculateGrowthPercent((decimal)current, (decimal)previous);

        public async Task<RevenueChartDTO> GetRevenueChartAsync(int year)
        {
            var rawData = await _context.ThanhToans
                .Where(t => t.NgayThanhToan.Year == year && t.TrangThaiThanhToan == 1)
                .GroupBy(t => t.NgayThanhToan.Month)
                .Select(g => new { MonthNumber = g.Key, Revenue = g.Sum(t => t.TongTienThanhToan) })
                .ToListAsync();

            var lookup = rawData.ToDictionary(x => x.MonthNumber, x => x.Revenue);

            var result = Enumerable.Range(1, 12)
                .Select(i => new RevenueItemDTO
                {
                    Month = $"Tháng {i}",
                    Revenue = lookup.GetValueOrDefault(i, 0m)
                })
                .ToList();

            return new RevenueChartDTO { Data = result };
        }

        public async Task<List<OrderStatusDTO>> GetOrderStatusAsync(int? month = null, int? year = null)
        {
            var query = _context.DonDatTours.AsQueryable();

            if (year.HasValue) query = query.Where(d => d.NgayDat.Year == year.Value);
            if (month.HasValue) query = query.Where(d => d.NgayDat.Month == month.Value);

            var statusGroups = await query
                .GroupBy(d => d.TrangThaiDon)
                .Select(g => new { Status = g.Key, Count = g.Count() })
                .ToListAsync();

            var total = statusGroups.Sum(x => x.Count) == 0 ? 1 : statusGroups.Sum(x => x.Count);

            var statusMap = new Dictionary<int, (string Name, string Color)>
            {
                { 1, ("Chờ duyệt", "#F59E0B") },
                { 2, ("Đã duyệt", "#3B82F6") },
                { 3, ("Hoàn tất", "#10B981") },
                { 4, ("Đã hủy", "#EF4444") }
            };

            return statusGroups.Select(g =>
            {
                var (statusName, statusColor) = statusMap.GetValueOrDefault(g.Status, ("Khác", "#6B7280"));

                return new OrderStatusDTO
                {
                    StatusName = statusName,
                    Count = g.Count,
                    Percentage = Math.Round((decimal)g.Count * 100 / total, 1),
                    Color = statusColor
                };
            }).ToList();
        }

        public async Task<List<TopTourDTO>> GetTopToursAsync(int limit = 5, int? month = null, int? year = null)
        {
            
            var query = _context.DonDatTours.AsQueryable();

            if (year.HasValue) query = query.Where(d => d.NgayDat.Year == year.Value);
            if (month.HasValue) query = query.Where(d => d.NgayDat.Month == month.Value);

            return await query
                .GroupBy(d => new
                {
                    d.ChuyenKhoiHanh!.Tour.MaTour,
                    d.ChuyenKhoiHanh!.Tour.TenTour
                })
                .Select(g => new TopTourDTO
                {
                    MaTour = g.Key.MaTour,
                    TenTour = g.Key.TenTour,
                    BookedCount = g.Count(),
                    Revenue = g.Sum(d => d.TongTien)
                })
                .OrderByDescending(x => x.BookedCount)
                .Take(limit)
                .ToListAsync();
        }

        public async Task<List<CustomerAgeGroupDTO>> GetCustomerAgeGroupsAsync()
        {
            var currentYear = DateTime.Now.Year;

            var groupDefs = new List<(string Name, int Min, int Max)>
            {
                ("18-24", 18, 24),
                ("25-34", 25, 34),
                ("35-44", 35, 44),
                ("45-54", 45, 54),
                ("55+", 55, 200)
            };

         
            var groupedAges = await _context.KhachHangs
                .Where(k => k.NgaySinh != default
                         && k.LoaiKhach == 1
                         && k.DonDatTour.TrangThaiDon != 4)
                .Select(k => currentYear - k.NgaySinh.Year)
                .GroupBy(age => age < 25 ? "18-24"
                              : age < 35 ? "25-34"
                              : age < 45 ? "35-44"
                              : age < 55 ? "45-54"
                              : "55+")
                .Select(g => new { GroupName = g.Key, Count = g.Count() })
                .ToListAsync();

            var countLookup = groupedAges.ToDictionary(x => x.GroupName, x => x.Count);

            var groups = groupDefs.Select(d => new CustomerAgeGroupDTO
            {
                GroupName = d.Name,
                Count = countLookup.GetValueOrDefault(d.Name, 0)
            }).ToList();

            var total = groups.Sum(g => g.Count) == 0 ? 1 : groups.Sum(g => g.Count);

            foreach (var g in groups)
            {
                g.Percentage = Math.Round((decimal)g.Count * 100 / total, 1);
            }

            return groups;
        }

        public async Task<List<NewCustomerTrendDTO>> GetNewCustomerTrendAsync(int year)
        {
            var rawData = await _context.NguoiDungs
                .Where(u => u.NgayTao.Year == year && u.MaVaiTro == 4)
                .GroupBy(u => u.NgayTao.Month)
                .Select(g => new { Month = g.Key, CustomerCount = g.Count() })
                .OrderBy(x => x.Month)
                .ToListAsync();

            return rawData.Select(x => new NewCustomerTrendDTO
            {
                Month = $"Tháng {x.Month}",
                CustomerCount = x.CustomerCount
            }).ToList();
        }

        public async Task<List<TourEngagementDTO>> GetTourEngagementAsync(int? month = null, int? year = null)
        {
            var bookedQuery = _context.DonDatTours.AsQueryable();
            if (year.HasValue) bookedQuery = bookedQuery.Where(d => d.NgayDat.Year == year.Value);
            if (month.HasValue) bookedQuery = bookedQuery.Where(d => d.NgayDat.Month == month.Value);

            var bookedCount = await bookedQuery.CountAsync();
            var favoriteCount = await _context.Set<DanhSachYeuThich>().CountAsync();

            const int viewCount = 0;

            return new List<TourEngagementDTO>
            {
                new() { Name = "Lượt xem", Value = viewCount, Color = "#8B5CF6" },
                new() { Name = "Yêu thích", Value = favoriteCount, Color = "#EC4899" },
                new() { Name = "Đặt tour", Value = bookedCount, Color = "#10B981" }
            };
        }

        public async Task<List<RecentTransactionDTO>> GetRecentTransactionsAsync(int limit = 6)
        {
            var statusMap = new Dictionary<int, string>
            {
                { 0, "Chờ thanh toán" },
                { 1, "Đã thanh toán" },
                { 2, "Đã hủy" }
            };

           
            var raw = await _context.ThanhToans
                .OrderByDescending(t => t.NgayThanhToan)
                .Take(limit)
                .Select(t => new
                {
                    t.DonDatTour!.MaDonDatTour,
                    CustomerName = t.DonDatTour.NguoiDung != null ? t.DonDatTour.NguoiDung.HoTen : null,
                    TourName = t.DonDatTour.ChuyenKhoiHanh != null && t.DonDatTour.ChuyenKhoiHanh.Tour != null
                        ? t.DonDatTour.ChuyenKhoiHanh.Tour.TenTour
                        : null,
                    t.TongTienThanhToan,
                    t.TrangThaiThanhToan,
                    t.NgayThanhToan
                })
                .ToListAsync();

            return raw.Select(t => new RecentTransactionDTO
            {
                MaDon = t.MaDonDatTour,
                CustomerName = t.CustomerName ?? "Khách vãng lai",
                TourName = t.TourName ?? "—",
                Amount = t.TongTienThanhToan,
                Status = statusMap.GetValueOrDefault(t.TrangThaiThanhToan, "Không xác định"),
                Time = t.NgayThanhToan
            }).ToList();
        }
    }
}