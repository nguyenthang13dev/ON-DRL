using Hinet.Service.Dto;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.QLNhanSu.NS_BangCapService.ViewModels
{
    public class NS_BangCapSearch : SearchBase
    {
        public Guid? NhanSuId { get; set; }

        public Guid? TrinhDoId { get; set; }

        public string? NoiCap { get; set; }

        public DateTime? NgayCap { get; set; }

        public string? GhiChu { get; set; }
    }
}
