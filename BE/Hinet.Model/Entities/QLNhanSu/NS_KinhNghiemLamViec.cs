using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Model.Entities.QLNhanSu
{
    [Table("NS_KinhNghiemLamViec")]
    public class NS_KinhNghiemLamViec : AuditableEntity
    {
        [Required]
        public Guid? NhanSuId { get; set; }

        [StringLength(200)]
        public string TenCongTy { get; set; }

        [StringLength(100)]
        public string? ChucVu { get; set; }

        public DateTime? TuNgay { get; set; }
        public DateTime? DenNgay { get; set; }

        [StringLength(500)]
        public string? MoTa { get; set; }
        public string? MaNV { get; set; }
        public int TotalMonth { get; set; }

    }
}
