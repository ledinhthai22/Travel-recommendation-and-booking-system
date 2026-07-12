using System.IdentityModel.Tokens.Jwt;
using System.Reflection.PortableExecutable;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using DTOs.Auth;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.DTOs.Log;
using travel_recommendation_and_booking_system.DTOs.LogSystem;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Models;
namespace travel_recommendation_and_booking_system.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;
        private readonly ILogService _logService;
        private readonly ICurrentUserService _currentUserService;
        private readonly IDashboardNotifier _dashboardNotifier;

        public AuthService(AppDbContext context, IConfiguration configuration, IEmailService emailService, ILogService logService, ICurrentUserService currentUserService, IDashboardNotifier dashboardNotifier)
        {
            _context = context;
            _configuration = configuration;
            _emailService = emailService;
            _logService = logService;
            _currentUserService = currentUserService;
            _dashboardNotifier = dashboardNotifier;
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
            try
            {
                await _dashboardNotifier.NotifyDashboardChangedAsync("NewCustomer", new
                {
                    newNguoiDung.MaNguoiDung,
                    newNguoiDung.HoTen,
                    newNguoiDung.Email,
                    newNguoiDung.NgayTao
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[RegisterAsync] Dashboard notify error: {ex.Message}");
            }

            return errors;
        }
        public async Task<LoginResultDTO> LoginAsync(LoginDTO login, string? ipAddress)
        {
            var errors = new Dictionary<string, List<string>>();

            var user = await _context.NguoiDungs
                .FirstOrDefaultAsync(u =>
                    u.Email == login.Email &&
                    u.NgayXoa == null);


            if (user != null)
            {
                if (!BCrypt.Net.BCrypt.Verify(login.MatKhau, user.MatKhau))
                {
                    errors["TaiKhoan"] = new List<string>
                    {
                        "Tài khoản hoặc mật khẩu không chính xác"
                    };

                    return new LoginResultDTO
                    {
                        IsSuccess = false,
                        Errors = errors
                    };
                }


                if (user.TrangThai == 0)
                {
                    errors["TaiKhoan"] = new List<string>
                    {
                        "Tài khoản đã bị khóa"
                    };

                    return new LoginResultDTO
                    {
                        IsSuccess = false,
                        Errors = errors
                    };
                }

                var refreshToken = GenerateRefreshToken();


                var phienMoi = new PhienDangNhap
                {
                    MaNguoiDung = user.MaNguoiDung,
                    RefreshToken = refreshToken,
                    NgayHetHan = DateTime.Now.AddDays(7),
                    DiaChiIp = ipAddress
                };
                string accessToken;
                try
                {
                    _context.PhienDangNhaps.Add(phienMoi);
                    await _context.SaveChangesAsync();
                    accessToken = GenerateUserToken(user, phienMoi.MaPhien);
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.ToString());
                    throw;
                }


                await _logService.LoggingAsync(new LogDTO
                {
                    LoaiTaiKhoan = AccountTypeDTO.NguoiDung,

                    MaTaiKhoan = user.MaNguoiDung,

                    Email = user.Email,

                    TenHanhDong = ActionLogDTO.DangNhap,

                    TenBangTacDong = TableNameDTO.NguoiDung,

                    MaDoiTuong = user.MaNguoiDung,

                    GiaTriSau = new
                    {
                        user.Email,
                        user.HoTen,
                        user.MaVaiTro
                    }
                });



                return new LoginResultDTO
                {
                    IsSuccess = true,

                    Token = accessToken,

                    RefreshToken = refreshToken,

                    HoTen = user.HoTen,

                    MaVaiTro = user.MaVaiTro
                };
            }


            var staff = await _context.NhanViens
                .FirstOrDefaultAsync(n =>
                    n.Email == login.Email && n.TrangThai != 0 &&
                    n.NgayXoa == null);



            if (staff != null)
            {

                if (!BCrypt.Net.BCrypt.Verify(login.MatKhau, staff.MatKhau))
                {
                    errors["TaiKhoan"] = new List<string>
                    {
                        "Tài khoản hoặc mật khẩu không chính xác"
                    };

                    return new LoginResultDTO
                    {
                        IsSuccess = false,
                        Errors = errors
                    };
                }



                if (staff.TrangThai == 0)
                {
                    errors["TaiKhoan"] = new List<string>
                    {
                        "Tài khoản nhân viên đã bị khóa"
                    };

                    return new LoginResultDTO
                    {
                        IsSuccess = false,
                        Errors = errors
                    };
                }

                var refreshToken = GenerateRefreshToken();

                var phien = new PhienDangNhap
                {
                    MaNhanVien = staff.MaNhanVien,

                    RefreshToken = refreshToken,

                    NgayHetHan = DateTime.Now.AddDays(7),

                    DiaChiIp = ipAddress
                };

                _context.PhienDangNhaps.Add(phien);
                await _context.SaveChangesAsync();
                var accessToken = GenerateStaffToken(staff, phien.MaPhien);

                await _logService.LoggingAsync(new LogDTO
                {
                    LoaiTaiKhoan = AccountTypeDTO.NhanVien,
                    Email = staff.Email,
                    MaTaiKhoan = staff.MaNhanVien,

                    TenHanhDong = ActionLogDTO.DangNhap,
                    TenBangTacDong = "NhanVien",
                    MaDoiTuong = staff.MaNhanVien
                });

                return new LoginResultDTO
                {
                    IsSuccess = true,

                    Token = accessToken,

                    RefreshToken = refreshToken,

                    HoTen = staff.HoTen,

                    MaVaiTro = staff.MaVaiTro
                };
            }





            errors["TaiKhoan"] = new List<string>
            {
                "Tài khoản hoặc mật khẩu không chính xác"
            };


            return new LoginResultDTO
            {
                IsSuccess = false,

                Errors = errors
            };
        }
        public async Task<LoginResultDTO> RenewTokenAsync(TokenModelDTO token)
        {
            var errors = new Dictionary<string, List<string>>();

            var phien = await _context.PhienDangNhaps
                .Include(x => x.NguoiDung)
                .Include(x => x.NhanVien)
                .FirstOrDefaultAsync(x =>
                    x.RefreshToken == token.RefreshToken);

            if (phien == null || phien.NgayHetHan <= DateTime.Now)
            {
                errors["Token"] = new List<string>
                {
                    "Phiên đăng nhập không hợp lệ hoặc đã hết hạn"
                };

                return new LoginResultDTO
                {
                    IsSuccess = false,
                    Errors = errors
                };
            }

            string accessToken;

            if (phien.NguoiDung != null)
            {
                accessToken = GenerateUserToken(phien.NguoiDung, phien.MaPhien);
            }
            else if (phien.NhanVien != null)
            {
                accessToken = GenerateStaffToken(phien.NhanVien, phien.MaPhien);
            }
            else
            {
                errors["Token"] = new List<string>
                {
                    "Không xác định được chủ sở hữu phiên đăng nhập"
                };

                return new LoginResultDTO
                {
                    IsSuccess = false,
                    Errors = errors
                };
            }

            var refreshToken = GenerateRefreshToken();

            phien.RefreshToken = refreshToken;
            phien.NgayHetHan = DateTime.Now.AddDays(7);

            await _context.SaveChangesAsync();

            return new LoginResultDTO
            {
                IsSuccess = true,
                Token = accessToken,
                RefreshToken = refreshToken
            };
        }
        public async Task<bool> LogoutAsync(string refreshToken)
        {
            var phien = await _context.PhienDangNhaps
                .Include(x => x.NguoiDung)
                .Include(x => x.NhanVien)
                .FirstOrDefaultAsync(p => p.RefreshToken == refreshToken);

            if (phien == null)
                return false;

            string email = "";
            int accountId = 0;
            string accountType = "";

            if (phien.NguoiDung != null)
            {
                email = phien.NguoiDung.Email;
                accountId = phien.NguoiDung.MaNguoiDung;
                accountType = AccountTypeDTO.NguoiDung;
            }
            else if (phien.NhanVien != null)
            {
                email = phien.NhanVien.Email;
                accountId = phien.NhanVien.MaNhanVien;
                accountType = AccountTypeDTO.NhanVien;
            }

            await _logService.LoggingAsync(new LogDTO
            {
                LoaiTaiKhoan = accountType,
                Email = email,
                MaTaiKhoan = accountId,
                TenHanhDong = ActionLogDTO.DangXuat,
                TenBangTacDong = "PhienDangNhap",
                MaDoiTuong = phien.MaPhien
            });

            _context.PhienDangNhaps.Remove(phien);
            await _context.SaveChangesAsync();

            return true;
        }
        public async Task<bool> ForgotPasswordAsync(ForgotPasswordDTO model)
        {
            var user = await _context.NguoiDungs.FirstOrDefaultAsync(u => u.Email == model.Email && u.NgayXoa == null);
            if (user == null || user.TrangThai == 0 || user.TrangThai == 4)
            {
                return true;
            }

            if (user.LanGuiOtpGanNhat != null && user.LanGuiOtpGanNhat > DateTime.Now.AddMinutes(-1))
            {
                // Có thể ném ra một exception hoặc trả về false
                return false;
            }

            var random = new Random();
            string otp = random.Next(100000, 999999).ToString();

            user.MaOtp = otp;
            user.ThoiGianHetHanOtp = DateTime.Now.AddMinutes(5);
            user.LanGuiOtpGanNhat = DateTime.Now;
            user.SoLanNhapSaiOtp = 0;
            await _context.SaveChangesAsync();

            string subject = "Mã OTP Khôi Phục Mật Khẩu";
            string body = $@"
                <h3>Xin chào {user.HoTen},</h3>
                <p>Bạn vừa yêu cầu khôi phục mật khẩu. Dưới đây là mã OTP của bạn:</p>
                <h2 style='color: blue;'>{otp}</h2>
                <p>Mã này sẽ hết hạn trong vòng <strong>5 phút</strong>. Vui lòng không chia sẻ mã này cho bất kỳ ai.</p>";

            await _emailService.SendEmailAsync(user.Email, subject, body);
            await _logService.LoggingAsync(new LogDTO
            {
                LoaiTaiKhoan = AccountTypeDTO.NguoiDung,
                MaTaiKhoan = user.MaNguoiDung,
                Email = user.Email,
                TenHanhDong = ActionLogDTO.YeuCauOTP,

                TenBangTacDong = "NguoiDung",

                MaDoiTuong = user.MaNguoiDung,

                GiaTriSau = new
                {
                    user.Email
                }
            });
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
            await _logService.LoggingAsync(new LogDTO
            {
                LoaiTaiKhoan = AccountTypeDTO.NguoiDung,
                Email = user.Email,
                MaTaiKhoan = user.MaNguoiDung,

                TenHanhDong = ActionLogDTO.DoiMatKhau,

                TenBangTacDong = "NguoiDung",

                MaDoiTuong = user.MaNguoiDung
            });
            return true;
        }
        public async Task<(bool IsValid, string Message)> VerifyOtpAsync(VerifyOtpDTO model)
        {
            var user = await _context.NguoiDungs
                .FirstOrDefaultAsync(u => u.Email == model.Email && u.NgayXoa == null);

            if (user == null || string.IsNullOrEmpty(user.MaOtp))
                return (false, "Mã OTP không hợp lệ.");

            // 1. [CHỈNH SỬA] Đưa kiểm tra hết hạn lên đầu tiên!
            if (user.ThoiGianHetHanOtp < DateTime.Now)
                return (false, "Mã OTP đã hết hạn. Vui lòng gửi lại mã mới.");

            // 2. Sau đó mới kiểm tra khóa
            if (user.SoLanNhapSaiOtp >= 5 && user.LanNhapSaiOtpGanNhat > DateTime.Now.AddMinutes(-1))
            {
                return (false, "Bạn đã nhập sai quá nhiều lần. Vui lòng thử lại sau 1 phút.");
            }

            if (user.SoLanNhapSaiOtp >= 5 && user.LanNhapSaiOtpGanNhat <= DateTime.Now.AddMinutes(-1))
            {
                user.SoLanNhapSaiOtp = 0;
                await _context.SaveChangesAsync();
            }

            // 3. Cuối cùng mới kiểm tra mã đúng/sai
            if (user.MaOtp != model.Otp)
            {
                user.SoLanNhapSaiOtp = (user.SoLanNhapSaiOtp ?? 0) + 1;
                user.LanNhapSaiOtpGanNhat = DateTime.Now;
                await _context.SaveChangesAsync();

                int conLai = 5 - user.SoLanNhapSaiOtp.Value;
                return (false, conLai > 0 ? $"Mã OTP không chính xác. Bạn còn {conLai} lần nhập." : "Bạn đã bị tạm khóa do nhập sai quá nhiều.");
            }

            user.SoLanNhapSaiOtp = 0;
            await _context.SaveChangesAsync();
            return (true, "Mã OTP hợp lệ.");
        }
        private string GenerateStaffToken(NhanVien staff, int maPhien)
        {
            var jwtSettings = _configuration.GetSection("Jwt");

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtSettings["Key"]!));

            var creds = new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, staff.MaNhanVien.ToString()),
                new Claim("MaPhien", maPhien.ToString()),
                new Claim(ClaimTypes.Role, staff.MaVaiTro.ToString()),
                new Claim(ClaimTypes.Email, staff.Email),
                new Claim("account_type", "NhanVien")
            };

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        //Refresh Token
        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }


        private string GenerateUserToken(NguoiDung user, int maPhien)
        {
            var jwtSettings = _configuration.GetSection("Jwt");

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtSettings["Key"]!));

            var creds = new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.MaNguoiDung.ToString()),
                new Claim("MaPhien", maPhien.ToString()),
                new Claim(ClaimTypes.Role, user.MaVaiTro.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim("account_type", "NguoiDung")
            };

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
