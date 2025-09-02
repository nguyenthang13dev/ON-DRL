using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Model.Entities.NghiPhep
{
    [Table("NP_DangKyNghiPhep")]
    public class NP_DangKyNghiPhep : AuditableEntity
    {
        public string? MaNhanSu { get; set; }
        public string? MaLoaiPhep { get; set; }
        public DateTime TuNgay { get; set; }
        public DateTime DenNgay { get; set; }
        public required string LyDo { get; set; }
        public Decimal SoNgayNghi { get; set; }
        public int TrangThai { get; set; }
        public string? MaTruongBanDuyet { get; set; }
        public string? MaGiamDocDuyet { get; set; }
        public DateTime NgayDangKy { get; set; }
        public DateTime? NgayDuyet { get; set; }
        public string? LyDoTuChoi { get; set; }
        public string? MaNhanSuBanGiao { get; set; }
        public string? CongViecBanGiao { get; set; }

    }
}
