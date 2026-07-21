using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using travel_recommendation_and_booking_system.Dtos.Statistics;
using travel_recommendation_and_booking_system.Interfaces;

namespace travel_recommendation_and_booking_system.Controllers
{
    [ApiController]
    [Route("api/statistics")]
    public class StatisticController : ControllerBase
    {
        private readonly IStatisticService _statisticService;

        public StatisticController(IStatisticService statisticService)
        {
            _statisticService = statisticService;
        }

        [HttpGet("overview")]
        public async Task<IActionResult> GetOverview([FromQuery] int? year = null, [FromQuery] int? month = null)
        {
            var result = month.HasValue
                ? await _statisticService.GetDashboardOverviewAsync(year, month)
                : await _statisticService.GetYearOverviewAsync(year);

            return Ok(result);
        }

        [HttpGet("revenue-chart")]
        public async Task<IActionResult> GetRevenueChart([FromQuery] int year, [FromQuery] int? month = null)
        {
            var result = await _statisticService.GetRevenueChartAsync(year, month);
            return Ok(result);
        }

        [HttpGet("order-status")]
        public async Task<IActionResult> GetOrderStatus([FromQuery] int? year = null, [FromQuery] int? month = null)
        {
            var result = await _statisticService.GetOrderStatusAsync(month, year);
            return Ok(result);
        }

        [HttpGet("top-tours")]
        public async Task<IActionResult> GetTopTours([FromQuery] int limit = 5,
                                                    [FromQuery] int? year = null,
                                                    [FromQuery] int? month = null)
        {
            var result = await _statisticService.GetTopToursAsync(limit, month, year);
            return Ok(result);
        }

        [HttpGet("age-groups")]
        public async Task<IActionResult> GetAgeGroups([FromQuery] int? year = null, [FromQuery] int? month = null)
        {
            var result = await _statisticService.GetCustomerAgeGroupsAsync(year, month);
            return Ok(result);
        }

        [HttpGet("new-customers-trend")]
        public async Task<IActionResult> GetNewCustomerTrend([FromQuery] int year, [FromQuery] int? month = null)
        {
            var data = await _statisticService.GetNewCustomerTrendAsync(year, month);
            return Ok(data);
        }

        [HttpGet("tour-engagement")]
        public async Task<IActionResult> GetTourEngagement([FromQuery] int? year = null, [FromQuery] int? month = null)
        {
            var result = await _statisticService.GetTourEngagementAsync(month, year);
            return Ok(result);
        }

        [HttpGet("recent-transactions")]
        public async Task<IActionResult> GetRecentTransactions([FromQuery] int limit = 6,
                                                              [FromQuery] int? year = null,
                                                              [FromQuery] int? month = null)
        {
            var result = await _statisticService.GetRecentTransactionsAsync(limit, month, year);
            return Ok(result);
        }

        [HttpGet("export-excel")]
        public async Task<IActionResult> ExportReportExcel([FromQuery] int year, [FromQuery] int? month = null)
        {
            if (month.HasValue && (month < 1 || month > 12))
                return BadRequest("Tháng không hợp lệ (1-12).");

            var fileBytes = await _statisticService.ExportDashboardReportExcelAsync(year, month);

            var fileName = month.HasValue
                ? $"BaoCaoThongKe_Thang{month}_{year}.xlsx"
                : $"BaoCaoThongKe_Nam{year}.xlsx";

            return File(
                fileBytes,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                fileName);
        }
    }
}