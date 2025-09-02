using Hinet.Service.Common.Service;
using Hinet.Service.QLNhanSu.NS_ChamCongService.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.QLNhanSu.NS_KNLamViecService.ViewModels
{
    public class NS_KNLamViecEditVM : NS_KNLamViecCreateVM, IHasId<Guid>
    {
        public Guid Id { get; set; }
    }
}
