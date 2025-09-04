using Hinet.Model.Entities;
using Hinet.Repository.GroupUserRepository;
using Hinet.Service.Common.Service;
using Hinet.Service.GroupUserService.Dto;
using Hinet.Service.Common;
using Hinet.Service.Dto;
using Hinet.Model.Entities;
using Hinet.Repository.RoleRepository;
using Hinet.Repository.GroupUserRoleRepository;
using MongoDB.Driver.Linq;
using Microsoft.EntityFrameworkCore;

namespace Hinet.Service.GroupUserService
{
    public class GroupUserService : Service<GroupUser>, IGroupUserService
    {
        private readonly IRoleRepository _roleRepository;
        private readonly IGroupUserRoleRepository _groupUserRoleRepository;
        public GroupUserService(
            IGroupUserRepository groupUserRepository
, IRoleRepository roleRepository,
IGroupUserRoleRepository groupUserRoleRepository) : base(groupUserRepository)
        {
            _roleRepository = roleRepository;
            _groupUserRoleRepository = groupUserRoleRepository;
        }

        public async Task<PagedList<GroupUserDto>> GetData(GroupUserSearch search)
        {
            var groupUserRoles = _roleRepository.GetInMemoryQueryable()
                .Join(_groupUserRoleRepository.GetInMemoryQueryable(),
                role => role.Id,
                gur => gur.RoleId,
                (role, gur) => new { roles = role, groupUserRoles = gur });

            var query = GetInMemoryQueryable()
                        .GroupJoin(groupUserRoles,
                        q => q.Id,
                        gur => gur.groupUserRoles.GroupUserId,
                        (q, gur) => new GroupUserDto
                        {
                            Name = q.Name,
                            Code = q.Code,
                            CreatedBy = q.CreatedBy,

                            CreatedId=q.CreatedId,
                            UpdatedBy = q.UpdatedBy,
                            IsDelete = q.IsDelete,
                            DeleteId = q.DeleteId,
                            CreatedDate = q.CreatedDate,
                            UpdatedDate = q.UpdatedDate,
                            DeleteTime = q.DeleteTime,
                            Id = q.Id,
                            DepartmentId = q.DepartmentId,
                            RoleIds = gur.Any() ? gur.Select(x => x.groupUserRoles.RoleId).ToList() : null,
                            RoleNames = gur.Any() ? gur.Select(x => x.roles.Name).ToList() : null
                        });

            if (search != null)
            {
                //if (!string.IsNullOrEmpty(search.Name))
                //{
                //    query = query.Where(x => EF.Functions.Like(x.Name, $"%{search.Name}%"));
                //}
                //if (!string.IsNullOrEmpty(search.Code))
                //{
                //    query = query.Where(x => EF.Functions.Like(x.Code, $"%{search.Code}%"));
                //}
                if (search.DepartmentId != null)
                {
                    query = query.Where(x => x.DepartmentId == search.DepartmentId);
                }
            }
            query = query.OrderByDescending(x => x.CreatedDate);
            var result = await PagedList<GroupUserDto>.CreateMemoryAsync(query, search);



            return result;
        }

        public async Task<GroupUserDto?> GetDto(Guid id)
        {
            var item = await (from q in GetInMemoryQueryable().Where(x => x.Id == id)
                              select new GroupUserDto()
                              {
                                  Name = q.Name,
                                  Code = q.Code,
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
