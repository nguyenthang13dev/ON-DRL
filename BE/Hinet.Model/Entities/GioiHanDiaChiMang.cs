using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Model.Entities
{
    [Table("GioiHanDiaChiMang")]
    public class GioiHanDiaChiMang: AuditableEntity
    {
        public string IPAddress { get; set; }
        public bool Allowed { get; set; }
    }
}
