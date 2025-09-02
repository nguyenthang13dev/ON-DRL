using Hinet.Model.Entities.TuyenDung;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.TD_ViTriTuyenDungService.Dto
{
    public class TD_TuyenDungDto: TD_TuyenDung
    {
        public string? tenPhongBan { get; set; }
    }
}
