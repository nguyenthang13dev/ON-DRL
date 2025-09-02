using Hinet.Model.Entities;
using Hinet.Service.Common;
using Hinet.Service.Constant;
using Hinet.Service.DA_PhanCongService.Dto;
using Hinet.Service.DA_PhanCongService.ViewModels;

namespace Hinet.Service.DA_DuAnService.Dto
{
    public class DA_DuAnDto : DA_DuAn
    {
        public List<DA_PhanCongDto> PhanCongList { get; set; }
        public string? TenTrangThaiThucHien
        {
            get
            {
                if(TrangThaiThucHien == null)
                {
                    return null;
                }
                return ConstantExtension.GetName<DuAnStatusConstant>(TrangThaiThucHien.ToString());

            }
        }
    }
}
