using System.ComponentModel.DataAnnotations.Schema;

namespace WebDuLich.Models
{
    [Table("KS_TN")]
    public class KS_TN
    {
        public int MaKhachSan { get; set; }
        public int MaTienNghi { get; set; }

        public virtual KhachSan KhachSan { get; set; }
        public virtual TienNghi TienNghi { get; set; }
    }
}
