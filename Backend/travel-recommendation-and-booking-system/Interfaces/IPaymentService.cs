// Interfaces/IPaymentService.cs
using travel_recommendation_and_booking_system.DTOs.Payment;

namespace travel_recommendation_and_booking_system.Interfaces
{
    public interface IPaymentService
    {
        Task<string> CreatePaymentUrlAsync(PaymentRequestDTO request, string remoteIpAddress);
        Task<(string RspCode, string Message)> ProcessVnPayIpnAsync(Dictionary<string, string> queryData);
    }
}