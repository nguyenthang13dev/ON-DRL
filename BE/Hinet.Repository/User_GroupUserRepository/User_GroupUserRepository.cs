using Hinet.Model;
using Hinet.Model.Entities;


namespace Hinet.Repository.User_GroupUserRepository
{
    public class User_GroupUserRepository : Repository<User_GroupUser>, IUser_GroupUserRepository
    {
        public User_GroupUserRepository(HinetMongoContext context) : base(context)
        {
        }
    }
}
