using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.EntityFrameworkCore;
using travel_recommendation_and_booking_system.Constants;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.Dtos.Statistics;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Models;

namespace travel_recommendation_and_booking_system.Services
{
    public class StatisticService : IStatisticService
    {
        private readonly AppDbContext _context;
        private const string CompanyName = "LỐI RIÊNG TRAVEL";
        private const string CompanyAddress = ".........,Việt Nam";

        #region Constants - Sử dụng từ BookingConstants

        // Trạng thái đơn
        private const int DON_CHO_THANH_TOAN = BookingConstants.DON_CHO_THANH_TOAN;
        private const int DON_CHO_DUYET = BookingConstants.DON_CHO_DUYET;
        private const int DON_DA_DUYET = BookingConstants.DON_DA_DUYET;
        private const int DON_DANG_DIEN_RA = BookingConstants.DON_DANG_DIEN_RA;
        private const int DON_HOAN_TAT = BookingConstants.DON_HOAN_TAT;
        private const int DON_DA_HUY = BookingConstants.DON_DA_HUY;

        // Trạng thái tài chính
        private const int TC_CHUA_THANH_TOAN = BookingConstants.TC_CHUA_THANH_TOAN;
        private const int TC_DA_DAT_COC = BookingConstants.TC_DA_DAT_COC;
        private const int TC_DA_THANH_TOAN_DU = BookingConstants.TC_DA_THANH_TOAN_DU;
        private const int TC_DANG_HOAN_TIEN = BookingConstants.TC_DANG_HOAN_TIEN;
        private const int TC_DA_HOAN_TIEN = BookingConstants.TC_DA_HOAN_TIEN;
        private const int TC_MAT_COC = BookingConstants.TC_MAT_COC;

        // Trạng thái thanh toán
        private const int TT_THANH_CONG = BookingConstants.TT_THANH_CONG;

        #endregion

        public StatisticService(AppDbContext context)
        {
            _context = context;
        }

        private static bool IsOrderActive(int status)
        {
            return BookingConstants.IsOrderActive(status);
        }

        private static bool IsOrderCancelled(int status)
        {
            return BookingConstants.IsOrderCancelled(status);
        }

        private static string GetOrderStatusName(int status)
        {
            return BookingConstants.GetOrderStatusName(status);
        }

        private static string GetOrderStatusColor(int status)
        {
            return status switch
            {
                DON_CHO_THANH_TOAN => "#F59E0B",
                DON_CHO_DUYET => "#3B82F6",
                DON_DA_DUYET => "#0EA5E9",
                DON_DANG_DIEN_RA => "#6366F1",
                DON_HOAN_TAT => "#10B981",
                DON_DA_HUY => "#EF4444",
                _ => "#6B7280"
            };
        }

        private static string GetFinancialStatusName(int status)
        {
            return BookingConstants.GetFinancialStatusName(status);
        }

        private static decimal? CalculateGrowthPercent(decimal current, decimal previous)
        {
            if (previous == 0)
                return current == 0 ? 0m : (decimal?)null;
            return Math.Round((current - previous) * 100m / previous, 1);
        }

        private static decimal? CalculateGrowthPercent(int current, int previous)
            => CalculateGrowthPercent((decimal)current, (decimal)previous);

        #region Overview Methods

        public async Task<DashboardOverviewDTO> GetDashboardOverviewAsync(int? year = null, int? month = null)
        {
            var currentDate = DateTime.Now;
            var targetYear = year ?? currentDate.Year;
            var targetMonth = month ?? currentDate.Month;

            var startOfCurrentMonth = new DateTime(targetYear, targetMonth, 1);
            var endOfCurrentMonth = startOfCurrentMonth.AddMonths(1);
            var startOfPreviousMonth = startOfCurrentMonth.AddMonths(-1);

            bool isCurrentMonth = targetYear == currentDate.Year && targetMonth == currentDate.Month;
            var currentEnd = isCurrentMonth ? currentDate : endOfCurrentMonth;
            var previousEnd = isCurrentMonth
                ? startOfPreviousMonth.AddDays((currentDate - startOfCurrentMonth).Days)
                : startOfCurrentMonth;

            return await GetOverviewForRangeAsync(
                startOfCurrentMonth, currentEnd,
                startOfPreviousMonth, previousEnd);
        }

