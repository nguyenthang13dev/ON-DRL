using Microsoft.EntityFrameworkCore;
using Hinet.Model.Entities;
using Hinet.Model;


namespace Hinet.Repository.GroupUserRepository
{
    public class GroupUserRepository : Repository<GroupUser>, IGroupUserRepository
    {
        public GroupUserRepository(HinetMongoContext context) : base(context)
        {
        }
    }
}
