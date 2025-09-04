using Hinet.Model.MongoEntities;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.FormTemplateService.Dto;
using Microsoft.AspNetCore.Http;

namespace Hinet.Service.FormTemplateService
{
    public interface IFormTemplateService : IService<FormTemplate>
    {
        Task<PagedList<FormTemplateDto>> GetData(FormTemplateSearchDto search);
        Task<FormTemplate> UploadFormAsync(IFormFile file);
    }
}