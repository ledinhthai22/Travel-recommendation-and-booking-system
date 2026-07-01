namespace travel_recommendation_and_booking_system.Dtos.Statistics
{
    public class CustomerAgeGroupDTO
    {
        public string GroupName { get; set; } = string.Empty;
        public int Count { get; set; }
        public decimal Percentage { get; set; }
    }
}