using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.DA_NhatKyTrienKhaiService.ViewModels
{
    public class DA_NhatKyTrienKhaiVM
    {
        public Guid DuAnId { get; set; }

        public string? PhanCong { get; set; }
        public DateTime? NgayBatDau { get; set; }
        public DateTime? NgayKetThuc { get; set; }

        public string? HangMucCongViec { get; set; }
        public string? NoiDungThucHien { get; set; }
        public string? KetQuaThucHien { get; set; }

        public string? GhiChu { get; set; }

        public string? KhoKhan { get; set; }
        public string? KienNghi { get; set; }
    }

    
}
