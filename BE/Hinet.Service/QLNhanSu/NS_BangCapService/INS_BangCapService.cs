using Hinet.Model.Entities.QLNhanSu;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.QLNhanSu.NS_BangCapService.Dto;
using Hinet.Service.QLNhanSu.NS_BangCapService.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.QLNhanSu.NS_BangCapService
{
    public interface INS_BangCapService : IService<NS_BangCap>
    {
        Task<PagedList<NS_BangCapDto>> GetData(NS_BangCapSearch search);
        Task<NS_BangCapDto?> GetDto(Guid id);
    }
}
