using Hinet.Model.Entities;
using Hinet.Repository.SystemLogsRepository;
using Hinet.Service.Common.Service;
using Hinet.Service.SystemLogsService.Dto;
using Hinet.Service.Common;
using Hinet.Service.Dto;
using Microsoft.EntityFrameworkCore;
using Hinet.Repository.AppUserRepository;
using Hinet.Repository.DM_DuLieuDanhMucRepository;



namespace Hinet.Service.SystemLogsService
{
	

    public class SystemLogsService : Service<SystemLogs>, ISystemLogsService
    {
        private readonly IAppUserRepository _appUserRepository;
        private readonly IDM_DuLieuDanhMucRepository _dM_DuLieuDanhMucRepository;
        public SystemLogsService(
			IAppUserRepository appUserRepository,
			IDM_DuLieuDanhMucRepository dM_DuLieuDanhMucRepository,
            ISystemLogsRepository systemLogsRepository
            ) : base(systemLogsRepository)
        {
			this._appUserRepository = appUserRepository;
			this._dM_DuLieuDanhMucRepository = dM_DuLieuDanhMucRepository;
            
        }

        public async Task<PagedList<SystemLogsDto>> GetData(SystemLogsSearch search)
        {
            var query = from q in GetQueryable()
                        join AppUser in _appUserRepository.GetQueryable()
						on q.UserId equals AppUser.Id into AppUserGroup
						from fAppUser in AppUserGroup.DefaultIfEmpty()

						join dmMaQuanLy  in _dM_DuLieuDanhMucRepository.GetQueryable()
						on q.MaQuanLyId equals dmMaQuanLy.Id into groupMaQuanLy
						from fDMMaQuanLy in groupMaQuanLy.DefaultIfEmpty()
                        select new SystemLogsDto()
                        {
                            UserId = q.UserId,
							UserName = q.UserName,
							Timestamp = q.Timestamp,
							IPAddress = q.IPAddress,
							Level = q.Level,
							Message = q.Message,
							MaQuanLyId = q.MaQuanLyId,
							AppUserName = fAppUser != null ? fAppUser.Name : null,
							MaQuanLyName = fDMMaQuanLy != null ? fDMMaQuanLy.Name : null,
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
                if(!string.IsNullOrEmpty(search.UserName))
				{
					query = query.Where(x => EF.Functions.Like(x.UserName, $"%{search.UserName}%"));
				}
				if(search.TimestampFrom.HasValue)
				{
					query = query.Where(x => x.Timestamp >= search.TimestampFrom);
				}
				if(search.TimestampTo.HasValue)
				{
					query = query.Where(x => x.Timestamp <= search.TimestampTo);
				}
				if(!string.IsNullOrEmpty(search.IPAddress))
				{
					query = query.Where(x => EF.Functions.Like(x.IPAddress, $"%{search.IPAddress}%"));
				}
				if(!string.IsNullOrEmpty(search.Level))
				{
					query = query.Where(x => EF.Functions.Like(x.Level, $"%{search.Level}%"));
				}
				if(!string.IsNullOrEmpty(search.Message))
				{
					query = query.Where(x => EF.Functions.Like(x.Message, $"%{search.Message}%"));
				}
            }
            query = query.OrderByDescending(x=>x.CreatedDate);
            var result = await PagedList<SystemLogsDto>.CreateAsync(query, search);
            return result;
        }

        public async Task<SystemLogsDto?> GetDto(Guid id)
        {
            var item = await (from q in GetQueryable().Where(x=>x.Id == id)
                        join AppUser in _appUserRepository.GetQueryable()
						on q.UserId equals AppUser.Id into AppUserGroup
						from fAppUser in AppUserGroup.DefaultIfEmpty()

						join dmMaQuanLy  in _dM_DuLieuDanhMucRepository.GetQueryable()
						on q.MaQuanLyId equals dmMaQuanLy.Id into groupMaQuanLy
						from fDMMaQuanLy in groupMaQuanLy.DefaultIfEmpty()
                        select new SystemLogsDto()
                        {
                            UserId = q.UserId,
							UserName = q.UserName,
							Timestamp = q.Timestamp,
							IPAddress = q.IPAddress,
							Level = q.Level,
							Message = q.Message,
							MaQuanLyId = q.MaQuanLyId,
							AppUserName = fAppUser != null ? fAppUser.Name : null,
							MaQuanLyName = fDMMaQuanLy != null ? fDMMaQuanLy.Name : null,
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
