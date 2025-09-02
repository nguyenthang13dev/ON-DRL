using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Hinet.Service.Dto;

namespace Hinet.Service.DA_NhatKyTrienKhaiService.ViewModels
{
    public class DA_NhatKyTrienKhaiSearchVM :SearchBase
    {
        public Guid? DuAnId { get; set; }
        public DateTime? NgayBatDau { get; set; }
        public DateTime? NgayKetThuc { get; set; }
        public string? HangMucCongViec { get; set; }
        public string? NoiDungThucHien { get; set; }
        public string? PhanCong { get; set; }

    }
}