        public async Task<DashboardOverviewDTO> GetYearOverviewAsync(int? year = null)
        {
            var currentDate = DateTime.Now;
            var targetYear = year ?? currentDate.Year;

            var startOfCurrentYear = new DateTime(targetYear, 1, 1);
            var endOfCurrentYear = startOfCurrentYear.AddYears(1);
            var startOfPreviousYear = startOfCurrentYear.AddYears(-1);

            bool isCurrentYear = targetYear == currentDate.Year;
            var currentEnd = isCurrentYear ? currentDate : endOfCurrentYear;
            var previousEnd = isCurrentYear
                ? startOfPreviousYear.AddDays((currentDate - startOfCurrentYear).Days)
                : startOfCurrentYear;

            return await GetOverviewForRangeAsync(
                startOfCurrentYear, currentEnd,
                startOfPreviousYear, previousEnd);
        }

        private async Task<DashboardOverviewDTO> GetOverviewForRangeAsync(
            DateTime currentStart, DateTime currentEnd,
            DateTime previousStart, DateTime previousEnd)
        {
            var bookingStats = await _context.DonDatTours
                .Where(d => (d.NgayDat >= currentStart && d.NgayDat < currentEnd)
                         || (d.NgayDat >= previousStart && d.NgayDat < previousEnd))
                .GroupBy(d => d.NgayDat >= currentStart)
                .Select(g => new { IsCurrent = g.Key, Count = g.Count() })
                .AsNoTracking()
                .ToListAsync();

            var totalBookings = bookingStats.FirstOrDefault(x => x.IsCurrent)?.Count ?? 0;
            var prevBookings = bookingStats.FirstOrDefault(x => !x.IsCurrent)?.Count ?? 0;

            var revenueStats = await _context.ThanhToans
                .Where(t => t.TrangThaiThanhToan == TT_THANH_CONG &&
                            ((t.NgayThanhToan >= currentStart && t.NgayThanhToan < currentEnd)
                          || (t.NgayThanhToan >= previousStart && t.NgayThanhToan < previousEnd)))
                .GroupBy(t => t.NgayThanhToan >= currentStart)
                .Select(g => new { IsCurrent = g.Key, Revenue = g.Sum(t => t.TongTienThanhToan) })
                .AsNoTracking()
                .ToListAsync();

            var totalRevenue = revenueStats.FirstOrDefault(x => x.IsCurrent)?.Revenue ?? 0m;
            var prevRevenue = revenueStats.FirstOrDefault(x => !x.IsCurrent)?.Revenue ?? 0m;

            var passengerIds = await _context.DonDatTours
                .Where(d => d.TrangThaiDon != DON_DA_HUY &&
                           ((d.NgayDat >= currentStart && d.NgayDat < currentEnd)
                         || (d.NgayDat >= previousStart && d.NgayDat < previousEnd)))
                .Select(d => new { d.MaNguoiDung, d.NgayDat })
                .AsNoTracking()
                .ToListAsync();

            var currentPassengers = passengerIds
                .Where(x => x.NgayDat >= currentStart && x.NgayDat < currentEnd)
                .Select(x => x.MaNguoiDung)
                .Distinct()
                .Count();

            var prevPassengers = passengerIds
                .Where(x => x.NgayDat >= previousStart && x.NgayDat < previousEnd)
                .Select(x => x.MaNguoiDung)
                .Distinct()
                .Count();

            var tourWindows = await _context.ChuyenKhoiHanhs
                .Where(c => c.NgayXoa == null &&
                            ((c.NgayKhoiHanh < currentEnd && c.NgayKetThuc >= currentStart)
                          || (c.NgayKhoiHanh < previousEnd && c.NgayKetThuc >= previousStart)))
                .Select(c => new { c.NgayKhoiHanh, c.NgayKetThuc })
                .AsNoTracking()
                .ToListAsync();

            var activeTours = tourWindows.Count(c => c.NgayKhoiHanh < currentEnd && c.NgayKetThuc >= currentStart);
            var prevActiveTours = tourWindows.Count(c => c.NgayKhoiHanh < previousEnd && c.NgayKetThuc >= previousStart);

            return new DashboardOverviewDTO
            {
                TotalBookings = totalBookings,
                TotalRevenue = totalRevenue,
                TotalPassengers = currentPassengers,
                ActiveTours = activeTours,
                RevenueGrowthPercent = CalculateGrowthPercent(totalRevenue, prevRevenue),
                BookingGrowthPercent = CalculateGrowthPercent(totalBookings, prevBookings),
                PassengerGrowthPercent = CalculateGrowthPercent(currentPassengers, prevPassengers),
                ActiveToursGrowthPercent = CalculateGrowthPercent(activeTours, prevActiveTours)
            };
        }

