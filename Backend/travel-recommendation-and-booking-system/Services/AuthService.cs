using System.Security.Claims;
using System.Security.Cryptography;
using DTOs.Auth;
using Microsoft.EntityFrameworkCore;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Models;

namespace travel_recommendation_and_booking_system.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;
        public AuthService(AppDbContext context, IConfiguration configuration, IEmailService emailService)
        {
            _context = context;
            _configuration = configuration;
            _emailService = emailService;
        }

        public async Task<Dictionary<string, List<string>>?> RegisterAsync(RegisterDTO register)
        {
            var errors = new Dictionary<string, List<string>>();

            var isEmail = await _context.NguoiDungs.AnyAsync(e => e.Email == register.Email && e.NgayXoa == null);

            if (isEmail)
            {
                errors["Email"] = new List<string> { "Email này đã tồn tại" };
            }

            var isPhoneExist = await _context.NguoiDungs.AnyAsync(u => u.SoDienThoai == register.SoDienThoai && u.NgayXoa == null);

            if (isPhoneExist)
            {
                errors["SoDienThoai"] = new List<string> { "Số điện thoại này đã tồn tại" };
            }

            if (errors.Count > 0)
            {
                return errors;
            }

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(register.MatKhau);

            int maKhachHang = 4;

            var newNguoiDung = new NguoiDung
            {
                HoTen = register.HoTen,
                Email = register.Email,
                MatKhau = passwordHash,
                SoDienThoai = register.SoDienThoai,
                GioiTinh = register.GioiTinh,
                MaVaiTro = maKhachHang,
                NgayTao = DateTime.Now,
                NgayCapNhat = DateTime.Now,
                TrangThai = 1
            };

            try
            {
                _context.NguoiDungs.Add(newNguoiDung);
                await _context.SaveChangesAsync();
                return null;
            }
            catch (Exception ex)
            {
                errors["HeThong"] = new List<string> { $"Lỗi phát sinh khi ghi dữ liệu: {ex.Message}" };
            }
            return errors;
        }
        public async Task<LoginResultDTO> LoginAsync(LoginDTO login, string? ipAddress)
        {
            var errors = new Dictionary<string, List<string>>();
            var user = await _context.NguoiDungs.FirstOrDefaultAsync(u => u.Email == login.Email && u.NgayXoa == null);

            if (user == null || !BCrypt.Net.BCrypt.Verify(login.MatKhau, user.MatKhau))
            {
                errors["TaiKhoan"] = new List<string> { "Tài khoản hoặc mật khẩu không chính xác" };
                return new LoginResultDTO { IsSuccess = false, Errors = errors };
            }

            if (user.TrangThai == 0 || user.TrangThai == 4)
            {
                errors["TaiKhoan"] = new List<string> { "Tài khoản của bạn đã bị khóa hoặc vô hiệu hóa" };
                return new LoginResultDTO { IsSuccess = false, Errors = errors };
            }

            var accessToken = GenerateJwtToken(user);
            var refreshToken = GenerateRefreshToken();

            var phienMoi = new PhienDangNhap
            {
                MaNguoiDung = user.MaNguoiDung,
                RefreshToken = refreshToken,
                NgayHetHan = DateTime.Now.AddDays(7),
                DiaChiIp = ipAddress
            };

            _context.PhienDangNhaps.Add(phienMoi);
            await _context.SaveChangesAsync();

            return new LoginResultDTO { IsSuccess = true, Token = accessToken, RefreshToken = refreshToken, HoTen = user.HoTen, MaVaiTro = user.MaVaiTro };
        }
        public async Task<LoginResultDTO> RenewTokenAsync(TokenModelDTO token)
        {
            {
                var errors = new Dictionary<string, List<string>>();

                var phien = await _context.PhienDangNhaps.Include(p => p.NguoiDung).FirstOrDefaultAsync(p => p.RefreshToken == token.RefreshToken);

                if (phien == null || phien.NgayHetHan <= DateTime.Now)
                {
                    errors["Token"] = new List<string> { "Phiên đăng nhập không hợp lệ hoặc đã hết hạn" };
                    return new LoginResultDTO { IsSuccess = false, Errors = errors };
                }

                var newAccessToken = GenerateJwtToken(phien.NguoiDung);
                var newRefreshToken = GenerateRefreshToken();

                phien.RefreshToken = newRefreshToken;
                phien.NgayHetHan = DateTime.Now.AddMinutes(2);

                await _context.SaveChangesAsync();

                return new LoginResultDTO { IsSuccess = true, Token = newAccessToken, RefreshToken = newRefreshToken };
            }
        }
        public async Task<bool> LogoutAsync(string refreshToken)
        {
            var phien = await _context.PhienDangNhaps.FirstOrDefaultAsync(p => p.RefreshToken == refreshToken);
            if (phien != null)
            {
                _context.PhienDangNhaps.Remove(phien);
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }
        public async Task<bool> ForgotPasswordAsync(ForgotPasswordDTO model)
        {
            var user = await _context.NguoiDungs.FirstOrDefaultAsync(u => u.Email == model.Email && u.NgayXoa == null);
            if (user == null || user.TrangThai == 0 || user.TrangThai == 4)
            {
                return true;
            }

            var random = new Random();
            string otp = random.Next(100000, 999999).ToString();

            user.MaOtp = otp;
            user.ThoiGianHetHanOtp = DateTime.Now.AddMinutes(5);
            await _context.SaveChangesAsync();

            string subject = "Mã OTP Khôi Phục Mật Khẩu";
            string body = $@"
                <h3>Xin chào {user.HoTen},</h3>
                <p>Bạn vừa yêu cầu khôi phục mật khẩu. Dưới đây là mã OTP của bạn:</p>
                <h2 style='color: blue;'>{otp}</h2>
                <p>Mã này sẽ hết hạn trong vòng <strong>5 phút</strong>. Vui lòng không chia sẻ mã này cho bất kỳ ai.</p>";

            await _emailService.SendEmailAsync(user.Email, subject, body);
            return true;
        }
        public async Task<bool> ResetPasswordAsync(ResetPasswordDTO model)
        {
            var user = await _context.NguoiDungs.FirstOrDefaultAsync(u => u.Email == model.Email && u.NgayXoa == null);
            if (user == null) return false;

            if (user.MaOtp != model.Otp || user.ThoiGianHetHanOtp < DateTime.Now)
            {
                return false;
            }

            user.MatKhau = BCrypt.Net.BCrypt.HashPassword(model.NewPassword);
            user.MaOtp = null;
            user.ThoiGianHetHanOtp = null;

            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> VerifyOtpAsync(VerifyOtpDTO model)
        {
            var user = await _context.NguoiDungs
                .FirstOrDefaultAsync(u =>
                    u.Email == model.Email &&
                    u.NgayXoa == null);

            if (user == null)
            {
                return false;
            }

            if (string.IsNullOrEmpty(user.MaOtp))
            {
                return false;
            }

            if (user.MaOtp != model.Otp)
            {
                return false;
            }

            if (user.ThoiGianHetHanOtp == null ||
                user.ThoiGianHetHanOtp < DateTime.Now)
            {
                return false;
            }

            return true;
        }
        //Token
        private string GenerateJwtToken(NguoiDung user)
        {
            var jwtSettings = _configuration.GetSection("Jwt");
            var key = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(jwtSettings["Key"]!));
            var creds = new Microsoft.IdentityModel.Tokens.SigningCredentials(key, Microsoft.IdentityModel.Tokens.SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.MaNguoiDung.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.HoTen),
                new Claim(ClaimTypes.Role, user.MaVaiTro.ToString())
            };

            var token = new System.IdentityModel.Tokens.Jwt.JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(Convert.ToDouble(jwtSettings["DurationInMinutes"])),
                signingCredentials: creds
            );

            return new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler().WriteToken(token);
        }
        //Refresh Token
        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

    }
}
