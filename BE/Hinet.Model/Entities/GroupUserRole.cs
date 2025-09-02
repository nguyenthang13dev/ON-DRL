using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Model.Entities
{
    [Table("GroupUserRole")]
    public class GroupUserRole : AuditableEntity
    {
        public Guid GroupUserId { get; set; }
        public Guid RoleId { get; set; }
    }
}