        #endregion

        #region Revenue Chart

        public async Task<RevenueChartDTO> GetRevenueChartAsync(int year, int? month = null)
        {
            IQueryable<ThanhToan> query = _context.ThanhToans
                .Where(t => t.TrangThaiThanhToan == TT_THANH_CONG && t.NgayThanhToan.Year == year)
                .AsNoTracking();

            if (month.HasValue)
            {
                query = query.Where(t => t.NgayThanhToan.Month == month.Value);

                var dailyRevenueRaw = await query
                    .GroupBy(t => t.NgayThanhToan.Day)
                    .Select(g => new { Day = g.Key, Revenue = g.Sum(t => t.TongTienThanhToan) })
                    .ToListAsync();

                var daysInMonth = DateTime.DaysInMonth(year, month.Value);
                var revenueDict = dailyRevenueRaw.ToDictionary(x => x.Day, x => x.Revenue);

                var dailyRevenue = Enumerable.Range(1, daysInMonth)
                    .Select(day => new RevenueItemDTO
                    {
                        Month = $"Ngày {day}",
                        Revenue = revenueDict.GetValueOrDefault(day, 0m)
                    })
                    .ToList();

                return new RevenueChartDTO { Data = dailyRevenue };
            }
            else
            {
                var monthlyRevenueRaw = await query
                    .GroupBy(t => t.NgayThanhToan.Month)
                    .Select(g => new { Month = g.Key, Revenue = g.Sum(t => t.TongTienThanhToan) })
                    .ToListAsync();

                var revenueDict = monthlyRevenueRaw.ToDictionary(x => x.Month, x => x.Revenue);

                var result = Enumerable.Range(1, 12)
                    .Select(i => new RevenueItemDTO
                    {
                        Month = $"Tháng {i}",
                        Revenue = revenueDict.GetValueOrDefault(i, 0m)
                    })
                    .ToList();

                return new RevenueChartDTO { Data = result };
            }
        }

        #endregion

        #region Order Status

        public async Task<List<OrderStatusDTO>> GetOrderStatusAsync(int? month = null, int? year = null)
        {
            var query = _context.DonDatTours.AsNoTracking();

            if (year.HasValue)
                query = query.Where(d => d.NgayDat.Year == year.Value);
            if (month.HasValue)
                query = query.Where(d => d.NgayDat.Month == month.Value);

            var statusGroups = await query
                .GroupBy(d => d.TrangThaiDon)
                .Select(g => new { Status = g.Key, Count = g.Count() })
                .ToListAsync();

            var total = statusGroups.Sum(x => x.Count);
            if (total == 0) total = 1;

            return statusGroups
                .Select(g => new OrderStatusDTO
                {
                    StatusName = GetOrderStatusName(g.Status),
                    StatusCode = g.Status,
                    Count = g.Count,
                    Percentage = Math.Round((decimal)g.Count * 100 / total, 1),
                    Color = GetOrderStatusColor(g.Status)
                })
                .OrderBy(x => x.StatusCode)
                .ToList();
        }

        #endregion

        #region Top Tours

