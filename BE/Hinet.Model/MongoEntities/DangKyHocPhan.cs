using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Hinet.Model.Entities;
using MongoDB.Bson.Serialization.Attributes;

namespace Hinet.Model.MongoEntities
{
    public class DangKyHocPhan : AuditableEntity
    {
        [BsonElement("sinhVienId")]
        public Guid SinhVienId { get; set; }
        [BsonElement("lopHocPhanId")]
        public Guid LopHocPhanId { get; set; }
        [BsonElement("diemQuaTrinh")]
        public decimal DiemQuaTrinh { get; set; }
        [BsonElement("diemThi")]
        public decimal DiemThi { get; set; }
        [BsonElement("diemTongKet")]
        public decimal DiemTongKet { get; set; }
        [BsonElement("ketQua")]
        public string KetQua { get; set; }
    }
}
