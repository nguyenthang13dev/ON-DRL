using Hinet.Model;
using Hinet.Model.Entities;

namespace Hinet.Repository.UserRoleRepository
{
    public class UserDonViRepository : Repository<UserDonVi>, IUserDonViRepository
    {
        public UserDonViRepository(HinetMongoContext context) : base(context)
        {
        }
    }
}