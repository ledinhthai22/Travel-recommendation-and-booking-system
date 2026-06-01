using System.ComponentModel.DataAnnotations.Schema;

namespace WebDuLich.Models
{
    [Table("DanhSachYeuThich")]
    public class DanhSachYeuThich
    {
        public int MaNguoiDung { get; set; }
        public int MaTour { get; set; }

        public virtual NguoiDung NguoiDung { get; set; }
        public virtual Tour Tour { get; set; }
    }
}
