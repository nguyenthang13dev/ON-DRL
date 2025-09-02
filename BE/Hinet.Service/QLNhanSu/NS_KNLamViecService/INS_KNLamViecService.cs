using Hinet.Model.Entities.QLNhanSu;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.QLNhanSu.NS_KNLamViecService.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.QLNhanSu.NS_KNLamViecService
{
    public interface INS_KNLamViecService : IService<NS_KinhNghiemLamViec>
    {
        int TotalWorkExperienceMonth(DateTime? startDate, DateTime? endDate);
        Task<PagedList<NS_KNLamViecDto>> GetListDto(Guid IdNhanSu);
    }
}