        public async Task<List<TopTourDTO>> GetTopToursAsync(int limit = 5, int? month = null, int? year = null)
        {
            var query = _context.DonDatTours
                .Include(d => d.ChuyenKhoiHanh)
                    .ThenInclude(c => c.Tour)
                .Where(d => d.TrangThaiDon != DON_DA_HUY)
                .AsNoTracking();

            if (year.HasValue)
                query = query.Where(d => d.NgayDat.Year == year.Value);
            if (month.HasValue)
                query = query.Where(d => d.NgayDat.Month == month.Value);

            return await query
                .Where(d => d.ChuyenKhoiHanh != null && d.ChuyenKhoiHanh.Tour != null)
                .GroupBy(d => new
                {
                    d.ChuyenKhoiHanh.Tour.MaTour,
                    d.ChuyenKhoiHanh.Tour.TenTour
                })
                .Select(g => new TopTourDTO
                {
                    MaTour = g.Key.MaTour,
                    TenTour = g.Key.TenTour,
                    BookedCount = g.Count(),
                    Revenue = g.Sum(d => d.TongTien)
                })
                .OrderByDescending(x => x.BookedCount)
                .ThenByDescending(x => x.Revenue)
                .Take(limit)
                .ToListAsync();
        }

        #endregion

        #region Customer Age Groups

        public async Task<List<CustomerAgeGroupDTO>> GetCustomerAgeGroupsAsync(int? year = null, int? month = null)
        {
            var currentYear = DateTime.Now.Year;
            var query = _context.KhachHangs
                .Where(k => k.NgaySinh != default && k.LoaiKhach == 1)
                .AsNoTracking();

            if (year.HasValue || month.HasValue)
            {
                var bookingQuery = _context.DonDatTours
                    .Where(d => d.TrangThaiDon != DON_DA_HUY);

                if (year.HasValue)
                    bookingQuery = bookingQuery.Where(d => d.NgayDat.Year == year.Value);
                if (month.HasValue)
                    bookingQuery = bookingQuery.Where(d => d.NgayDat.Month == month.Value);

                var passengerIds = await bookingQuery
                    .Select(d => d.MaNguoiDung)
                    .Distinct()
                    .ToListAsync();

                query = query.Where(k => passengerIds.Contains(k.MaKhachHang));
            }

            var groupedAges = await query
                .Select(k => currentYear - k.NgaySinh.Year)
                .GroupBy(age =>
                    age < 18 ? "< 18" :
                    age < 25 ? "18-24" :
                    age < 35 ? "25-34" :
                    age < 45 ? "35-44" :
                    age < 55 ? "45-54" :
                    "55+")
                .Select(g => new { GroupName = g.Key, Count = g.Count() })
                .ToListAsync();

            var countLookup = groupedAges.ToDictionary(x => x.GroupName, x => x.Count);

            var groups = new List<(string Name, int Order)>
            {
                ("< 18", 1),
                ("18-24", 2),
                ("25-34", 3),
                ("35-44", 4),
                ("45-54", 5),
                ("55+", 6)
            }.Select(d => new CustomerAgeGroupDTO
            {
                GroupName = d.Name,
                Count = countLookup.GetValueOrDefault(d.Name, 0)
            }).ToList();

            var total = groups.Sum(g => g.Count);
            if (total == 0) total = 1;

            foreach (var g in groups)
            {
                g.Percentage = Math.Round((decimal)g.Count * 100 / total, 1);
            }

            return groups;
        }

        #endregion

        #region New Customer Trend

