using System.Collections.Generic;
using System.Threading.Tasks;
using Hinet.Model.Entities;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.KeyEmailTemplateService.Dto;
using Hinet.Service.KeyEmailTemplateService.ViewModel;

namespace Hinet.Service.KeyEmailTemplateService
{
    public interface IKeyEmailTemplateService :IService<KeyEmailTemplate>
    {
        Task<PagedList<KeyEmailTemplateDto>> GetData(KeyEmailTemplateSearchVM keyEmailTemplateSearchVM);
        Task<KeyEmailTemplateDto> GetDto(Guid id);
        Task<KeyEmailTemplateDto> GetExistKey(string key, Guid EmailTemplateId);
    }
}