using MongoDbGenericRepository.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Model.Entities.ConfigAssign
{

    [CollectionName("ConfigForm")]
    public class ConfigForm : AuditableEntity
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
        public Subject Subject { get; set; }
        public TaiLieuDinhKem FileDinhKems { get; set; }
    }
}