        public async Task<List<NewCustomerTrendDTO>> GetNewCustomerTrendAsync(int year, int? month = null)
        {
            var firstBookings = await _context.DonDatTours
                .Where(d => d.TrangThaiDon != DON_DA_HUY && d.NgayDat.Year == year)
                .GroupBy(d => d.MaNguoiDung)
                .Select(g => new
                {
                    MaNguoiDung = g.Key,
                    NgayDatDauTien = g.Min(d => d.NgayDat)
                })
                .AsNoTracking()
                .ToListAsync();

            var userIds = firstBookings.Select(x => x.MaNguoiDung).ToList();
            var userGenders = await _context.NguoiDungs
                .Where(u => userIds.Contains(u.MaNguoiDung))
                .Select(u => new { u.MaNguoiDung, u.GioiTinh })
                .ToDictionaryAsync(u => u.MaNguoiDung, u => u.GioiTinh);

            List<NewCustomerTrendDTO> result;

            if (month.HasValue)
            {
                var daysInMonth = DateTime.DaysInMonth(year, month.Value);

                result = Enumerable.Range(1, daysInMonth)
                    .Select(day =>
                    {
                        var date = new DateTime(year, month.Value, day);
                        var customersOnDay = firstBookings
                            .Where(x => x.NgayDatDauTien.Date == date)
                            .ToList();

                        var maleCount = customersOnDay
                            .Count(x => userGenders.TryGetValue(x.MaNguoiDung, out var gender) && gender == true);
                        var femaleCount = customersOnDay
                            .Count(x => userGenders.TryGetValue(x.MaNguoiDung, out var gender) && gender == false);
                        var unknownCount = customersOnDay
                            .Count(x => !userGenders.ContainsKey(x.MaNguoiDung) || userGenders[x.MaNguoiDung] == null);

                        return new NewCustomerTrendDTO
                        {
                            Month = $"Ngày {day}",
                            CustomerCount = customersOnDay.Count,
                            MaleCount = maleCount,
                            FemaleCount = femaleCount,
                            UnknownCount = unknownCount,
                            Day = day
                        };
                    })
                    .ToList();
            }
            else
            {
                result = Enumerable.Range(1, 12)
                    .Select(m =>
                    {
                        var customersInMonth = firstBookings
                            .Where(x => x.NgayDatDauTien.Month == m)
                            .ToList();

                        var maleCount = customersInMonth
                            .Count(x => userGenders.TryGetValue(x.MaNguoiDung, out var gender) && gender == true);
                        var femaleCount = customersInMonth
                            .Count(x => userGenders.TryGetValue(x.MaNguoiDung, out var gender) && gender == false);
                        var unknownCount = customersInMonth
                            .Count(x => !userGenders.ContainsKey(x.MaNguoiDung) || userGenders[x.MaNguoiDung] == null);

                        return new NewCustomerTrendDTO
                        {
                            Month = $"Tháng {m}",
                            CustomerCount = customersInMonth.Count,
                            MaleCount = maleCount,
                            FemaleCount = femaleCount,
                            UnknownCount = unknownCount
                        };
                    })
                    .ToList();
            }

            return result;
        }

        #endregion

        #region Tour Engagement

        public async Task<List<TourEngagementDTO>> GetTourEngagementAsync(int? month = null, int? year = null)
        {
            var bookedQuery = _context.DonDatTours
                .Where(d => d.TrangThaiDon != DON_DA_HUY)
                .AsNoTracking();

            if (year.HasValue)
                bookedQuery = bookedQuery.Where(d => d.NgayDat.Year == year.Value);
            if (month.HasValue)
                bookedQuery = bookedQuery.Where(d => d.NgayDat.Month == month.Value);

            var bookedCount = await bookedQuery.CountAsync();
            var favoriteCount = await _context.Set<DanhSachYeuThich>().CountAsync();
            var viewCount = 0;

            return new List<TourEngagementDTO>
            {
                new() { Name = "Lượt xem", Value = viewCount, Color = "#8B5CF6" },
                new() { Name = "Yêu thích", Value = favoriteCount, Color = "#EC4899" },
                new() { Name = "Đặt tour", Value = bookedCount, Color = "#10B981" }
            };
        }

        #endregion

        #region Recent Transactions

