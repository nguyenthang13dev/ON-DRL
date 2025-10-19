using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.SoLieuKeKhaiService.ViewModels
{
    public class SoLieuKeKhaiForm
    {
        public Guid FormId { get; set; }
        public Guid? UserId { get; set; }
        public List<SoLieuKeKhaiCreateVM> Lst_KeKhai { get; set; }
    }

}
