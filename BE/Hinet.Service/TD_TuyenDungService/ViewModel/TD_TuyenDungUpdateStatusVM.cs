using Hinet.Model.Entities.TuyenDung;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.TD_TuyenDungService.ViewModel
{
    public class TD_TuyenDungUpdateStatusVM
    {
        public Guid Id { get; set; }
        public TinhTrang_TuyenDung TrangThai { get; set; }
    }
}
