using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Hinet.Service.Common.Service;

namespace Hinet.Service.DA_NhatKyTrienKhaiService.ViewModels
{
    public class DA_NhatKyTrienKhaiEditVM : DA_NhatKyTrienKhaiCreateVM, IHasId<Guid>
    {
        public Guid Id { get ; set; }
    }
}
