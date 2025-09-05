using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Hinet.Model.Entities;
using MongoDB.Bson.Serialization.Attributes;

namespace Hinet.Model.MongoEntities
{
    public class DiemRenLuyen : AuditableEntity
    {
        [BsonElement("sinhVienId")]
        public Guid SinhVienId { get; set; }
        [BsonElement("hocKy")]
        public string HocKy { get; set; }
        [BsonElement("diem")]
        public int Diem { get; set; }
        [BsonElement("xepLoai")]
        public string XepLoai { get; set; }
    }

}
