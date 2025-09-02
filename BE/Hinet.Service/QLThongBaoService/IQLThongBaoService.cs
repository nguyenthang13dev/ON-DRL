using Hinet.Model.Entities;
using Hinet.Service.Common;
using Hinet.Service.Common.Service; 
using Hinet.Service.QLThongBaoService.Dto;
using Hinet.Service.QLThongBaoService.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.QLThongBaoService
{
    public interface IQLThongBaoService : IService<QLThongBao>
    {
        Task<PagedList<QLThongBaoDto>> GetData(QLThongBaoSearch search);


    }
}
