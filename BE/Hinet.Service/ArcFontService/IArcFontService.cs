using Hinet.Model.Entities;
using Hinet.Model.Entities.LuuTruBQP;
using Hinet.Service.ArcFontService.Dto;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;

namespace Hinet.Service.ArcFontService
{
    public interface IArcFontService : IService<ArcFont>
    {
        Task<bool> CheckOrganID(string value, Guid? Id);
        Task<PagedList<ArcFontDto>> GetData(ArcFontSearch search);
        Task<ArcFontDto?> GetDto(Guid id);
    }
}
