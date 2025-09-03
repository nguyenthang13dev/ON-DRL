using Hinet.Model;
using Hinet.Model.Entities;


namespace Hinet.Repository.UserRoleRepository
{
    public class UserRoleRepository : Repository<UserRole>, IUserRoleRepository
    {
        public UserRoleRepository(HinetMongoContext context) : base(context)
        {
        }
    }
}
