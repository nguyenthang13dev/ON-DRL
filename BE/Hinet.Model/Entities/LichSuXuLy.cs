using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Model.Entities
{
    public class LichSuXuLy:AuditableEntity
    {
        public Guid ItemId { get; set; }
        public string ItemType { get; set; }
        public string? note { get; set; }
        public string? oldData { get; set; }
        public string? newDaTa { get; set; }
    }
}
