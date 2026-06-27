using System.Net;
using System.Security.Cryptography;
using System.Text;

namespace travel_recommendation_and_booking_system.Helper
{
    public class VnPayLibrary
    {
        private readonly SortedDictionary<string, string> _requestData = new SortedDictionary<string, string>(StringComparer.Ordinal);
        private readonly SortedDictionary<string, string> _responseData = new SortedDictionary<string, string>(StringComparer.Ordinal);

        // Thêm tham số gửi đi sang VNPay
        public void AddRequestData(string key, string value)
        {
            if (!string.IsNullOrEmpty(value)) _requestData.Add(key, value);
        }

        // Thêm tham số VNPay trả về để kiểm tra
        public void AddResponseData(string key, string value)
        {
            if (!string.IsNullOrEmpty(value)) _responseData.Add(key, value);
        }

        // Lấy dữ liệu VNPay trả về dựa vào Key
        public string GetResponseData(string key)
        {
            return _responseData.TryGetValue(key, out var value) ? value : string.Empty;
        }

        // Tạo URL toàn chỉnh chứa chữ ký bảo mật để chuyển hướng sang VNPay
        public string CreateRequestUrl(string baseUrl, string hashSecret)
        {
            var queryString = new StringBuilder();
            foreach (var kv in _requestData)
            {
                queryString.Append($"{WebUtility.UrlEncode(kv.Key)}={WebUtility.UrlEncode(kv.Value)}&");
            }

            string rawData = queryString.ToString().TrimEnd('&');
            string vnpSecureHash = HmacSha512(hashSecret, rawData);
            Console.WriteLine("===== CREATE RAW =====");
            Console.WriteLine(rawData);

            Console.WriteLine("===== CREATE HASH =====");
            Console.WriteLine(vnpSecureHash);
            return $"{baseUrl}?{rawData}&vnp_SecureHash={vnpSecureHash}";
        }

        // Kiểm tra xem chữ ký từ VNPay gửi về có hợp lệ không (Chống sửa đổi dữ liệu)
        public bool ValidateSignature(string inputHash, string hashSecret)
        {
            var data = new List<string>();

            foreach (var kv in _responseData)
            {
                if (kv.Key == "vnp_SecureHash" ||
                    kv.Key == "vnp_SecureHashType")
                    continue;

                data.Add(
                    $"{WebUtility.UrlEncode(kv.Key)}={WebUtility.UrlEncode(kv.Value)}"
                );
            }

            string rawData = string.Join("&", data);

            Console.WriteLine(rawData);

            string myChecksum = HmacSha512(hashSecret, rawData);

            Console.WriteLine(myChecksum);
            Console.WriteLine(inputHash);

            return myChecksum.Equals(
                inputHash,
                StringComparison.InvariantCultureIgnoreCase);
        }
        // Thuật toán băm mã hóa HMAC-SHA512 chuẩn của cổng VNPay đời mới
        private string HmacSha512(string key, string inputData)
        {
            var hash = new StringBuilder();
            byte[] keyBytes = Encoding.UTF8.GetBytes(key);
            byte[] inputBytes = Encoding.UTF8.GetBytes(inputData);
            using (var hmac = new HMACSHA512(keyBytes))
            {
                byte[] hashValue = hmac.ComputeHash(inputBytes);
                foreach (var theByte in hashValue)
                {
                    hash.Append(theByte.ToString("x2"));
                }
            }
            return hash.ToString();
        }
    }
}