        public async Task<List<RecentTransactionDTO>> GetRecentTransactionsAsync(int limit = 6, int? month = null, int? year = null)
        {
            var query = _context.DonDatTours
                .Include(d => d.NguoiDung)
                .Include(d => d.ChuyenKhoiHanh)
                    .ThenInclude(c => c.Tour)
                .Include(d => d.ThanhToans)
                .Where(d => d.ThanhToans.Any())
                .AsNoTracking();

            if (year.HasValue)
                query = query.Where(d => d.NgayDat.Year == year.Value);
            if (month.HasValue)
                query = query.Where(d => d.NgayDat.Month == month.Value);

            var raw = await query
                .OrderByDescending(d => d.NgayDat)
                .Take(limit)
                .Select(d => new
                {
                    d.MaDonDatTour,
                    CustomerName = d.NguoiDung != null ? d.NguoiDung.HoTen : null,
                    TourName = d.ChuyenKhoiHanh != null && d.ChuyenKhoiHanh.Tour != null
                        ? d.ChuyenKhoiHanh.Tour.TenTour
                        : null,
                    d.TongTien,
                    d.TrangThaiDon,
                    d.NgayDat,
                    LatestPayment = d.ThanhToans
                        .OrderByDescending(t => t.NgayThanhToan)
                        .Select(t => new { t.TrangThaiThanhToan, t.TongTienThanhToan })
                        .FirstOrDefault()
                })
                .ToListAsync();

            return raw.Select(d => new RecentTransactionDTO
            {
                MaDon = d.MaDonDatTour,
                CustomerName = d.CustomerName ?? "Khách vãng lai",
                TourName = d.TourName ?? "—",
                Amount = d.LatestPayment?.TongTienThanhToan ?? d.TongTien,
                Status = GetOrderStatusName(d.TrangThaiDon),
                StatusCode = d.TrangThaiDon,
                Time = d.NgayDat
            }).ToList();
        }

        #endregion

        #region Export Excel

