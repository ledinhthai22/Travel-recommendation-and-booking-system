using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using travel_recommendation_and_booking_system.Models;

[Table("LoaiDiaDiem")]
public class LoaiDiaDiem
{
    [Key]
    public int MaLoaiDiaDiem { get; set; }
    [Required]
    [StringLength(255)]
    public string TenLoaiDiaDiem { get; set; }
    public DateTime NgayTao{ get; set; }
    public DateTime NgayCapNhat { get; set; }
    public DateTime? Ngayxoa { get; set; } = null;
    public ICollection<DiaDiem> DanhSachDiaDiem { get; set; } = new List<DiaDiem>();
}