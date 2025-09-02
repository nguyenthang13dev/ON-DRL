using Microsoft.EntityFrameworkCore;
using Hinet.Model.Entities;


namespace Hinet.Repository.GroupUserRoleRepository
{
    public class GroupUserRoleRepository : Repository<GroupUserRole>, IGroupUserRoleRepository
    {
        public GroupUserRoleRepository(DbContext context) : base(context)
        {
        }
    }
}
