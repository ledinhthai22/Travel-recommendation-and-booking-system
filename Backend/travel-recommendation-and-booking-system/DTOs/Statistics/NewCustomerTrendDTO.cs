namespace travel_recommendation_and_booking_system.Dtos.Statistics
{

    public class NewCustomerTrendDTO
    {
        public string Month { get; set; } = "";
        public int CustomerCount { get; set; }
        public int MaleCount { get; set; }
        public int FemaleCount { get; set; }
        public int UnknownCount { get; set; }
        public int? Day { get; set; } 
    }
}