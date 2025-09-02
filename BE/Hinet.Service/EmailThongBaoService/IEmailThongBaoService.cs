using Hinet.Model.Entities;
using Hinet.Service.EmailThongBaoService.Dto;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;

namespace Hinet.Service.EmailThongBaoService
{
    public interface IEmailThongBaoService : IService<EmailThongBao>
    {
        Task<PagedList<EmailThongBaoDto>> GetData(EmailThongBaoSearch search);
        Task<EmailThongBaoDto?> GetDto(Guid id);
    }
}
