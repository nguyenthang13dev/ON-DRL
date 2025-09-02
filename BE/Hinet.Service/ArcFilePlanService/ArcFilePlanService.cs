using Hinet.Model.Entities;
using Hinet.Repository.ArcFilePlanRepository;
using Hinet.Service.Common.Service;
using Hinet.Service.ArcFilePlanService.Dto;
using Hinet.Service.Common;
using Hinet.Service.Dto;
using Microsoft.EntityFrameworkCore;
using Hinet.Model.Entities.LuuTruBQP;



namespace Hinet.Service.ArcFilePlanService
{
    public class ArcFilePlanService : Service<ArcFilePlan>, IArcFilePlanService
    {

        public ArcFilePlanService(
            IArcFilePlanRepository arcFilePlanRepository
            ) : base(arcFilePlanRepository)
        {
            
        }

        public async Task<PagedList<ArcFilePlanDto>> GetData(ArcFilePlanSearch search)
        {
            var query = from q in GetQueryable()
                        
                        select new ArcFilePlanDto()
                        {
                            FileCode = q.FileCode,
							FileCatalog = q.FileCatalog,
							FileNotaion = q.FileNotaion,
							Title = q.Title,
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
                if(!string.IsNullOrEmpty(search.FileCode))
				{
					query = query.Where(x => EF.Functions.Like(x.FileCode, $"%{search.FileCode}%"));
				}
				if(search.FileCatalog.HasValue)
				{
					query = query.Where(x => x.FileCatalog == search.FileCatalog);
				}
				if(!string.IsNullOrEmpty(search.FileNotaion))
				{
					query = query.Where(x => EF.Functions.Like(x.FileNotaion, $"%{search.FileNotaion}%"));
				}
				if(!string.IsNullOrEmpty(search.Title))
				{
					query = query.Where(x => EF.Functions.Like(x.Title, $"%{search.Title}%"));
				}
            }
            query = query.OrderByDescending(x=>x.CreatedDate);
            var result = await PagedList<ArcFilePlanDto>.CreateAsync(query, search);
            return result;
        }

        public async Task<ArcFilePlanDto?> GetDto(Guid id)
        {
            var item = await (from q in GetQueryable().Where(x=>x.Id == id)
                        
                        select new ArcFilePlanDto()
                        {
                            FileCode = q.FileCode,
							FileCatalog = q.FileCatalog,
							FileNotaion = q.FileNotaion,
							Title = q.Title,
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
