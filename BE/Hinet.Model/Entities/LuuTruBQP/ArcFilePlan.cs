using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Model.Entities.LuuTruBQP
{
    [Table("ArcFilePlan")]
    public class ArcFilePlan : AuditableEntity
    {
        public string FileCode { get; set; }
        public long FileCatalog{ get; set; }
        public string FileNotaion{ get; set; }
        public string Title { get; set; }
        public string PlanId { get; set; }
    }
}
