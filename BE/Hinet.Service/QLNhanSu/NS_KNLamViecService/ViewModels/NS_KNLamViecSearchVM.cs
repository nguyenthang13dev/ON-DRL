using Hinet.Service.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.QLNhanSu.NS_KNLamViecService.ViewModels
{
    public class NS_KNLamViecSearchVM : SearchBase
    {
        public string? MaNhanSu { get; set; }
        public string? TenCongTy { get; set; }
        public int? SoThangKinhNghiem { get; set; }
    }
}
