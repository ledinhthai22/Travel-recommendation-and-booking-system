namespace travel_recommendation_and_booking_system.DTOs.Tour
{
    public class TourFilterParamsDTO
    {
        public string? Keyword { get; set; }
        public string? Category { get; set; }
        public decimal? MaxPrice { get; set; }
        public List<double>? Ratings { get; set; } // Ví dụ: [4, 5]
        public List<string>? DayFilters { get; set; } // Ví dụ: ["2-3", "4-7", "7+"]
        public string? Sort { get; set; } // price_asc, price_desc, rating
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 12;
    }
}
