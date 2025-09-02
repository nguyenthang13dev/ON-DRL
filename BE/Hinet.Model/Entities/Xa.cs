using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Model.Entities
{
    [Table("Xa")]
    public class Xa : AuditableEntity
    {
        public string? MaXa { get; set; }
        public string? TenXa { get; set; }
        public string? MaHuyen { get; set; }
        public string? Loai { get; set; }
    }
}