        public async Task<byte[]> ExportDashboardReportExcelAsync(int year, int? month = null)
        {
            bool isYearMode = month == null;

            var overview = isYearMode
                ? await GetYearOverviewAsync(year)
                : await GetDashboardOverviewAsync(year, month);

            var orderStatus = await GetOrderStatusAsync(month, year);
            var topTours = await GetTopToursAsync(5, month, year);
            var ageGroups = await GetCustomerAgeGroupsAsync(year, month);
            var revenueChart = await GetRevenueChartAsync(year, month);

            string periodLabelUpper = isYearMode ? $"NĂM {year}" : $"THÁNG {month}/{year}";
            var growthColumnLabel = isYearMode ? "So với năm trước" : "So với tháng trước";
            var exportedAtLabel = $"Ngày xuất báo cáo: {DateTime.Now:dd/MM/yyyy HH:mm}";

            using var stream = new MemoryStream();
            using (var doc = SpreadsheetDocument.Create(stream, SpreadsheetDocumentType.Workbook))
            {
                var workbookPart = doc.AddWorkbookPart();
                workbookPart.Workbook = new Workbook();

                var stylesPart = workbookPart.AddNewPart<WorkbookStylesPart>();
                stylesPart.Stylesheet = BuildStylesheet();
                stylesPart.Stylesheet.Save();

                var sheets = workbookPart.Workbook.AppendChild(new Sheets());
                uint sheetId = 1;

                var overviewPreamble = new List<(string Text, uint Style)>
                {
                    (CompanyName, 3),
                    (CompanyAddress, 4),
                    ("BÁO CÁO THỐNG KÊ HOẠT ĐỘNG KINH DOANH", 5),
                    ($"Kỳ báo cáo: {periodLabelUpper}", 0),
                    (exportedAtLabel, 0)
                };

                var overviewRows = new List<string[]>
                {
                    new[] { "Chỉ tiêu", "Giá trị", growthColumnLabel },
                    new[] { "Tổng số đơn đặt tour", FormatNumber(overview.TotalBookings), FormatGrowth(overview.BookingGrowthPercent) },
                    new[] { "Doanh thu (VNĐ)", FormatNumber(overview.TotalRevenue), FormatGrowth(overview.RevenueGrowthPercent) },
                    new[] { "Tổng số hành khách", FormatNumber(overview.TotalPassengers), FormatGrowth(overview.PassengerGrowthPercent) },
                    new[] { "Tour đang hoạt động", FormatNumber(overview.ActiveTours), FormatGrowth(overview.ActiveToursGrowthPercent) },
                };

                var overviewFooter = new List<string>
                {
                    "Người lập báo cáo: ______________________        Người duyệt: ______________________"
                };

                AddSheet(workbookPart, sheets, "Tong quan", sheetId++, overviewRows,
                    title: "I. CHỈ SỐ TỔNG QUAN",
                    preambleLines: overviewPreamble,
                    footerLines: overviewFooter);

                if (revenueChart != null && revenueChart.Data.Any())
                {
                    var totalRevenueForPeriod = revenueChart.Data.Sum(r => r.Revenue);
                    var divisor = totalRevenueForPeriod == 0 ? 1 : totalRevenueForPeriod;

                    var revenueRows = new List<string[]> { new[] { "Kỳ", "Doanh thu (VNĐ)", "Tỷ trọng (%)" } };
                    revenueRows.AddRange(revenueChart.Data.Select(r => new[]
                    {
                        r.Month,
                        FormatNumber(r.Revenue),
                        FormatPercent(Math.Round(r.Revenue * 100m / divisor, 1))
                    }));

                    AddSheet(workbookPart, sheets, "Doanh thu", sheetId++, revenueRows,
                        title: $"BẢNG DOANH THU - {periodLabelUpper}",
                        totalRow: new[] { "TỔNG CỘNG", FormatNumber(totalRevenueForPeriod), "100%" });
                }

                var totalOrders = orderStatus.Sum(o => o.Count);
                var orderRows = new List<string[]> { new[] { "Trạng thái đơn hàng", "Số lượng", "Tỷ lệ (%)" } };
                orderRows.AddRange(orderStatus.Select(o => new[] { o.StatusName, FormatNumber(o.Count), FormatPercent(o.Percentage) }));

                AddSheet(workbookPart, sheets, "Trang thai don", sheetId++, orderRows,
                    title: $"THỐNG KÊ TRẠNG THÁI ĐƠN HÀNG - {periodLabelUpper}",
                    totalRow: new[] { "TỔNG CỘNG", FormatNumber(totalOrders), "100%" });

                var topTourRows = new List<string[]> { new[] { "STT", "Mã tour", "Tên tour", "Lượt đặt", "Doanh thu (VNĐ)" } };
                topTourRows.AddRange(topTours.Select((t, i) => new[]
                {
                    (i + 1).ToString(),
                    t.MaTour.ToString(),
                    t.TenTour,
                    FormatNumber(t.BookedCount),
                    FormatNumber(t.Revenue)
                }));

                AddSheet(workbookPart, sheets, "Top tour", sheetId++, topTourRows,
                    title: $"TOP {topTours.Count} TOUR BÁN CHẠY NHẤT - {periodLabelUpper}");

                var totalAgeCustomers = ageGroups.Sum(g => g.Count);
                var ageRows = new List<string[]> { new[] { "Nhóm tuổi", "Số lượng khách hàng", "Tỷ lệ (%)" } };
                ageRows.AddRange(ageGroups.Select(g => new[] { g.GroupName, FormatNumber(g.Count), FormatPercent(g.Percentage) }));

                AddSheet(workbookPart, sheets, "Do tuoi", sheetId++, ageRows,
                    title: $"PHÂN BỔ ĐỘ TUỔI KHÁCH HÀNG - {periodLabelUpper}",
                    totalRow: new[] { "TỔNG CỘNG", FormatNumber(totalAgeCustomers), "100%" });

                workbookPart.Workbook.Save();
            }

            return stream.ToArray();
        }

        #endregion

        #region Excel Helpers

