using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.QLNhanSu.NS_KNLamViecService.ViewModels
{
    public class NS_KNLamViecCreateVM
    {
        public Guid NhanSuId { get; set; }
        public string TenCongTy { get; set; }
        public string? MaNV { get; set; }
        public int TotalMonth { get; set; }
        public DateTime? TuNgay { get; set; }
        public DateTime? DenNgay { get; set; }
    }
}
