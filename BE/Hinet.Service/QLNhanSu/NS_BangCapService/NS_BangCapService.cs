using Hinet.Model.Entities.QLNhanSu;
using Hinet.Repository.QLNhanSu.NS_BangCapRepository;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.QLNhanSu.NS_BangCapService.Dto;
using Hinet.Service.QLNhanSu.NS_BangCapService.ViewModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.QLNhanSu.NS_BangCapService
{
    public class NS_BangCapService : Service<NS_BangCap>, INS_BangCapService
    {
        public NS_BangCapService(
                       INS_BangCapRepository nS_BangCapRepository
                       ) : base(nS_BangCapRepository)
        {
        }
        public async Task<PagedList<NS_BangCapDto>> GetData(NS_BangCapSearch search)
        {
            var query = from q in GetQueryable()
                        select new NS_BangCapDto()
                        {
                            Id = q.Id,
                            NhanSuId = q.NhanSuId,
                            TrinhDoId = q.TrinhDoId,
                            NoiCap = q.NoiCap,
                            NgayCap = q.NgayCap,
                            CreatedDate = q.CreatedDate,
                            GhiChu = q.GhiChu
                        };

            if (search != null)
            {
                if (search.NhanSuId.HasValue)
                {
                    query = query.Where(x => x.NhanSuId == search.NhanSuId.Value);
                }
                if (search.TrinhDoId.HasValue)
                {
                    query = query.Where(x => x.TrinhDoId == search.TrinhDoId.Value);
                }
                if (!string.IsNullOrEmpty(search.NoiCap))
                {
                    query = query.Where(x => EF.Functions.Like(x.NoiCap, $"{search.NoiCap}"));
                }
                if (search.NgayCap.HasValue)
                {
                    query = query.Where(x => x.NgayCap == search.NgayCap.Value);
                }
                if (!string.IsNullOrEmpty(search.GhiChu))
                {
                    query = query.Where(x => EF.Functions.Like(x.GhiChu, $"%{search.GhiChu}%"));
                }
            }
            query = query.OrderByDescending(x => x.CreatedDate);
            var result = await PagedList<NS_BangCapDto>.CreateAsync(query, search);
            return result;
        }

        public async Task<NS_BangCapDto?> GetDto(Guid id)
        {
            var query = await (from q in GetQueryable().Where(x => x.Id == id)
                               select new NS_BangCapDto()
                               {
                                   Id = q.Id,
                                   NhanSuId = q.NhanSuId,
                                   TrinhDoId = q.TrinhDoId,
                                   NoiCap = q.NoiCap,
                                   NgayCap = q.NgayCap,
                                   GhiChu = q.GhiChu
                               }).FirstOrDefaultAsync();
            return query;
        }
    }
}
