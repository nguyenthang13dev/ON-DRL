using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.TD_ViTriTuyenDungService.ViewModel
{
    public class TD_TuyenDungEditVM : TD_TuyenDungCreateVM
    {
        public Guid Id { get; set; }
    }
}
