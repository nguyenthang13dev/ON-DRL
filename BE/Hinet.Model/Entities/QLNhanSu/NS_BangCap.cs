using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Model.Entities.QLNhanSu
{
    [Table("NS_BangCap")]
    public class NS_BangCap : AuditableEntity
    {
        [Required]
        public Guid? NhanSuId { get; set; }

        [Required]
        public Guid? TrinhDoId { get; set; }

        [StringLength(255)]
        public string? NoiCap { get; set; }

        public DateTime? NgayCap { get; set; }

        [StringLength(255)]
        public string? GhiChu { get; set; }
    }
}
