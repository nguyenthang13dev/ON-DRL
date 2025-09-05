using Hinet.Model.Entities;
using Hinet.Repository.ChuKyRepository;
using Hinet.Service.Common.Service;
using Hinet.Service.ChuKyService.Dto;
using Hinet.Service.Common;
using Hinet.Service.Dto;
using MongoDB.Driver.Linq;
using MongoDB.Driver;

namespace Hinet.Service.ChuKyService
{
    public class ChuKyService : Service<ChuKy>, IChuKyService
    {

        public ChuKyService(
            IChuKyRepository chuKyRepository
            ) : base(chuKyRepository)
        {

        }

        public async Task<List<ChuKyDto>?> GetChuKy(Guid? userId)
        {
            return await (from q in GetQueryable().Where(x => x.UserId == userId)
                          select new ChuKyDto()
                          {
                              Id = q.Id,
                              Name = q.Name,
                              DuongDanFile = q.DuongDanFile,
                              UserId = q.UserId,
                          }).ToListAsync();
        }

        public async Task<PagedList<ChuKyDto>> GetData(ChuKySearch search)
        {
            var query = from q in GetQueryable()

                        select new ChuKyDto()
                        {
                            UserId = q.UserId,
                            Name = q.Name,
                            DuongDanFile = q.DuongDanFile,
                            CreatedBy = q.CreatedBy,
                            UpdatedBy = q.UpdatedBy,
                            IsDelete = q.IsDelete,
                            DeleteId = q.DeleteId,
                            CreatedDate = q.CreatedDate,
                            UpdatedDate = q.UpdatedDate,
                            DeleteTime = q.DeleteTime,
                            Id = q.Id,
                        };
            if (search != null)
            {
                if (search.UserId.HasValue)
                {
                    query = query.Where(x => x.UserId == search.UserId);
                }

            }
            query = query.OrderByDescending(x => x.CreatedDate);
            var result = await PagedList<ChuKyDto>.CreateAsync(query, search);
            return result;
        }

        public async Task<ChuKyDto?> GetDto(Guid id)
        {
            var item = await (from q in GetQueryable().Where(x => x.Id == id)

                              select new ChuKyDto()
                              {
                                  UserId = q.UserId,
                                  Name = q.Name,
                                  DuongDanFile = q.DuongDanFile,
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
