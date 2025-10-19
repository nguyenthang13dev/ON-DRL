using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.KeKhaiSumaryService.ViewModels
{
    public class KeKhaiSummaryCreateVM
    {
        public Guid FormId { get; set; }
        public Guid UserId { get; set; }
        public bool IsDanhGia { get; set; }
        public decimal? Processs { get; set; }
    }
}
