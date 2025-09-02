using Hinet.Model.Entities;
using Hinet.Service.Common;
using Hinet.Service.Constant;

namespace Hinet.Service.DA_PhanCongService.Dto
{
    public class DA_PhanCongDto : DA_PhanCong
    {
        public string TenUser { get; set; }
        public string TenVaiTro { get; set; }
    }
}
