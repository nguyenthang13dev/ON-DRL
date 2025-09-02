using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.QLNhanSu.NS_BangCapService.ViewModels
{
    public class NS_BangCapCreateVM
    {
        [Required]
        public Guid NhanSuId { get; set; }
        [Required]
        public Guid TrinhDoId { get; set; }
        [Required]
        public string NoiCap { get; set; }

        public DateTime? NgayCap { get; set; }

        public string? GhiChu { get; set; }
    }
}
