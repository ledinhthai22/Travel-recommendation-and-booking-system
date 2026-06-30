using System;
using System.Collections.Generic;

namespace travel_recommendation_and_booking_system.Dtos.Statistics
{
    public class DashboardOverviewDTO
    {
        public int TotalBookings { get; set; }                    // Tổng số đơn đặt tour
        public decimal TotalRevenue { get; set; }                 // Tổng doanh thu
        public int NewCustomersThisMonth { get; set; }            // Khách hàng mới trong tháng
        public int ActiveTours { get; set; }                      // Tour đang diễn ra
        public decimal RevenueGrowthPercent { get; set; }         // % tăng trưởng doanh thu so với tháng trước
        public int BookingGrowthPercent { get; set; }             // % tăng trưởng số đơn so với tháng trước
    }
}