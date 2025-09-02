using Hinet.Model.Entities;
using Hinet.Service.FileSecurityService.Dto;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;

namespace Hinet.Service.FileSecurityService
{
    public interface IFileSecurityService : IService<FileSecurity>
    {
        Task<PagedList<FileSecurityDto>> GetData(FileSecuritySearch search);
        Task<FileSecurityDto?> GetDto(Guid id);
    }
}
