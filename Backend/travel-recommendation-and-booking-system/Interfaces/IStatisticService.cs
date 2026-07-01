// Interfaces/IStatisticService.cs
using travel_recommendation_and_booking_system.Dtos.Statistics;
using travel_recommendation_and_booking_system.DTOs.TypeTour;

namespace travel_recommendation_and_booking_system.Interfaces
{
    public interface IStatisticService
    {
        Task<DashboardOverviewDTO> GetDashboardOverviewAsync(int? year = null, int? month = null);

        Task<RevenueChartDTO> GetRevenueChartAsync(int year);

        Task<List<OrderStatusDTO>> GetOrderStatusAsync(int? month = null, int? year = null);

        Task<List<TopTourDTO>> GetTopToursAsync(int limit = 5, int? month = null, int? year = null);

        Task<List<CustomerAgeGroupDTO>> GetCustomerAgeGroupsAsync();

        Task<List<NewCustomerTrendDTO>> GetNewCustomerTrendAsync(int year);

        Task<List<TourEngagementDTO>> GetTourEngagementAsync(int? month = null, int? year = null);
        Task<List<RecentTransactionDTO>> GetRecentTransactionsAsync(int limit = 6);
    }
}