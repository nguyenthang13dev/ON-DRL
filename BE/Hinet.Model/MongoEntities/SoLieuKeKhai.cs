using Hinet.Model.Entities;
using Hinet.Model.Entities.ConfigAssign;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Model.MongoEntities
{
    public class SoLieuKeKhai : AuditableEntity
    {
        public AppUser UserId { get; set; }
        public ConfigFormKey KTT_KEY { get; set; }
        public ConfigForm  ConfigForm { get; set; }
        public string KTT_VALUE { get; set; }
    }
}
