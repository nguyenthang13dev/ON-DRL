using Hinet.Model.Entities.TuyenDung;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.TD_ViTriTuyenDungService.Dto;
using Hinet.Service.TD_ViTriTuyenDungService.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.TD_ViTriTuyenDungService
{
  public interface ITD_TuyenDungService : IService<TD_TuyenDung>
  {
    Task<PagedList<TD_TuyenDungDto>> GetData(TD_TuyenDungSearchVM search);
    Task<TD_TuyenDungDto?> GetDto(Guid id);
  }
}
