using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Hinet.Service.Dto;

namespace Hinet.Service.KhoaService.Dto
{
    public class KhoaSearch : SearchBase
    {
        public string? TenKhoa { get; set; }
        public string? MaKhoa { get; set; }
    }
}