        private static void AddSheet(
            WorkbookPart workbookPart, Sheets sheets, string sheetName, uint sheetId,
            List<string[]> rows,
            string? title = null,
            List<(string Text, uint Style)>? preambleLines = null,
            string[]? totalRow = null,
            List<string>? footerLines = null)
        {
            var worksheetPart = workbookPart.AddNewPart<WorksheetPart>();
            var sheetData = new SheetData();

            uint rowIndex = 1;

            if (rows.Count > 0)
            {
                var columns = new Columns();
                int colCount = rows[0].Length;
                for (int c = 1; c <= colCount; c++)
                {
                    columns.Append(new Column { Min = (uint)c, Max = (uint)c, Width = 24, CustomWidth = true });
                }
                worksheetPart.Worksheet = new Worksheet(columns, sheetData);
            }
            else
            {
                worksheetPart.Worksheet = new Worksheet(sheetData);
            }

            if (preambleLines != null)
            {
                foreach (var (text, style) in preambleLines)
                {
                    var line = new Row { RowIndex = rowIndex++ };
                    line.Append(CreateCell(text, style));
                    sheetData.Append(line);
                }
                sheetData.Append(new Row { RowIndex = rowIndex++ });
            }

            if (title != null)
            {
                var titleRow = new Row { RowIndex = rowIndex++ };
                titleRow.Append(CreateCell(title, 2));
                sheetData.Append(titleRow);
                sheetData.Append(new Row { RowIndex = rowIndex++ });
            }

            for (int i = 0; i < rows.Count; i++)
            {
                var row = new Row { RowIndex = rowIndex++ };
                bool isHeaderRow = i == 0;

                foreach (var cellText in rows[i])
                    row.Append(CreateCell(cellText, isHeaderRow ? (uint)1 : 0));

                sheetData.Append(row);
            }

            if (totalRow != null)
            {
                var total = new Row { RowIndex = rowIndex++ };
                foreach (var cellText in totalRow)
                    total.Append(CreateCell(cellText, 6));
                sheetData.Append(total);
            }

            if (footerLines != null)
            {
                sheetData.Append(new Row { RowIndex = rowIndex++ });
                sheetData.Append(new Row { RowIndex = rowIndex++ });
                foreach (var text in footerLines)
                {
                    var footerRow = new Row { RowIndex = rowIndex++ };
                    footerRow.Append(CreateCell(text, 4));
                    sheetData.Append(footerRow);
                }
            }

            var sheet = new Sheet
            {
                Id = workbookPart.GetIdOfPart(worksheetPart),
                SheetId = sheetId,
                Name = sheetName
            };
            sheets.Append(sheet);
        }

        private static Cell CreateCell(string text, uint styleIndex = 0)
        {
            return new Cell
            {
                DataType = CellValues.String,
                CellValue = new CellValue(text ?? ""),
                StyleIndex = styleIndex
            };
        }

        private static Stylesheet BuildStylesheet()
        {
            return new Stylesheet(
                new Fonts(
                    new Font(),
                    new Font(new Bold()),
                    new Font(new Bold(), new FontSize { Val = 16 }),
                    new Font(new Bold(), new FontSize { Val = 18 }),
                    new Font(new Italic()),
                    new Font(new Bold(), new FontSize { Val = 13 })
                ),
                new Fills(
                    new Fill(new PatternFill { PatternType = PatternValues.None }),
                    new Fill(new PatternFill { PatternType = PatternValues.Gray125 }),
                    new Fill(new PatternFill(new ForegroundColor { Rgb = "FFD9E2F3" })
                    { PatternType = PatternValues.Solid })
                ),
                new Borders(new Border()),
                new CellFormats(
                    new CellFormat { FontId = 0, FillId = 0, BorderId = 0 },
                    new CellFormat { FontId = 1, FillId = 2, BorderId = 0, ApplyFont = true, ApplyFill = true },
                    new CellFormat { FontId = 2, FillId = 0, BorderId = 0, ApplyFont = true },
                    new CellFormat { FontId = 3, FillId = 0, BorderId = 0, ApplyFont = true },
                    new CellFormat { FontId = 5, FillId = 0, BorderId = 0, ApplyFont = true },
                    new CellFormat { FontId = 1, FillId = 0, BorderId = 0, ApplyFont = true }
                )
            );
        }

        #endregion

        #region Format Helpers

        private static string FormatGrowth(decimal? growth)
        {
            if (growth == null) return "N/A";
            var sign = growth >= 0 ? "+" : "";
            return $"{sign}{growth}%";
        }

        private static string FormatPercent(decimal value) => $"{value}%";

        private static string FormatNumber(decimal value)
        {
            return value.ToString("#,##0", System.Globalization.CultureInfo.InvariantCulture)
                        .Replace(",", ".");
        }

        private static string FormatNumber(int value) => FormatNumber((decimal)value);

        #endregion
    }
}