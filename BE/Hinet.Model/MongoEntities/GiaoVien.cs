// Hinet.Model/MongoEntities/GiaoVien.cs
using System;
using Hinet.Model.Entities;
using MongoDB.Bson.Serialization.Attributes;

namespace Hinet.Model.MongoEntities
{
    public class GiaoVien : AuditableEntity
    {
        [BsonElement("maGiaoVien")]
        public string MaGiaoVien { get; set; }
        
        [BsonElement("hoTen")]
        public string HoTen { get; set; }
        
        [BsonElement("email")]
        public string Email { get; set; }
        
        [BsonElement("soDienThoai")]
        public string? SoDienThoai { get; set; }
        
        [BsonElement("khoaId")]
        public Guid KhoaId { get; set; }
        
        [BsonElement("chucVu")]
        public string? ChucVu { get; set; }
        
        [BsonElement("trangThai")]
        public string TrangThai { get; set; } // DangLam, NghiViec, etc.
    }
}

