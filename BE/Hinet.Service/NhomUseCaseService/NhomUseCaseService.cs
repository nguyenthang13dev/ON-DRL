using Hinet.Model.Entities;
using Hinet.Repository.NhomUseCaseRepository;
using Hinet.Service.Common.Service;
using Hinet.Service.NhomUseCaseService.Dto;
using Hinet.Service.Common;
using Hinet.Service.Dto;
using Microsoft.EntityFrameworkCore;

namespace Hinet.Service.NhomUseCaseService
{
    public class NhomUseCaseService : Service<NhomUseCase>, INhomUseCaseService
    {
        public NhomUseCaseService(
            INhomUseCaseRepository nhomUseCaseRepository
            ) : base(nhomUseCaseRepository)
        {
        }

        public async Task<PagedList<NhomUseCaseDto>> GetData(NhomUseCaseSearch search)
        {
            var query = from q in GetQueryable()
                        select new NhomUseCaseDto()
                        {
                            TenNhom = q.TenNhom,
                            Order = q.Order,
                            ParentId = q.ParentId,
                            MoTa = q.MoTa,
                        };
            if (search == null)
            {

            }
            query = query.OrderByDescending(x => x.CreatedDate);
            var result = await PagedList<NhomUseCaseDto>.CreateAsync(query, search);
            return result;
        }

        public async Task<NhomUseCaseDto> GetDto(Guid id)
        {
            var item = await (from q in GetQueryable().Where(x => x.Id == id)
                              select new NhomUseCaseDto()
                              {
                                  TenNhom = q.TenNhom,
                                  Order = q.Order,
                                  ParentId = q.ParentId,
                                  MoTa = q.MoTa,
                              }).FirstOrDefaultAsync();

            return item;
        }

    }
}
