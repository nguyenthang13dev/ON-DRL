using Hinet.Model.Entities;
using Hinet.Repository.LienHeRepository;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.LienHeService.Dto;
using Hinet.Service.XaService.Dto;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.LienHeService
{
    public class LienHeService : Service<LienHe>, ILienHeService
    {
        public LienHeService(ILienHeRepository lienHeRepository) : base(lienHeRepository)
        {

        }


        public async Task<PagedList<LienHeDto>> GetDataAll(LienHeSearchDto search)
        {
            try
            {
                var q = from lh in GetQueryable()
                        select new LienHeDto
                        {
                            CreatedBy = lh.CreatedBy,
                            CreatedDate = lh.CreatedDate,
                            Id = lh.Id,
                            UpdatedBy = lh.UpdatedBy,
                            UpdatedDate = lh.UpdatedDate,
                            HoTen = lh.HoTen,
                            Email = lh.Email,
                            SDT = lh.SDT,
                            CreatedId = lh.CreatedId,
                            UpdatedId = lh.UpdatedId,
                            DeleteId = lh.DeleteId,
                            DeleteTime = lh.DeleteTime,
                            IsDelete = lh.IsDelete
                        };
                if (search != null)
                {
                    if (!string.IsNullOrEmpty(search.NameFilter))
                    {
                        q = q.Where(x => x.HoTen.Contains(search.NameFilter));
                    }
                }
                q = q.OrderByDescending(x => x.CreatedDate);
                return await PagedList<LienHeDto>.CreateAsync(q, search);
            }
            catch (Exception ex) {
                throw new Exception("Failed to retrieve LienHe data: " + ex.Message);
            }
        }
        public async Task<LienHe> GetById(Guid id)
        {
            return await GetById(id);
        }
        public async Task<LienHeDto> GetDtoByID(Guid id)
        {
            try
            {
                var q = from lh in GetQueryable().Where(x => x.Id == id)
                        select new LienHeDto
                        {
                            CreatedBy = lh.CreatedBy,
                            CreatedDate = lh.CreatedDate,
                            Id = lh.Id,
                            UpdatedBy = lh.UpdatedBy,
                            UpdatedDate = lh.UpdatedDate,
                            HoTen = lh.HoTen,
                            Email = lh.Email,
                            SDT = lh.SDT,
                            CreatedId = lh.CreatedId,
                            UpdatedId = lh.UpdatedId,
                            DeleteId = lh.DeleteId,
                            DeleteTime = lh.DeleteTime,
                            IsDelete = lh.IsDelete
                        }; 
                return await q.FirstOrDefaultAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve LienHe data: " + ex.Message);
            }
        }
    }
}
