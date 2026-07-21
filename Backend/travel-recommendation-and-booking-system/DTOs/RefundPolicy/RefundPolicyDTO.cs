// DTOs/Common/RefundPolicyDTO.cs
namespace travel_recommendation_and_booking_system.DTOs.Common
{
    public class RefundPolicyDTO
    {
        public int DaysBeforeDeparture { get; set; }
        public decimal RefundRate { get; set; }
        public string Policy { get; set; } = string.Empty;
        public bool IsRefundable { get; set; }
        public decimal EstimatedRefundAmount { get; set; }
        public decimal EstimatedLostAmount { get; set; }
    }
}