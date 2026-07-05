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
            var result = await _statisticService.GetDashboardOverviewAsync(year, month);
            return Ok(result);
        }

      
        [HttpGet("revenue-chart")]
        public async Task<IActionResult> GetRevenueChart([FromQuery] int year = 2026)
        {
            var result = await _statisticService.GetRevenueChartAsync(year);
            return Ok(result);
        }

       
        [HttpGet("order-status")]
        public async Task<IActionResult> GetOrderStatus([FromQuery] int? month = null, [FromQuery] int? year = null)
        {
            var result = await _statisticService.GetOrderStatusAsync(month, year);
            return Ok(result);
        }

        [HttpGet("top-tours")]
        public async Task<IActionResult> GetTopTours([FromQuery] int limit = 5,
                                                    [FromQuery] int? month = null,
                                                    [FromQuery] int? year = null)
        {
            var result = await _statisticService.GetTopToursAsync(limit, month, year);
            return Ok(result);
        }


        [HttpGet("age-groups")]
        public async Task<IActionResult> GetAgeGroups()
        {
            var result = await _statisticService.GetCustomerAgeGroupsAsync();
            return Ok(result);
        }


        [HttpGet("new-customers-trend")]
        public async Task<IActionResult> GetNewCustomersTrend([FromQuery] int year = 2026)
        {
            var result = await _statisticService.GetNewCustomerTrendAsync(year);
            return Ok(result);
        }


        [HttpGet("tour-engagement")]
        public async Task<IActionResult> GetTourEngagement([FromQuery] int? month = null, [FromQuery] int? year = null)
        {
            var result = await _statisticService.GetTourEngagementAsync(month, year);
            return Ok(result);
        }
        [HttpGet("recent-transactions")]
        public async Task<IActionResult> GetRecentTransactions([FromQuery] int limit = 6)
        {
            var result = await _statisticService.GetRecentTransactionsAsync(limit);
            return Ok(result);
        }
    }
}