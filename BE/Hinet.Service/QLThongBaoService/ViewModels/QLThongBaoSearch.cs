using Hinet.Service.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.QLThongBaoService.ViewModels
{
    public class QLThongBaoSearch : SearchBase
    {
        public string? TieuDe { get; set; }
        public string? LoaiThongBao { get; set; }
    }
}
