using Hinet.Model.Entities.QLNhanSu;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.QLNhanSu.NS_NhanSuService.Dto
{
    public class BaoCaoThongKeNsDto<T>
    {
            public string? NameSearch { get; set; }
            public int Total { get; set; }
            public List<T> ListItem { get; set; }
    }
    public class ThongKeHopDongLaoDongDto
    {
        public int Total { get; set; }
        public int Expired { get; set; }
        public int ExpiredSoon { get; set; }
        public List<ContractTypeDto> ContractTypes { get; set; }

    }
    public class ContractTypeDto
    {
        public string Type { get; set; }
        public int Count { get; set; }
    }
}
