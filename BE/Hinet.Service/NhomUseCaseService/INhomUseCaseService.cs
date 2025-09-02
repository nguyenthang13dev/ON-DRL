using Hinet.Model.Entities;
using Hinet.Service.NhomUseCaseService.Dto;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.Dto;

namespace Hinet.Service.NhomUseCaseService
{
    public interface INhomUseCaseService : IService<NhomUseCase>
    {
        Task<PagedList<NhomUseCaseDto>> GetData(NhomUseCaseSearch search);
        Task<NhomUseCaseDto> GetDto(Guid id);
    }
}
