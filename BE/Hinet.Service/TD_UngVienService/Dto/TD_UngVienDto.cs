using Hinet.Model.Entities.TuyenDung;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.TD_UngVienService.Dto
{
    public class TD_UngVienDto : TD_UngVien
    {
        public string TrangThaiText { get; set; }
        public string GioiTinhText { get; set; }
        public string ViTriTuyenDungText { get; set; }
    }
}
