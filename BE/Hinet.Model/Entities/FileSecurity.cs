using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Model.Entities
{
    [Table("FileSecurity")]
    public class FileSecurity : AuditableEntity
    {
        public Guid SharedByID { get; set; }
        public Guid FileID {get ;set;}
        public string SharedToType {get ;set;}
        public Guid SharedToID {get ;set;}
        public string Permission { get; set; }

        public bool CanRead { get; set; }
        public bool CanWrite { get; set; }
        public bool CanDelete{ get; set; }
        public bool CanShare { get; set; }
    }
}
