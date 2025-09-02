using Hinet.Model.Entities;
using Hinet.Service.TaiLieuDinhKemService.Dto;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;

namespace Hinet.Service.TaiLieuDinhKemService
{
    public interface ITaiLieuDinhKemService : IService<TaiLieuDinhKem>
    {
        Task<PagedList<TaiLieuDinhKemDto>> GetData(TaiLieuDinhKemSearch search);

        Task<TaiLieuDinhKemDto> GetDto(Guid id);

        Task<List<TaiLieuDinhKem>> GetByItemAsync(Guid itemId);

        Task<List<TaiLieuDinhKem>> GetByIdsAsync(string ids);

        Task UpdateItemIdAsync(string ids, Guid ItemId);

        Task<List<TaiLieuDinhKem>> GetKySo(List<Guid> Ids);

        Task<string> GetPathFromId(Guid id);

        Task<TaiLieuDinhKem> AddOrEditPath(string FilePath, Guid Id);

        Task<string> GetPathItem(Guid ItemId);
        Task<TaiLieuDinhKem> GetTaiLieuByType(string Type);
    }
}