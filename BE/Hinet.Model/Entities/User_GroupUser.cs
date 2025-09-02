using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Model.Entities
{
    [Table("User_GroupUser")]
    public class User_GroupUser : AuditableEntity
    {
        public Guid UserId { get; set; }
        public Guid GroupUserId { get; set; }
    }
}
