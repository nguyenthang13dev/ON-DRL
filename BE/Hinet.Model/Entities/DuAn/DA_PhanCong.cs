using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Model.Entities
{
    [Table("DA_PhanCong")]
    public class DA_PhanCong : AuditableEntity
    {
        public Guid DuAnId { get; set; }
        public string VaiTroId { get; set; }
        public Guid UserId { get; set; }
        public Int16 OrderBy { get; set; }
    }
}
