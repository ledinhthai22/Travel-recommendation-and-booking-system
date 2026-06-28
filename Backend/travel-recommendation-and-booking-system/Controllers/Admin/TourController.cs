using Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Newtonsoft.Json;
using System.Security.Claims;
using System.Text.Json;
using travel_recommendation_and_booking_system.Constants;
﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using travel_recommendation_and_booking_system.DTOs.Departure;
using travel_recommendation_and_booking_system.DTOs.Schedule;
using travel_recommendation_and_booking_system.DTOs.Tour;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Models;
using travel_recommendation_and_booking_system.Services;

namespace travel_recommendation_and_booking_system.Controllers.Admin
{
    [Route("api/admin/[controller]")]
    [ApiController]
    [Authorize(Policy = "Admin&Staff")]
    public class TourController : ControllerBase
    {
        private readonly ITourService _tour;
        public TourController(ITourService tour)
        {
            _tour = tour;
        }

        [HttpGet("paged")]
        public async Task<IActionResult> GetPagedTours([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string key = "", [FromQuery] int? status = null)
        {
            var result = await _tour.GetPagedTourAsync(page, pageSize, key, status);
            return Ok(result);
        }
        [HttpGet("booking-select")]
        public async Task<IActionResult> GetToursForBookingSelect([FromQuery] string? keyword = null,[FromQuery] int? status = null)
        {
            try
            {
                var tours = await _tour.GetToursForSelectAsync(keyword, status);
                return Ok(new
                {
                    success = true,
                    data = tours
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi khi lấy danh sách tour",
                    error = ex.Message
                });
            }
        }
            [HttpPost("create-full")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> CreateFullTour([FromForm] TourDataForm form)
        {
            try
            {
                var requestForm = await Request.ReadFormAsync();
                var options = new System.Text.Json.JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var dto = new TourFullCreateDTO();

                if (requestForm.TryGetValue("TourDataJson", out var json1) || requestForm.TryGetValue("tourDataJson", out json1))
                {
                    if (!string.IsNullOrWhiteSpace(json1))
                    {
                        dto = System.Text.Json.JsonSerializer.Deserialize<TourFullCreateDTO>(json1, options);
                    }
                }
                else if (requestForm.Keys.Any(k => k.ToLower().Contains("tourinfo")))
                {
                    if (requestForm.TryGetValue("TourInfo", out var tInfo) || requestForm.TryGetValue("tourInfo", out tInfo))
                        dto.TourInfo = System.Text.Json.JsonSerializer.Deserialize<TourDTO>(tInfo, options);

                    if (requestForm.TryGetValue("DanhSachKhachSan", out var ks) || requestForm.TryGetValue("danhSachKhachSan", out ks))
                        dto.DanhSachKhachSan = System.Text.Json.JsonSerializer.Deserialize<List<int>>(ks, options);

                    if (requestForm.TryGetValue("LichTrinh", out var lt) || requestForm.TryGetValue("lichTrinh", out lt))
                        dto.LichTrinh = System.Text.Json.JsonSerializer.Deserialize<List<ScheduleDTO>>(lt, options);

                    if (requestForm.TryGetValue("ChuyenKhoiHanhs", out var ck) || requestForm.TryGetValue("chuyenKhoiHanhs", out ck))
                        dto.ChuyenKhoiHanhs = System.Text.Json.JsonSerializer.Deserialize<List<DepartureFullDTO>>(ck, options);
                }
                else
                {
                    var keys = string.Join(", ", requestForm.Keys);
                    return BadRequest($"Tôi đầu hàng! Key nhận được: [{keys}]. Sếp check lại file JSON đang dán xem!");
                }

                if (dto == null || dto.TourInfo == null)
                {
                    return BadRequest("Dữ liệu sau khi gom lại vẫn bị rỗng. Sếp check lại dư/thiếu dấu phẩy trong JSON nhé.");
                }

                ModelState.Clear();
                if (!TryValidateModel(dto))
                {
                    return BadRequest(ModelState);
                }
                foreach (var file in requestForm.Files)
                {
                    Console.WriteLine(
                        $"Name={file.Name} | FileName={file.FileName} | Length={file.Length}"
                    );
                }

                var images = requestForm.Files.Where(f => f.Name == "Images").ToList();
                var scheduleImages = requestForm.Files.Where(f => f.Name == "ScheduleFiles").ToList();

                var tourId = await _tour.CreateFullTourAsync(dto, images, scheduleImages);

                return Ok(new { Message = "Tạo tour thành công!", MaTour = tourId });
            }
            catch (System.Text.Json.JsonException ex)
            {
                return BadRequest($"Lỗi sai cú pháp JSON (dư/thiếu dấu phẩy, ngoặc): {ex.Message}");
            }
            catch (Exception ex)
            {
                var innerMsg = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                return StatusCode(500, $"Lỗi lưu Database: {innerMsg}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTour(int id, [FromForm] TourDataForm form)
        {
            try
            {
                var requestForm = await Request.ReadFormAsync();
                var options = new System.Text.Json.JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var dto = new TourFullCreateDTO();

                if (requestForm.TryGetValue("TourDataJson", out var json1) || requestForm.TryGetValue("tourDataJson", out json1))
                {
                    if (!string.IsNullOrWhiteSpace(json1))
                        dto = System.Text.Json.JsonSerializer.Deserialize<TourFullCreateDTO>(json1, options);
                }
                else if (requestForm.Keys.Any(k => k.ToLower().Contains("tourinfo")))
                {
                    if (requestForm.TryGetValue("TourInfo", out var tInfo) || requestForm.TryGetValue("tourInfo", out tInfo))
                        dto.TourInfo = System.Text.Json.JsonSerializer.Deserialize<TourDTO>(tInfo, options);
                    if (requestForm.TryGetValue("DanhSachKhachSan", out var ks) || requestForm.TryGetValue("danhSachKhachSan", out ks))
                        dto.DanhSachKhachSan = System.Text.Json.JsonSerializer.Deserialize<List<int>>(ks, options);
                    if (requestForm.TryGetValue("LichTrinh", out var lt) || requestForm.TryGetValue("lichTrinh", out lt))
                        dto.LichTrinh = System.Text.Json.JsonSerializer.Deserialize<List<ScheduleDTO>>(lt, options);
                    if (requestForm.TryGetValue("ChuyenKhoiHanhs", out var ck) || requestForm.TryGetValue("chuyenKhoiHanhs", out ck))
                        dto.ChuyenKhoiHanhs = System.Text.Json.JsonSerializer.Deserialize<List<DepartureFullDTO>>(ck, options);
                }
                else
                {
                    return BadRequest("Không tìm thấy dữ liệu JSON truyền lên.");
                }

                if (dto == null || dto.TourInfo == null)
                    return BadRequest("Dữ liệu sau khi gom lại bị rỗng.");

                ModelState.Clear();
                if (!TryValidateModel(dto))
                {
                    return BadRequest(ModelState);
                }
                Console.WriteLine("===== ALL FILES =====");

                foreach (var file in requestForm.Files)
                {
                    Console.WriteLine(
                        $"Name={file.Name} | FileName={file.FileName} | Length={file.Length}"
                    );
                }

                var images = requestForm.Files.Where(f => f.Name == "Images").ToList();
                var scheduleImages = requestForm.Files.Where(f => f.Name == "ScheduleFiles").ToList();


                var success = await _tour.UpdateFullTourAsync(id, dto, images, scheduleImages);

                if (!success)
                    return NotFound($"Không tìm thấy tour với ID: {id}");

                return Ok(new { Message = "Cập nhật thông tin chi tiết tour thành công!" });
            }
            catch (System.Text.Json.JsonException ex)
            {
                return BadRequest($"Lỗi sai cú pháp JSON: {ex.Message}");
            }
            catch (Exception ex)
            {
                var innerMsg = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                return StatusCode(500, $"Lỗi lưu Database: {innerMsg}");
            }
        }

        [HttpPatch("{id}/status")]
        public async Task<IActionResult> ChangeStatus(int id, [FromBody] ChangeTourStatusDTO dto)
        {
            var result = await _tour.ChangeStatusAsync(
                id,
                dto.TrangThai);

            return Ok(new
            {
                Success = result,
                Message = "Cập nhật trạng thái thành công"
            });
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTourDetail(int id)
        {
            try
            {
                var tourDetail = await _tour.GetTourDetailAsync(id);

                if (tourDetail == null)
                {
                    return NotFound(new { Message = $"Không tìm thấy tour với mã {id}" });
                }

                return Ok(tourDetail);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi hệ thống: {ex.Message}");
            }
        }
        [HttpGet("detail/{slug}")]
        public async Task<IActionResult> GetTourDetailBySlug(string slug)
        {
            if (string.IsNullOrWhiteSpace(slug))
            {
                return BadRequest(new { message = "Slug không được để trống." });
            }

            var tourDetail = await _tour.GetTourDetailBySlugAsync(slug);

            if (tourDetail == null)
            {
                return NotFound(new { message = "Không tìm thấy thông tin tour yêu cầu." });
            }

            return Ok(tourDetail);
        }
        [HttpGet("dia-diem/{slug}")]
        public async Task<IActionResult> GetToursByLocationSlug(string slug)
        {
            if (string.IsNullOrWhiteSpace(slug))
            {
                return BadRequest(new { message = "Slug địa điểm không được để trống." });
            }

            var tours = await _tour.GetToursByLocationSlugAsync(slug);


            return Ok(tours);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTour(int id)
        {
            var success = await _tour.SoftDeleteTourAsync(id);
            if (!success)
                return NotFound(new { Message = "Không tìm thấy tour hoặc tour đã bị xóa." });

            return Ok(new { Message = "Đã xóa mềm tour thành công!" });
        }


        [HttpPatch("images/{imageId}/set-main")]
        public async Task<IActionResult> SetMainImage(int imageId)
        {
            var result = await _tour.SetMainImageAsync(imageId);

            return Ok(new
            {
                Message = "Đặt ảnh chính thành công",
                Success = result
            });
        }

        [HttpDelete("images/{imageId}")]
        public async Task<IActionResult> DeleteImage(int imageId)
        {
            var result = await _tour.DeleteImageAsync(imageId);

            return Ok(new
            {
                Message = "Xóa ảnh thành công",
                Success = result
            });
        }

    }
}
