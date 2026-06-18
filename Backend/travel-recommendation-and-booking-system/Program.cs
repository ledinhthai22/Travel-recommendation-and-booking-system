
using System.Text;
using Hangfire;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Services;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.Extensions;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Jobs;
using travel_recommendation_and_booking_system.Services;
using travel_recommendation_and_booking_system.SignalR;

namespace travel_recommendation_and_booking_system
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();

            builder.Services.AddSwaggerGen(c =>
            {
                c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                {
                    Description = "Chỉ cần dán trực tiếp Access Token của bạn vào ô bên dưới (KHÔNG CẦN gõ thêm chữ Bearer).",
                    Name = "Authorization",
                    In = Microsoft.OpenApi.Models.ParameterLocation.Header,
                    Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
                    Scheme = "bearer",
                    BearerFormat = "JWT"
                });

                c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement()
                {
                    {
                        new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                        {
                            Reference = new Microsoft.OpenApi.Models.OpenApiReference
                            {
                                Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        new List<string>()
                    }
                });
            });
            builder.Services.AddSignalR();
            builder.Services.AddHangfire(config =>
            {
                config.UseSqlServerStorage(
                    builder.Configuration.GetConnectionString("DefaultConnection"));
            });

            builder.Services.AddHangfireServer();
            builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
            builder.Services.AddScoped<IAuthService, AuthService>();
            builder.Services.AddScoped<IContactService, ContactService>();
            builder.Services.AddScoped<IEmailService, EmailService>();
            builder.Services.AddScoped<IUserService, UserService>();
            builder.Services.AddScoped<INewsletterService, NewsletterService>();
            builder.Services.AddScoped<IWebInfoService, WebInfoService>();
            builder.Services.AddScoped<IBannerService, BannerService>();
            builder.Services.AddScoped<ITypeLocationService, TypeLocationService>();
            builder.Services.AddScoped<ILocationService, LocationService>();
            builder.Services.AddScoped<ITypeTourService, TypeTourService>();
            builder.Services.AddScoped<ITourService, TourService>();
            builder.Services.AddScoped<IUserProfileService, UserProfileService>();
            builder.Services.AddScoped<IStaffService, StaffService>();
            builder.Services.AddScoped<IPromotionService, PromotionService>();
            builder.Services.AddScoped<IHotelService, HotelService>();
            builder.Services.AddScoped<IAmenitiesService, AmenitiesService>();
            builder.Services.AddScoped<PromotionStatusJob>();
            var jwtSettings = builder.Configuration.GetSection("Jwt");
            var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]!);

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.SaveToken = true;
                options.RequireHttpsMetadata = false;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtSettings["Issuer"],
                    ValidAudience = jwtSettings["Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ClockSkew = TimeSpan.Zero
                };
            });
            builder.Services.AddAuthorization(options =>
            {
                options.AddPolicy("AdminOnly",
                    policy => policy.RequireRole("Quản Trị Viên"));
                options.AddPolicy("StaffOnly",
                    policy => policy.RequireRole("Nhân viên"));

                options.AddPolicy("UserOnly",
                    policy => policy.RequireRole("Người Dùng"));
            });
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("ReactPolicy",
                    policy =>
                    {
                        policy.WithOrigins("http://localhost:5173")
                              .AllowAnyHeader()
                              .AllowAnyMethod()
                              .AllowCredentials();
                    });
            });
            builder.Services.AddAuthorization();
            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }
            app.UseCors("ReactPolicy");
            app.UseStaticFiles();
            app.UseHttpsRedirection();
            app.UseRequestLogging();
            app.UseExceptionError();
            app.UseAuthentication();
            app.UseAuthorization();
            app.MapControllers();
            app.UseCustomHangfireJobs();
            app.MapHub<TravelRecommendationHub>("/TravelRecommendationHub");
            app.UseHangfireDashboard("/hangfire");
            app.Run();
        }
    }
}
