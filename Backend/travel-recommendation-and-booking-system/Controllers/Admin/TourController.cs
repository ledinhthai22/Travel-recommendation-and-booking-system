using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Text.Json;
using travel_recommendation_and_booking_system.DTOs.Departure;
using travel_recommendation_and_booking_system.DTOs.Hotel;
using travel_recommendation_and_booking_system.DTOs.Schedule;
using travel_recommendation_and_booking_system.DTOs.Tour;
using travel_recommendation_and_booking_system.DTOs.Tour_KS;
using travel_recommendation_and_booking_system.Interfaces;

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
        public async Task<IActionResult> GetPagedTours([FromQuery] int page = 1,[FromQuery] int pageSize = 10,[FromQuery] string key = "",[FromQuery] bool? status = null)
        {
            var result = await _tour.GetPagedTourAsync(page, pageSize, key, status);
            return Ok(result);
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
                //
                ModelState.Clear();
                if (!TryValidateModel(dto))
                {
                    return BadRequest(ModelState);
                }
                //
                var images = requestForm.Files.ToList();
                var tourId = await _tour.CreateFullTourAsync(dto, images);

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
        [Consumes("multipart/form-data")]
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

                var images = requestForm.Files.ToList();
                var success = await _tour.UpdateFullTourAsync(id, dto, images);

                if (!success)
                    return NotFound($"Không tìm thấy tour với ID: {id}");

                return Ok(new { Message = "Cập nhật tour thành công!" });
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

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTour(int id)
        {
            var success = await _tour.SoftDeleteTourAsync(id);
            if (!success)
                return NotFound(new { Message = "Không tìm thấy tour hoặc tour đã bị xóa." });

            return Ok(new { Message = "Đã xóa mềm tour thành công!" });
        }

        //[HttpPost]
        //[Consumes("multipart/form-data")]
        //public async Task<IActionResult> Create([FromForm] TourDTO tour, [FromForm] List<IFormFile> images, [FromForm] List<int>? danhSachMaKhachSan)
        //{
        //    var id = await _tour.CreateTourAsync(tour, images,danhSachMaKhachSan);

        //    return Ok(new
        //    {
        //        Message = "Thêm tour thành công",
        //        MaTour = id
        //    });
        //}

        //[HttpPut("{id}")]
        //[Consumes("multipart/form-data")]
        //public async Task<IActionResult> Update(int id, [FromForm] TourDTO tour, [FromForm] List<IFormFile>? images ,[FromForm] List<int>? danhSachMaKhachSan)
        //{
        //    var result = await _tour.UpdateTourAsync(id, tour, images,danhSachMaKhachSan);

        //    return Ok(new
        //    {
        //        Message = "Cập nhật tour thành công",
        //        Success = result
        //    });
        //}

        //[HttpDelete("{id}")]
        //public async Task<IActionResult> Delete(int id)
        //{
        //    var result = await _tour.DeleteTourAsync(id);

        //    return Ok(new
        //    {
        //        Message = "Xóa tour thành công",
        //        Success = result
        //    });
        //}

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

        //[HttpPost("create-tour-ks")]
        //public async Task<IActionResult> Add([FromBody] Tour_KSDTO dto)
        //{
        //    return await _tour.AddToTourAsync(dto)
        //        ? Ok("Đã gán khách sạn vào tour")
        //        : BadRequest("Không thể gán (có thể đã tồn tại)");
        //}

        //[HttpDelete("{maTour}/{maKhachSan}")]
        //public async Task<IActionResult> Remove(int maTour, int maKhachSan)
        //{
        //    return await _tour.RemoveFromTourAsync(maTour, maKhachSan)
        //        ? Ok("Đã gỡ khách sạn khỏi tour")
        //        : NotFound();
        //}

    }
}
