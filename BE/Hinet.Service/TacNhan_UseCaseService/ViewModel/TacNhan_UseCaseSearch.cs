using Hinet.Service.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.TacNhan_UseCaseService.ViewModel
{
    public class TacNhan_UseCaseSearch : SearchBase
    {
        public string? MaTacNhan { get; set; }
        public string? TenTacNhan { get; set; }
        public Guid? idDuAn { get; set; }
    }
}
