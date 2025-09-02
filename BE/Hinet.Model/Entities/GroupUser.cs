using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Model.Entities
{
    [Table("GroupUser")]
    public class GroupUser : AuditableEntity
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public string Code { get; set; }
        public Guid? DepartmentId { get; set; }

    }
}
