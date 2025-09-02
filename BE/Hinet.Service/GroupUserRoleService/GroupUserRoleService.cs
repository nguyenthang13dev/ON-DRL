using Hinet.Model.Entities;
using Hinet.Repository.GroupUserRoleRepository;
using Hinet.Service.Common.Service;
using Hinet.Service.GroupUserRoleService.Dto;
using Hinet.Service.Common;
using Hinet.Service.Dto;
using Microsoft.EntityFrameworkCore;

namespace Hinet.Service.GroupUserRoleService
{
    public class GroupUserRoleService : Service<GroupUserRole>, IGroupUserRoleService
    {
        public GroupUserRoleService(
            IGroupUserRoleRepository groupUserRoleRepository
            ) : base(groupUserRoleRepository)
        {
        }

        public async Task<PagedList<GroupUserRoleDto>> GetData(GroupUserRoleSearch search)
        {
            var query = from q in GetQueryable()
                        select new GroupUserRoleDto()
                        {
                            GroupUserId = q.GroupUserId,
							RoleId = q.RoleId,
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
                if(search.GroupUserId.HasValue)
				{
					query = query.Where(x => x.GroupUserId == search.GroupUserId);
				}
				if(search.RoleId.HasValue)
				{
					query = query.Where(x => x.RoleId == search.RoleId);
				}
            }
            query = query.OrderByDescending(x=>x.CreatedDate);
            var result = await PagedList<GroupUserRoleDto>.CreateAsync(query, search);
            return result;
        }

        public async Task<GroupUserRoleDto?> GetDto(Guid id)
        {
            var item = await (from q in GetQueryable().Where(x=>x.Id == id)
                        select new GroupUserRoleDto()
                        {
                            GroupUserId = q.GroupUserId,
							RoleId = q.RoleId,
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
