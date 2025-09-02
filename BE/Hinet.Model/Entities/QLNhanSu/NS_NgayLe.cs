using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Model.Entities.QLNhanSu
{
    [Table("NS_NgayLe")]
    public class NS_NgayLe : AuditableEntity
    {
        public DateTime NgayBatDau { get; set; }
        public DateTime NgayKetThuc { get; set; }

        [StringLength(100)]
        public string TenNgayLe { get; set; }
        public string? LoaiNLCode { get; set; }
        public string? MoTa { get; set; }
        public string TrangThai { get; set; }
        public int Nam { get; set; }
    }
}
