using Hinet.Model.Entities;
using Hinet.Service.UC_MoTa_UseCaseService.Dto;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.Dto;
using Hinet.Service.UC_MoTa_UseCaseService.ViewModels;
using Microsoft.AspNetCore.Http;

namespace Hinet.Service.UC_MoTa_UseCaseService
{
    public interface IUC_MoTa_UseCaseService : IService<UC_MoTa_UseCase>
    {
        Task<PagedList<UC_MoTa_UseCaseDto>> GetData(UC_MoTa_UseCaseSearch search);
        Task<UC_MoTa_UseCaseDto> GetDto(Guid id);

 
    }
}
