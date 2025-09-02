using Hinet.Service.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.QL_NghiPhep.NP_DangKyNghiPhepService.Dto
{
    public class NP_DangKyNghiPhepSearchDto : SearchBase
    {
        public int? TrangThaiFilter { get; set; }
        public string? HoVaTenFilter { get; set; }
        public DateTime? NgayXinNghiFrom { get; set; }
        public DateTime? NgayXinNghiTo { get; set; }
    }
}
