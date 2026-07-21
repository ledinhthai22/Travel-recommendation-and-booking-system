using travel_recommendation_and_booking_system.Dtos.Statistics;

namespace travel_recommendation_and_booking_system.Interfaces
{
    public interface IStatisticService
    {
        Task<DashboardOverviewDTO> GetDashboardOverviewAsync(int? year = null, int? month = null);
        Task<DashboardOverviewDTO> GetYearOverviewAsync(int? year = null);
        Task<RevenueChartDTO> GetRevenueChartAsync(int year, int? month = null);
        Task<List<OrderStatusDTO>> GetOrderStatusAsync(int? month = null, int? year = null);
        Task<List<TopTourDTO>> GetTopToursAsync(int limit = 5, int? month = null, int? year = null);
        Task<List<CustomerAgeGroupDTO>> GetCustomerAgeGroupsAsync(int? year = null, int? month = null);
        Task<List<NewCustomerTrendDTO>> GetNewCustomerTrendAsync(int year, int? month = null);
        Task<List<TourEngagementDTO>> GetTourEngagementAsync(int? month = null, int? year = null);
        Task<List<RecentTransactionDTO>> GetRecentTransactionsAsync(int limit = 6, int? month = null, int? year = null);
        Task<byte[]> ExportDashboardReportExcelAsync(int year, int? month = null);
    }
}