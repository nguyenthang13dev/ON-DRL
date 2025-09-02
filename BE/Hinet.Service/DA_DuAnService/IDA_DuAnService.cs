using Hinet.Model.Entities;
using Hinet.Service.DA_DuAnService.Dto;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.DA_DuAnService.ViewModels;

namespace Hinet.Service.DA_DuAnService
{
    public interface IDA_DuAnService : IService<DA_DuAn>
    {
        Task<PagedList<DA_DuAnDto>> GetData(DA_DuAnSearch search);
        Task<DA_DuAnDto?> GetDto(Guid id);
        Task<DA_DuAnEditVM> GetForm(Guid idDuAn);
    }
}
