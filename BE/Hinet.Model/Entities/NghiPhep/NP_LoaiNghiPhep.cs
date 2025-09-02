using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Model.Entities.NghiPhep
{
    [Table("NP_LoaiNghiPhep")]
    public class NP_LoaiNghiPhep : AuditableEntity
    {
        //Note: Tên loại nghỉ phép (VD: Phép năm)
        public string? TenLoaiPhep { get; set; }
        public string? MaLoaiPhep { get; set; }
        //Note: Số ngày phép mặc định
        public double SoNgayMacDinh { get; set; }
    }
}
