using Hinet.Model.Entities;
using Hinet.Repository.EmailThongBaoRepository;
using Hinet.Service.Common.Service;
using Hinet.Service.EmailThongBaoService.Dto;
using Hinet.Service.Common;
using Hinet.Service.Dto;
using Microsoft.EntityFrameworkCore;



namespace Hinet.Service.EmailThongBaoService
{
    public class EmailThongBaoService : Service<EmailThongBao>, IEmailThongBaoService
    {

        public EmailThongBaoService(
            IEmailThongBaoRepository emailThongBaoRepository
            ) : base(emailThongBaoRepository)
        {
            
        }

        public async Task<PagedList<EmailThongBaoDto>> GetData(EmailThongBaoSearch search)
        {
            var query = from q in GetQueryable()
                        
                        select new EmailThongBaoDto()
                        {
                            Ma = q.Ma,
							NoiDung = q.NoiDung,
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
                if(!string.IsNullOrEmpty(search.Ma))
				{
					query = query.Where(x => EF.Functions.Like(x.Ma.Trim().ToLower(), $"%{search.Ma.Trim().ToLower()}%"));
				}
				if(!string.IsNullOrEmpty(search.NoiDung))
				{
					query = query.Where(x => EF.Functions.Like(x.NoiDung.Trim().ToLower(), $"%{search.NoiDung.Trim().ToLower()}%"));
				}
            }
            query = query.OrderByDescending(x=>x.CreatedDate);
            var result = await PagedList<EmailThongBaoDto>.CreateAsync(query, search);
            return result;
        }

        public async Task<EmailThongBaoDto?> GetDto(Guid id)
        {
            var item = await (from q in GetQueryable().Where(x=>x.Id == id)
                        
                        select new EmailThongBaoDto()
                        {
                            Ma = q.Ma,
							NoiDung = q.NoiDung,
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
