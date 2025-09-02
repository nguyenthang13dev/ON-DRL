using Hinet.Model.Entities;
using Hinet.Repository.FileSecurityRepository;
using Hinet.Service.Common.Service;
using Hinet.Service.FileSecurityService.Dto;
using Hinet.Service.Common;
using Hinet.Service.Dto;
using Microsoft.EntityFrameworkCore;



namespace Hinet.Service.FileSecurityService
{
    public class FileSecurityService : Service<FileSecurity>, IFileSecurityService
    {

        public FileSecurityService(
            IFileSecurityRepository fileSecurityRepository
            ) : base(fileSecurityRepository)
        {
            
        }

        public async Task<PagedList<FileSecurityDto>> GetData(FileSecuritySearch search)
        {
            var query = from q in GetQueryable()
                        
                        select new FileSecurityDto()
                        {
                            SharedByID = q.SharedByID,
							FileID = q.FileID,
							SharedToType = q.SharedToType,
							SharedToID = q.SharedToID,
							CanRead = q.CanRead,
							CanWrite = q.CanWrite,
							CanDelete = q.CanDelete,
							CanShare = q.CanShare,
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
                if(search.SharedByID.HasValue)
				{
					query = query.Where(x => x.SharedByID == search.SharedByID);
				}
				if(search.fileID.HasValue)
				{
					query = query.Where(x => x.FileID == search.fileID);
				}
				if(!string.IsNullOrEmpty(search.SharedToType))
				{
					query = query.Where(x => EF.Functions.Like(x.SharedToType, $"%{search.SharedToType}%"));
				}
				if(search.SharedToID.HasValue)
				{
					query = query.Where(x => x.SharedToID == search.SharedToID);
				}
				if(search.canRead.HasValue)
				{
					query = query.Where(x => x.CanRead == search.canRead);
				}
				if(search.canWrite.HasValue)
				{
					query = query.Where(x => x.CanWrite == search.canWrite);
				}
				if(search.canDelete.HasValue)
				{
					query = query.Where(x => x.CanDelete == search.canDelete);
				}
				if(search.canShare.HasValue)
				{
					query = query.Where(x => x.CanShare == search.canShare);
				}
            }
            query = query.OrderByDescending(x=>x.CreatedDate);
            var result = await PagedList<FileSecurityDto>.CreateAsync(query, search);
            return result;
        }

        public async Task<FileSecurityDto?> GetDto(Guid id)
        {
            var item = await (from q in GetQueryable().Where(x=>x.Id == id)
                        
                        select new FileSecurityDto()
                        {
                            SharedByID = q.SharedByID,
							FileID = q.FileID,
							SharedToType = q.SharedToType,
							SharedToID = q.SharedToID,
							CanRead = q.CanRead,
							CanWrite = q.CanWrite,
							CanDelete = q.CanDelete,
							CanShare = q.CanShare,
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
