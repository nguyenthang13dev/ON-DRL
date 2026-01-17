// Hinet.Model/MongoEntities/LopHanhChinh.cs
using System;
using Hinet.Model.Entities;
using MongoDB.Bson.Serialization.Attributes;

namespace Hinet.Model.MongoEntities
{
    public class LopHanhChinh : AuditableEntity
    {
        [BsonElement("tenLop")]
        public string TenLop { get; set; }
        
        [BsonElement("khoaId")]
        public Guid KhoaId { get; set; }
        
        [BsonElement("giaoVienCoVanId")]
        public Guid? GiaoVienCoVanId { get; set; }

        public AppUser? AppUser { get; set; }

    }
}

