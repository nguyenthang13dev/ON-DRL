using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Hinet.Model.Entities;
using MongoDB.Bson.Serialization.Attributes;

namespace Hinet.Model.MongoEntities
{
    public class Khoa : AuditableEntity
    {
        [BsonElement("tenKhoa")]
        public string TenKhoa { get; set; }
        [BsonElement("maKhoa")]
        public string MaKhoa { get; set; }
    }
}
