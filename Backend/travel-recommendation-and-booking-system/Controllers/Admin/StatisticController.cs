// Controllers/StatisticController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using travel_recommendation_and_booking_system.Dtos.Statistics;
using travel_recommendation_and_booking_system.Interfaces;

namespace travel_recommendation_and_booking_system.Controllers
{
    [ApiController]
    [Route("api/statistics")]
    //[Authorize(Roles = "Admin")]   // Chỉ Admin mới được truy cập
    public class StatisticController : ControllerBase
    {
        private readonly IStatisticService _statisticService;

        public StatisticController(IStatisticService statisticService)
        {
            _statisticService = statisticService;
        }

        /// <summary>
        /// Lấy tổng quan dashboard
        /// </summary>
        [HttpGet("overview")]
        public async Task<IActionResult> GetOverview([FromQuery] int? year = null, [FromQuery] int? month = null)
        {
            var result = await _statisticService.GetDashboardOverviewAsync(year, month);
            return Ok(result);
        }

        /// <summary>
        /// Doanh thu theo tháng (Bar Chart)
        /// </summary>
        [HttpGet("revenue-chart")]
        public async Task<IActionResult> GetRevenueChart([FromQuery] int year = 2026)
        {
            var result = await _statisticService.GetRevenueChartAsync(year);
            return Ok(result);
        }

        /// <summary>
        /// Trạng thái đơn hàng (Pie Chart)
        /// </summary>
        [HttpGet("order-status")]
        public async Task<IActionResult> GetOrderStatus([FromQuery] int? month = null, [FromQuery] int? year = null)
        {
            var result = await _statisticService.GetOrderStatusAsync(month, year);
            return Ok(result);
        }

        /// <summary>
        /// Top tour bán chạy
        /// </summary>
        [HttpGet("top-tours")]
        public async Task<IActionResult> GetTopTours([FromQuery] int limit = 5,
                                                    [FromQuery] int? month = null,
                                                    [FromQuery] int? year = null)
        {
            var result = await _statisticService.GetTopToursAsync(limit, month, year);
            return Ok(result);
        }

        /// <summary>
        /// Phân bố độ tuổi khách hàng
        /// </summary>
        [HttpGet("age-groups")]
        public async Task<IActionResult> GetAgeGroups()
        {
            var result = await _statisticService.GetCustomerAgeGroupsAsync();
            return Ok(result);
        }

        /// <summary>
        /// Xu hướng khách hàng mới theo tháng
        /// </summary>
        [HttpGet("new-customers-trend")]
        public async Task<IActionResult> GetNewCustomersTrend([FromQuery] int year = 2026)
        {
            var result = await _statisticService.GetNewCustomerTrendAsync(year);
            return Ok(result);
        }

        /// <summary>
        /// Hành vi khách hàng (Xem - Yêu thích - Đặt)
        /// </summary>
        [HttpGet("tour-engagement")]
        public async Task<IActionResult> GetTourEngagement([FromQuery] int? month = null, [FromQuery] int? year = null)
        {
            var result = await _statisticService.GetTourEngagementAsync(month, year);
            return Ok(result);
        }
    }
}