using Hinet.Model.Entities;
using Hinet.Service.DA_PhanCongService.Dto;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.DA_PhanCongService.ViewModels;

namespace Hinet.Service.DA_PhanCongService
{
    public interface IDA_PhanCongService : IService<DA_PhanCong>
    {
        Task<List<DA_PhanCongEditVM>> GetByDuAn(Guid idDuAn);
        Task<PagedList<DA_PhanCongDto>> GetData(DA_PhanCongSearch search);
        Task<DA_PhanCongDto?> GetDto(Guid id);
        Task<List<DA_PhanCongDto>> ListPhanCong(Guid id);
    }
}
