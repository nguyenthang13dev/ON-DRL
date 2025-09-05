using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Model.Entities
{
    [Table("KySoInfo")]
    public class KySoInfo : AuditableEntity
    {
        public Guid UserId { get; set; }
        public Guid? IdDoiTuong { get; set; }
        public string? LoaiDoiTuong { get; set; }
        public string? DuongDanFile { get; set; }
        public string? DuongDanFileTemp { get; set; }
        public string? ThongTin { get; set; }
        public string? TrangThai { get; set; } //DAKYSO, CHUAKYSO
        //public string? Method { get; set; }
    }
}