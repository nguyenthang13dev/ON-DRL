using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Hinet.Model.Entities;
using MongoDB.Bson.Serialization.Attributes;

namespace Hinet.Model.MongoEntities
{
    public class SinhVien : AuditableEntity
    {
        [BsonElement("maSV")]
        public string MaSV { get; set; }

        [BsonElement("hoTen")]
        public string HoTen { get; set; }

        [BsonElement("ngaySinh")]
        public DateTime NgaySinh { get; set; }

        [BsonElement("gioiTinh")]
        public bool GioiTinh { get; set; }

        [BsonElement("email")]
        public string Email { get; set; }

        [BsonElement("trangThai")]
        public string TrangThai { get; set; } // DangHoc, BaoLuu, DaTotNghiep, NghiHoc

        [BsonElement("khoaId")]
        public Guid KhoaId { get; set; }

        [BsonElement("lopHanhChinhId")]
        public Guid LopHanhChinhId { get; set; }

        public AppUser User { get; set; }

        
    }
}
