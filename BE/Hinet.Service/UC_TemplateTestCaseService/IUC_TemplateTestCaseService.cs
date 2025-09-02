using Hinet.Model.Entities;
using Hinet.Service.UC_TemplateTestCaseService.Dto;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.Dto;

namespace Hinet.Service.UC_TemplateTestCaseService
{
    public interface IUC_TemplateTestCaseService : IService<UC_TemplateTestCase>
    {
        Task<PagedList<UC_TemplateTestCaseDto>> GetData(UC_TemplateTestCaseSearch search);
        Task<UC_TemplateTestCaseDto> GetDto(Guid id);
        Task<List<UseCaseGenerateResultDto>> GenerateUseCaseStrings(List<UseCaseInputDto> inputList);
    }
}
