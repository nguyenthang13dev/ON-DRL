using Hinet.Service.Common.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.QLNhanSu.NS_ChamCongService.ViewModels
{
    public class NS_ChamCongEditVM : NS_ChamCongCreateVM, IHasId<Guid>
    {
        public Guid Id { get; set; }
        
    }
    public class UpdateDataListByMaNV
    {
        public string MaNV { get; set; }
        public List<DataChamCongTheoNgay> ChamCongList { get; set; }
    }
    public class DataChamCongTheoNgay
    {
        public string NgayLam { get; set; }
        public string GioVao { get; set; }
    }
}
