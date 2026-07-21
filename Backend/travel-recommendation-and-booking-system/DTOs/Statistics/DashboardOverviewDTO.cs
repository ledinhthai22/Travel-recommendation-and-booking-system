using System;

namespace travel_recommendation_and_booking_system.Dtos.Statistics
{
    public class DashboardOverviewDTO
    {
        public int TotalBookings { get; set; }
        public decimal TotalRevenue { get; set; }
        public int TotalPassengers { get; set; }                
        public int ActiveTours { get; set; }
        public decimal? RevenueGrowthPercent { get; set; }
        public decimal? BookingGrowthPercent { get; set; }
        public decimal? PassengerGrowthPercent { get; set; }      
        public decimal? ActiveToursGrowthPercent { get; set; }
    }
}