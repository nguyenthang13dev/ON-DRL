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

        // Lớp trưởng hay giáo viên kí đè sẽ lên trên này
        public bool IsPheDuyetLopTruong { get; set; }
        public bool IsPheDuyetGiaoVien { get; set; }
        public Guid? IdGiaoVien { get; set; }
        public Guid? IdLopTruong { get; set; }
        public Guid? IdFileKySo { get; set; }

        //Tọa độ thông tin ký số

        public AppUser? appUser { get; set; }
    }
}