using Hinet.Service.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.LienHeService.Dto
{
    public class LienHeSearchDto : SearchBase
    {
        public string? NameFilter { get; set; }
    }
}
