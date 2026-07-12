using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
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
        private const string CompanyName = "LỐI RIÊNG TRAVEL";
        private const string CompanyAddress = ".........,Việt Nam";

        public StatisticService(AppDbContext context)
        {
            _context = context;
        }



        private async Task<DashboardOverviewDTO> GetOverviewForRangeAsync(
            DateTime currentStart, DateTime currentEnd,
            DateTime previousStart, DateTime previousEnd)
        {
            // Bookings
            var bookingStats = await _context.DonDatTours
                .Where(d => (d.NgayDat >= currentStart && d.NgayDat < currentEnd)
                         || (d.NgayDat >= previousStart && d.NgayDat < previousEnd))
                .GroupBy(d => d.NgayDat >= currentStart)
                .Select(g => new { IsCurrent = g.Key, Count = g.Count() })
                .ToListAsync();

            var totalBookings = bookingStats.FirstOrDefault(x => x.IsCurrent)?.Count ?? 0;
            var prevBookings = bookingStats.FirstOrDefault(x => !x.IsCurrent)?.Count ?? 0;

            // Revenue
            var revenueStats = await _context.ThanhToans
                .Where(t => t.TrangThaiThanhToan == 1 &&
                            ((t.NgayThanhToan >= currentStart && t.NgayThanhToan < currentEnd)
                          || (t.NgayThanhToan >= previousStart && t.NgayThanhToan < previousEnd)))
                .GroupBy(t => t.NgayThanhToan >= currentStart)
                .Select(g => new { IsCurrent = g.Key, Revenue = g.Sum(t => t.TongTienThanhToan) })
                .ToListAsync();

            var totalRevenue = revenueStats.FirstOrDefault(x => x.IsCurrent)?.Revenue ?? 0m;
            var prevRevenue = revenueStats.FirstOrDefault(x => !x.IsCurrent)?.Revenue ?? 0m;

            // New customers
            var customerStats = await _context.KhachHangs
                .Where(k => k.LoaiKhach == 1
                         && k.DonDatTour.TrangThaiDon != 4
                         && ((k.DonDatTour.NgayDat >= currentStart && k.DonDatTour.NgayDat < currentEnd)
                          || (k.DonDatTour.NgayDat >= previousStart && k.DonDatTour.NgayDat < previousEnd)))
                .GroupBy(k => k.DonDatTour.NgayDat >= currentStart)
                .Select(g => new { IsCurrent = g.Key, Count = g.Count() })
                .ToListAsync();

            var newCustomers = customerStats.FirstOrDefault(x => x.IsCurrent)?.Count ?? 0;
            var prevNewCustomers = customerStats.FirstOrDefault(x => !x.IsCurrent)?.Count ?? 0;

            // Active tours
            var tourWindows = await _context.ChuyenKhoiHanhs
                .Where(c => c.NgayXoa == null &&
                            ((c.NgayKhoiHanh < currentEnd && c.NgayKetThuc >= currentStart)
                          || (c.NgayKhoiHanh < previousEnd && c.NgayKetThuc >= previousStart)))
                .Select(c => new { c.NgayKhoiHanh, c.NgayKetThuc })
                .ToListAsync();

            var activeTours = tourWindows.Count(c => c.NgayKhoiHanh < currentEnd && c.NgayKetThuc >= currentStart);
            var prevActiveTours = tourWindows.Count(c => c.NgayKhoiHanh < previousEnd && c.NgayKetThuc >= previousStart);

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

            return await GetOverviewForRangeAsync(
                startOfCurrentMonth, currentPeriodEnd,
                startOfPreviousMonth, previousPeriodEnd);
        }



        public async Task<DashboardOverviewDTO> GetYearOverviewAsync(int? year = null)
        {
            var currentDate = DateTime.Now;
            var targetYear = year ?? currentDate.Year;

            var startOfCurrentYear = new DateTime(targetYear, 1, 1);
            var endOfCurrentYear = startOfCurrentYear.AddYears(1);
            var startOfPreviousYear = startOfCurrentYear.AddYears(-1);

            bool isCurrentYearInProgress = targetYear == currentDate.Year;

            var currentPeriodEnd = isCurrentYearInProgress
                ? currentDate
                : endOfCurrentYear;

            var previousPeriodEnd = isCurrentYearInProgress
                ? startOfPreviousYear.AddDays((currentDate - startOfCurrentYear).Days)
                : startOfCurrentYear;

            return await GetOverviewForRangeAsync(
                startOfCurrentYear, currentPeriodEnd,
                startOfPreviousYear, previousPeriodEnd);
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
                { 1, "Thành công" },
                { 2, "Thất bại" },
                { 3, "Hoàn tiền" }
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


        public async Task<byte[]> ExportDashboardReportExcelAsync(int year, int? month = null)
        {
            bool isYearMode = month == null;

            var overview = isYearMode
                ? await GetYearOverviewAsync(year)
                : await GetDashboardOverviewAsync(year, month);

            var orderStatus = await GetOrderStatusAsync(month, year);
            var topTours = await GetTopToursAsync(5, month, year);
            var ageGroups = await GetCustomerAgeGroupsAsync();
            var revenueChart = isYearMode ? await GetRevenueChartAsync(year) : null;

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
                    (CompanyName, CellStyle.CompanyName),
                    (CompanyAddress, CellStyle.Italic),
                    ("BÁO CÁO THỐNG KÊ HOẠT ĐỘNG KINH DOANH", CellStyle.ReportTitle),
                    ($"Kỳ báo cáo: {periodLabelUpper}", CellStyle.Normal),
                    (exportedAtLabel, CellStyle.Normal)
                };

                var overviewRows = new List<string[]>
                {
                    new[] { "Chỉ tiêu", "Giá trị", growthColumnLabel },
                    new[] { "Tổng số đơn đặt tour", FormatNumber(overview.TotalBookings), FormatGrowth(overview.BookingGrowthPercent) },
                    new[] { "Doanh thu (VNĐ)", FormatNumber(overview.TotalRevenue), FormatGrowth(overview.RevenueGrowthPercent) },
                    new[] { "Khách hàng mới", FormatNumber(overview.NewCustomersThisMonth), FormatGrowth(overview.NewCustomersGrowthPercent) },
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

                if (isYearMode && revenueChart != null)
                {
                    var totalRevenueForYear = revenueChart.Data.Sum(r => r.Revenue);
                    var divisor = totalRevenueForYear == 0 ? 1 : totalRevenueForYear;

                    var revenueRows = new List<string[]> { new[] { "Tháng", "Doanh thu (VNĐ)", "Tỷ trọng (%)" } };
                    revenueRows.AddRange(revenueChart.Data.Select(r => new[]
                    {
                        r.Month,
                        FormatNumber(r.Revenue),
                        FormatPercent(Math.Round(r.Revenue * 100m / divisor, 1))
                    }));

                    AddSheet(workbookPart, sheets, "Doanh thu theo thang", sheetId++, revenueRows,
                        title: $"BẢNG DOANH THU THEO THÁNG - {periodLabelUpper}",
                        totalRow: new[] { "TỔNG CỘNG", FormatNumber(totalRevenueForYear), "100%" });
                }

                var totalOrders = orderStatus.Sum(o => o.Count);
                var orderRows = new List<string[]> { new[] { "Trạng thái đơn hàng", "Số lượng", "Tỷ lệ (%)" } };
                orderRows.AddRange(orderStatus.Select(o => new[] { o.StatusName, FormatNumber(o.Count), FormatPercent(o.Percentage) }));

                AddSheet(workbookPart, sheets, "Trang thai don hang", sheetId++, orderRows,
                    title: $"THỐNG KÊ TRẠNG THÁI ĐƠN HÀNG - {periodLabelUpper}",
                    totalRow: new[] { "TỔNG CỘNG", FormatNumber(totalOrders), "100%" });

                var topTourRows = new List<string[]> { new[] { "STT", "Mã tour", "Tên tour", "Lượt đặt", "Doanh thu (VNĐ)" } };
                topTourRows.AddRange(topTours.Select((t, i) => new[]
                {
                    (i + 1).ToString(), t.MaTour.ToString(), t.TenTour, FormatNumber(t.BookedCount), FormatNumber(t.Revenue)
                }));

                AddSheet(workbookPart, sheets, "Top tour", sheetId++, topTourRows,
                    title: $"TOP {topTours.Count} TOUR BÁN CHẠY NHẤT - {periodLabelUpper}");

                var totalAgeCustomers = ageGroups.Sum(g => g.Count);
                var ageRows = new List<string[]> { new[] { "Nhóm tuổi", "Số lượng khách hàng", "Tỷ lệ (%)" } };
                ageRows.AddRange(ageGroups.Select(g => new[] { g.GroupName, FormatNumber(g.Count), FormatPercent(g.Percentage) }));

                AddSheet(workbookPart, sheets, "Do tuoi khach hang", sheetId++, ageRows,
                    title: "PHÂN BỔ ĐỘ TUỔI KHÁCH HÀNG (TOÀN HỆ THỐNG)",
                    totalRow: new[] { "TỔNG CỘNG", FormatNumber(totalAgeCustomers), "100%" });



                workbookPart.Workbook.Save();
            }

            return stream.ToArray();
        }


        private static class CellStyle
        {
            public const uint Normal = 0;
            public const uint TableHeader = 1;
            public const uint SectionTitle = 2;
            public const uint CompanyName = 3;
            public const uint Italic = 4;
            public const uint ReportTitle = 5;
            public const uint TotalRow = 6;
        }

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
                titleRow.Append(CreateCell(title, CellStyle.SectionTitle));
                sheetData.Append(titleRow);
                sheetData.Append(new Row { RowIndex = rowIndex++ }); 
            }

            for (int i = 0; i < rows.Count; i++)
            {
                var row = new Row { RowIndex = rowIndex++ };
                bool isHeaderRow = i == 0;

                foreach (var cellText in rows[i])
                    row.Append(CreateCell(cellText, isHeaderRow ? CellStyle.TableHeader : CellStyle.Normal));

                sheetData.Append(row);
            }

            if (totalRow != null)
            {
                var total = new Row { RowIndex = rowIndex++ };
                foreach (var cellText in totalRow)
                    total.Append(CreateCell(cellText, CellStyle.TotalRow));
                sheetData.Append(total);
            }


            if (footerLines != null)
            {
                sheetData.Append(new Row { RowIndex = rowIndex++ });
                sheetData.Append(new Row { RowIndex = rowIndex++ }); 
                foreach (var text in footerLines)
                {
                    var footerRow = new Row { RowIndex = rowIndex++ };
                    footerRow.Append(CreateCell(text, CellStyle.Italic));
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
    }
}