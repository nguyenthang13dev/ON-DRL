using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Model.Entities
{
    [Table("ChuKy")]
    public class ChuKy : AuditableEntity
    {
        public Guid UserId { get; set; }
        public string? Name { get; set; }
        public string? DuongDanFile { get; set; }
    }
}