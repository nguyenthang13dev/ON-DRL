using Hinet.Model.Entities.DA_Test_Case;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.UC_UseCaseDemoService.Dto;
using Hinet.Service.UC_UseCaseDemoService.ViewModels;

namespace Hinet.Service.UC_UseCaseDemoService
{
    public interface IUC_UseCaseDemoService : IService<UC_UseCaseDemo>
    {
        Task<PagedList<UC_UseCaseDemoDto>> GetData(UC_UseCaseDemoSearch search);
        Task<UC_UseCaseDemoDto> GetDto(Guid id);
    }
}