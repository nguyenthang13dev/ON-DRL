using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.QLThongBaoService.ViewModels
{
    public class QLThongBaoEditVM : QLThongBaoCreateVM
    {
        public Guid? Id { get; set; }
        public string? LoaiThongBao { get; set; }

    }
}
