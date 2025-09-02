using Hinet.Model.Entities;
using Hinet.Repository;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.QLThongBaoService.Dto;
using Hinet.Service.QLThongBaoService.ViewModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.QLThongBaoService
{
    public class QLThongBaoService : Service<QLThongBao>, IQLThongBaoService
    {
        public QLThongBaoService(IRepository<QLThongBao> repository) : base(repository)
        {
        }

        public async Task<PagedList<QLThongBaoDto>> GetData(QLThongBaoSearch search)
        {
           var query = from q in GetQueryable()
                       select new QLThongBaoDto
                       {
                           Id = q.Id,
                           TieuDe = q.TieuDe,
                           NoiDung = q.NoiDung,
                           MaThongBao = q.MaThongBao,
                           LoaiThongBao = q.LoaiThongBao,
                           CreatedDate = q.CreatedDate,
                       };
                if (!string.IsNullOrEmpty(search.TieuDe))
                {
                    query = query.Where((x => EF.Functions.Like(x.TieuDe, $"%{search.TieuDe}%")));
                }
                if (!string.IsNullOrEmpty(search.LoaiThongBao))
                {
                    query = query.Where((x => EF.Functions.Like(x.LoaiThongBao, $"%{search.LoaiThongBao}%")));
                }
          
            query = query.OrderByDescending(x=>x.CreatedDate);
            return await  PagedList<QLThongBaoDto>.CreateAsync(query, search);
        }
    }
}
