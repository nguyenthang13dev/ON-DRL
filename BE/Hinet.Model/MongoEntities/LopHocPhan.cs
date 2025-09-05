using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Hinet.Model.Entities;
using MongoDB.Bson.Serialization.Attributes;

namespace Hinet.Model.MongoEntities
{
    // LopHocPhan
    public class LopHocPhan : AuditableEntity
    {
        [BsonElement("monHocId")]
        public Guid MonHocId { get; set; }
        [BsonElement("hocKy")]
        public string HocKy { get; set; }
        [BsonElement("giaoVienId")]
        public Guid GiaoVienId { get; set; }
    }
}
