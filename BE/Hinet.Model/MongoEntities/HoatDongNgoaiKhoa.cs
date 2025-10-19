using Hinet.Model.Entities;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Model.MongoEntities
{
    public class HoatDongNgoaiKhoa : AuditableEntity
    {
        [BsonElement("TenHoatDong")]
        public string TenHoatDong { get; set; }
        [BsonElement("Status")]
        public string Status { get; set; }
        [BsonElement("QrValue")]
        public string? QrValue { get; set; }

        [BsonElement("ThoiGianDangKy")]
        public DateTime? ThoiHanDangKy { get; set; }
        public List<AppUser>? DanhSachDangKy { get; set; }
    }
}
