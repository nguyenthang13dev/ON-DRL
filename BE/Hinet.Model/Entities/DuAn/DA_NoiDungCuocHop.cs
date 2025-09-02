using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Model.Entities
{
    [Table("DA_NoiDungCuocHop")]
    public class DA_NoiDungCuocHop:AuditableEntity
    {
        public Guid DuAnId { get; set; }
        [MaxLength(255)]
        public string TenDuAn { get; set; }
        public bool IsNoiBo { get; set; }
        [MaxLength(550)]
        public string? ThanhPhanThamGia { get; set; }
        public DateTime? ThoiGianHop { get; set; }
        public string? NoiDungCuocHop { get; set; }
        [MaxLength(350)]
        public string? DiaDiemCuocHop { get; set; }
    }
}
