using Hinet.Model.MongoEntities;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.FormDeclarationService.Dto;

namespace Hinet.Service.FormDeclarationService
{
    public interface IFormDeclarationService : IService<FormDeclaration>
    {
        Task<PagedList<FormDeclarationDto>> GetData(FormDeclarationSearchDto search);
    }
}