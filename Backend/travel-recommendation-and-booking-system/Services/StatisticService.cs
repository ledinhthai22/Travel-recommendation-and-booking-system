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
            var startOfPreviousMonth = startOfCurrentMonth.AddMonths(-1);

            // Tổng đơn đặt tour
            var totalBookings = await _context.DonDatTours.CountAsync();

            // Tổng doanh thu từ thanh toán thành công
            var totalRevenue = await _context.ThanhToans
                .Where(t => t.TrangThaiThanhToan == 1)
                .SumAsync(t => t.TongTienThanhToan);

            // Khách hàng mới (MaVaiTro == 4)
            var newCustomers = await _context.NguoiDungs
                .CountAsync(u => u.NgayTao >= startOfCurrentMonth &&
                         u.NgayTao < startOfCurrentMonth.AddMonths(1) &&
                         u.MaVaiTro == 4);

            // Tour đang diễn ra
            var activeTours = await _context.ChuyenKhoiHanhs
                .CountAsync(c => c.NgayKhoiHanh <= currentDate &&
                                 c.NgayKetThuc >= currentDate &&
                                 c.TrangThai == 2);

            // Doanh thu tháng trước
            var prevRevenue = await _context.ThanhToans
                .Where(t => t.NgayThanhToan >= startOfPreviousMonth &&
                            t.NgayThanhToan < startOfCurrentMonth &&
                            t.TrangThaiThanhToan == 1)
                .SumAsync(t => t.TongTienThanhToan);

            var revenueGrowth = prevRevenue > 0
                ? Math.Round((totalRevenue - prevRevenue) * 100m / prevRevenue, 1)
                : 0m;

            return new DashboardOverviewDTO
            {
                TotalBookings = totalBookings,
                TotalRevenue = totalRevenue,
                NewCustomersThisMonth = newCustomers,
                ActiveTours = activeTours,
                RevenueGrowthPercent = revenueGrowth,
                BookingGrowthPercent = 12
            };
        }

        public async Task<RevenueChartDTO> GetRevenueChartAsync(int year)
        {
            var rawData = await _context.ThanhToans
                .Where(t => t.NgayThanhToan.Year == year && t.TrangThaiThanhToan == 1)
                .GroupBy(t => t.NgayThanhToan.Month)
                .Select(g => new { MonthNumber = g.Key, Revenue = g.Sum(t => t.TongTienThanhToan) })
                .ToListAsync();

            var result = new List<RevenueItemDTO>();
            for (int i = 1; i <= 12; i++)
            {
                var existing = rawData.FirstOrDefault(x => x.MonthNumber == i);
                result.Add(new RevenueItemDTO
                {
                    Month = $"Tháng {i}",
                    Revenue = existing?.Revenue ?? 0
                });
            }

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
                // SỬA Ở ĐÂY - Dùng destructuring
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
            var query = _context.DonDatTours
                .Include(d => d.ChuyenKhoiHanh!)
                    .ThenInclude(c => c.Tour).AsQueryable();

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

            var ages = await _context.NguoiDungs
                .Where(u => u.NgaySinh.HasValue && u.MaVaiTro == 4)
                .Select(u => currentYear - u.NgaySinh.Value.Year)
                .ToListAsync();

            var groupDefs = new List<(string Name, int Min, int Max)>
            {
                ("18-24", 18, 24),
                ("25-34", 25, 34),
                ("35-44", 35, 44),
                ("45-54", 45, 54),
                ("55+", 55, 200)
            };

            var groups = groupDefs.Select(d => new CustomerAgeGroupDTO
            {
                GroupName = d.Name,
                Count = ages.Count(a => a >= d.Min && a <= d.Max)
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
            return new List<TourEngagementDTO>
            {
                new() { Name = "Lượt xem", Value = 12480, Color = "#8B5CF6" },
                new() { Name = "Yêu thích", Value = 3240, Color = "#EC4899" },
                new() { Name = "Đặt tour", Value = 1248, Color = "#10B981" }
            };
        }
    }
}