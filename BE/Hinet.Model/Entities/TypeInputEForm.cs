using MongoDbGenericRepository.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Model.Entities
{
    [CollectionName("TypeDanhMuc")]
    public class TypeDanhMuc : AuditableEntity
    {
        public string Name { get; set; }
        public string Type { get; set; }
        public string? CodeDm { get; set; }
        public int? Min { get; set; }
        public int? Max { get; set; }
    }
}
