using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Model.Entities
{
    [Table("KySoCauHinh")]
    public class KySoCauHinh : AuditableEntity
    {
        public Guid? IdBieuMau { get; set; }
        public Guid? IdDTTienTrinhXuLy { get; set; }
        public string? Type { get; set; }
        public decimal PosX { get; set; }
        public decimal PosY { get; set; }
        public decimal Width { get; set; }
        public decimal Height { get; set; }
        public string? Content { get; set; }
        public string? ImageSrc { get; set; }
        public int? FontSize { get; set; }
        public string? TextColor { get; set; }
        //Tọa độ thông tin ký số
    }
}