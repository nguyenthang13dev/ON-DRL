using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Model.Entities
{
    public class KeyEmailTemplate: AuditableEntity
    {
        public string Key { get; set; }
        public Guid EmailTemplateId { get; set; }
        public string Value { get; set; }
    }
}
