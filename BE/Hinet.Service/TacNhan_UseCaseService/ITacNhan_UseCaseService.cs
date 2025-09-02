using Hinet.Model.Entities.DA_Test_Case;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.TacNhan_UseCaseService.Dto;
using Hinet.Service.TacNhan_UseCaseService.ViewModel;
using Hinet.Service.TD_ViTriTuyenDungService.Dto;
using Hinet.Service.TD_ViTriTuyenDungService.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.TacNhan_UseCaseService
{
    public interface ITacNhan_UseCaseService : IService<TacNhan_UseCase>
    {
        Task<PagedList<TacNhan_UseCaseDto>> GetData(TacNhan_UseCaseSearch search);
        Task<TacNhan_UseCaseDto?> GetDto(Guid id);
        Task<string> GenerateMaTacNhan();
    }
}
