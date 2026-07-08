using System.Security.Cryptography;
using System.Text;

namespace travel_recommendation_and_booking_system.Helper
{
    public static class VnPayRefundSigner
    {
        public static string HmacSHA512(string key, string inputData)
        {
            var hash = new StringBuilder();
            var keyBytes = Encoding.UTF8.GetBytes(key);
            var inputBytes = Encoding.UTF8.GetBytes(inputData);
            using var hmac = new HMACSHA512(keyBytes);
            var hashValue = hmac.ComputeHash(inputBytes);
            foreach (var b in hashValue)
                hash.Append(b.ToString("x2"));
            return hash.ToString();
        }
    }
}