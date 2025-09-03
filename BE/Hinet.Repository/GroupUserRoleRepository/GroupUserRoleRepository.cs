using Microsoft.EntityFrameworkCore;
using Hinet.Model.Entities;
using Hinet.Model;


namespace Hinet.Repository.GroupUserRoleRepository
{
    public class GroupUserRoleRepository : Repository<GroupUserRole>, IGroupUserRoleRepository
    {
        public GroupUserRoleRepository(HinetMongoContext context) : base(context)
        {
        }
    }
}
