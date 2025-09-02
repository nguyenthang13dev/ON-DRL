using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Model.Entities
{
    [Table("NhomUseCase")]
    public class NhomUseCase : AuditableEntity
    {
        public string TenNhom { get; set; } 
        public int Order { get; set; }
        public Guid? ParentId { get; set; }
        public string MoTa { get; set; }
        
    }
}
