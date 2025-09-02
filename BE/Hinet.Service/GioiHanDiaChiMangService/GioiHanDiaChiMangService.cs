using Hinet.Model.Entities;
using Hinet.Repository.GioiHanDiaChiMangRepository;
using Hinet.Service.Common.Service;
using Hinet.Service.GioiHanDiaChiMangService.Dto;
using Hinet.Service.Common;
using Hinet.Service.Dto;
using Microsoft.EntityFrameworkCore;

namespace Hinet.Service.GioiHanDiaChiMangService
{
    public class GioiHanDiaChiMangService : Service<GioiHanDiaChiMang>, IGioiHanDiaChiMangService
    {
        public GioiHanDiaChiMangService(
            IGioiHanDiaChiMangRepository gioiHanDiaChiMangRepository
            ) : base(gioiHanDiaChiMangRepository)
        {
        }

        public async Task<PagedList<GioiHanDiaChiMangDto>> GetData(GioiHanDiaChiMangSearch search)
        {
            var query = from q in GetQueryable()
                        select new GioiHanDiaChiMangDto()
                        {
                            IPAddress = q.IPAddress,
							Allowed = q.Allowed,
                            CreatedBy = q.CreatedBy,
                            UpdatedBy = q.UpdatedBy,
                            IsDelete = q.IsDelete,
                            DeleteId = q.DeleteId,
                            CreatedDate = q.CreatedDate,
                            UpdatedDate = q.UpdatedDate,
                            DeleteTime = q.DeleteTime,
                            Id = q.Id,
                        };
            if(search != null )
            {
                if(!string.IsNullOrEmpty(search.IPAddress))
				{
					query = query.Where(x => EF.Functions.Like(x.IPAddress, $"%{search.IPAddress}%"));
				}
				if(search.Allowed.HasValue)
				{
					query = query.Where(x => x.Allowed == search.Allowed);
				}
            }
            query = query.OrderByDescending(x=>x.CreatedDate);
            var result = await PagedList<GioiHanDiaChiMangDto>.CreateAsync(query, search);
            return result;
        }

        public async Task<GioiHanDiaChiMangDto?> GetDto(Guid id)
        {
            var item = await (from q in GetQueryable().Where(x=>x.Id == id)
                        select new GioiHanDiaChiMangDto()
                        {
                            IPAddress = q.IPAddress,
							Allowed = q.Allowed,
                            CreatedBy = q.CreatedBy,
                            UpdatedBy = q.UpdatedBy,
                            IsDelete = q.IsDelete,
                            DeleteId = q.DeleteId,
                            CreatedDate = q.CreatedDate,
                            UpdatedDate = q.UpdatedDate,
                            DeleteTime = q.DeleteTime,
                            Id = q.Id,
                        }).FirstOrDefaultAsync();
            
            return item;
        }

    }
}
